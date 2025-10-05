
const { Client } = require('pg');

const { Client } = require('pg');

function getClient() {
    const neonUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || 'postgresql://user:password@localhost:5432/storyup';
    return new Client({ connectionString: neonUrl });
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { title, description, startDate, endDate, winner, creatorUsername } = req.body;
        if (!title || !description || !startDate || !endDate || !creatorUsername) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }
        const client = getClient();
        await client.connect();
        await client.query(`CREATE TABLE IF NOT EXISTS contests (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            creator_username VARCHAR(128) NOT NULL,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            winner VARCHAR(128),
            status VARCHAR(32) DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
        await client.query(
            'INSERT INTO contests (title, description, creator_username, start_date, end_date, winner) VALUES ($1, $2, $3, $4, $5, $6)',
            [title, description, creatorUsername, startDate, endDate, winner || null]
        );
        await client.end();
        return res.status(200).json({ success: true });
    }
    if (req.method === 'GET') {
        const client = getClient();
        await client.connect();
        const result = await client.query('SELECT * FROM contests ORDER BY created_at DESC');
        await client.end();
        return res.status(200).json({ contests: result.rows });
    }
    return res.status(405).json({ error: 'Método no permitido' });
}
