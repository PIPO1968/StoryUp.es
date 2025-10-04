const { Client } = require('pg');

function getClient() {
    // Hardcode temporal de la URL de Neon para testing
    const neonUrl = 'postgresql://neondb_owner:npg_HnBMTqDUc1W8@ep-still-bread-agolimhp-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || neonUrl;

    return new Client({
        connectionString: connectionString
    });
}

// Función para obtener la IP real del usuario
function getRealIP(req) {
    return req.headers['x-forwarded-for'] ||
        req.headers['x-real-ip'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
        '127.0.0.1';
}

// Crear tabla de IPs registradas si no existe
async function ensureIPsTable(client) {
    await client.query(`CREATE TABLE IF NOT EXISTS registered_ips (
        id SERIAL PRIMARY KEY,
        ip_address VARCHAR(45) UNIQUE NOT NULL,
        first_registered TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_count INTEGER DEFAULT 0
    )`);
}

module.exports = async function handler(req, res) {
    // Agregar headers CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const client = getClient();

    try {
        await client.connect();
        await ensureIPsTable(client);

        const userIP = getRealIP(req);
        console.log('IP detectada:', userIP);

        if (req.method === 'GET') {
            // Verificar si la IP ya está registrada
            const result = await client.query(
                'SELECT * FROM registered_ips WHERE ip_address = $1',
                [userIP]
            );

            const isKnownIP = result.rows.length > 0;

            // Actualizar last_seen si es IP conocida
            if (isKnownIP) {
                await client.query(
                    'UPDATE registered_ips SET last_seen = CURRENT_TIMESTAMP WHERE ip_address = $1',
                    [userIP]
                );
            }

            return res.json({
                ip: userIP,
                isKnownIP: isKnownIP,
                shouldShowRegister: !isKnownIP, // Nueva IP = mostrar registro
                data: isKnownIP ? result.rows[0] : null
            });

        } else if (req.method === 'POST') {
            // Registrar nueva IP después de que un usuario se registre
            try {
                await client.query(
                    `INSERT INTO registered_ips (ip_address, user_count) 
                     VALUES ($1, 1) 
                     ON CONFLICT (ip_address) 
                     DO UPDATE SET user_count = registered_ips.user_count + 1, last_seen = CURRENT_TIMESTAMP`,
                    [userIP]
                );

                return res.json({
                    success: true,
                    message: 'IP registrada exitosamente',
                    ip: userIP
                });
            } catch (error) {
                console.error('Error registrando IP:', error);
                return res.status(500).json({ error: 'Error registrando IP' });
            }
        } else {
            return res.status(405).json({ error: 'Método no permitido' });
        }

    } catch (error) {
        console.error('Error en check-ip API:', error);
        return res.status(500).json({
            error: 'Error verificando IP',
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