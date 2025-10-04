const { Client } = require('pg');

function getClient() {
    // Hardcode temporal de la URL de Neon para testing
    const neonUrl = 'postgresql://neondb_owner:npg_HnBMTqDUc1W8@ep-still-bread-agolimhp-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || neonUrl;

    return new Client({
        connectionString: connectionString
    });
}

module.exports = async function handler(req, res) {
    // Agregar headers CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const client = getClient();

    try {
        await client.connect();

        // Verificar si hay usuarios en la base de datos
        const result = await client.query('SELECT COUNT(*) as count FROM users');
        const userCount = parseInt(result.rows[0].count);

        return res.json({
            hasUsers: userCount > 0,
            userCount: userCount
        });
    } catch (error) {
        console.error('Error verificando usuarios:', error);
        return res.status(500).json({
            error: 'Error verificando usuarios',
            details: error.message
        });
    } finally {
        try {
            await client.end();
        } catch (clientError) {
            console.error('Error cerrando conexión:', clientError);
        }
    }
};