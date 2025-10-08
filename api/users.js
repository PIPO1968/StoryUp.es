require('dotenv').config();
const { Client } = require('pg');

function getClient() {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!connectionString) {
        throw new Error('No se ha definido la variable de entorno DATABASE_URL o POSTGRES_URL para la conexión a Neon.');
    }
    return new Client({ connectionString });
}

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        const client = getClient();
        await client.connect();
        try {
            // Obtener el total de usuarios
            const countResult = await client.query('SELECT COUNT(*) AS total FROM users');
            // Obtener la lista de usuarios (solo id, username, email)
            const listResult = await client.query('SELECT id, username, email FROM users ORDER BY id');
            await client.end();
            return res.status(200).json({
                total: parseInt(countResult.rows[0].total, 10),
                users: listResult.rows
            });
        } catch (error) {
            await client.end();
            return res.status(500).json({ error: error.message });
        }
    }

    return res.status(405).json({ error: 'Método no permitido' });
};
