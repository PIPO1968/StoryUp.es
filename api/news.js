const { Client } = require('pg');

function getClient() {
    const neonUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || 'postgresql://user:password@localhost:5432/storyup';
    return new Client({ connectionString: neonUrl });
}

module.exports = async function handler(req, res) {
    if (req.method === 'POST') {
        const { title, content, author, createdAt } = req.body;
        if (!title || !content || !author) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }
        const client = getClient();
        await client.connect();
        await client.query(`CREATE TABLE IF NOT EXISTS news (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            author VARCHAR(128) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
        await client.query(
            'INSERT INTO news (title, content, author, created_at) VALUES ($1, $2, $3, $4)',
            [title, content, author, createdAt || new Date().toISOString()]
        );
        await client.end();
        return res.status(200).json({ success: true });
    }
    if (req.method === 'GET') {
        const client = getClient();
        await client.connect();
        const result = await client.query('SELECT * FROM news ORDER BY created_at DESC');
        await client.end();
        return res.status(200).json({ news: result.rows });
    }
    return res.status(405).json({ error: 'Método no permitido' });
};
