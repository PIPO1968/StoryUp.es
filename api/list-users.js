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
        
        // Obtener todos los usuarios registrados (sin contraseñas por seguridad)
        const result = await client.query(`
            SELECT id, email, username, name, user_type, created_at, is_verified 
            FROM users 
            ORDER BY created_at DESC
        `);
        
        return res.json({
            users: result.rows,
            count: result.rows.length
        });
    } catch (error) {
        console.error('Error obteniendo usuarios:', error);
        return res.status(500).json({
            error: 'Error obteniendo usuarios',
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