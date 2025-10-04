const { Client } = require('pg');
const bcrypt = require('bcrypt');

function getClient() {
    const neonUrl = 'postgresql://neondb_owner:npg_HnBMTqDUc1W8@ep-still-bread-agolimhp-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || neonUrl;

    return new Client({
        connectionString: connectionString
    });
}

// Crear tabla de usuarios si no existe
async function ensureUsersTable(client) {
    await client.query(`CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        avatar TEXT,
        bio TEXT,
        user_type VARCHAR(50) DEFAULT 'user',
        school VARCHAR(255),
        grade VARCHAR(100),
        followers INTEGER DEFAULT 0,
        following INTEGER DEFAULT 0,
        is_verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
}

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const client = getClient();

    try {
        await client.connect();
        await ensureUsersTable(client);

        if (req.method === 'GET') {
            // Listar todos los usuarios para debugging
            const result = await client.query('SELECT id, email, username, name, user_type, created_at FROM users ORDER BY created_at');
            
            return res.json({
                users: result.rows,
                count: result.rows.length
            });

        } else if (req.method === 'POST') {
            // Crear usuarios por defecto si no existen
            const defaultUsers = [
                {
                    email: 'piporgz68@gmail.com',
                    username: 'Admin',
                    password: 'PaLMeRiTa1968',
                    name: 'Administrador',
                    user_type: 'Padre/Docente'
                },
                {
                    email: 'pipo68@storyup.es',
                    username: 'PIPO68',
                    password: 'PaLMeRiTa1968',
                    name: 'PIPO68',
                    user_type: 'Padre/Docente'
                }
            ];

            const results = [];

            for (const userData of defaultUsers) {
                try {
                    // Verificar si ya existe
                    const existing = await client.query(
                        'SELECT id FROM users WHERE email = $1 OR username = $2',
                        [userData.email, userData.username]
                    );

                    if (existing.rows.length === 0) {
                        // No existe, crearlo
                        const hashedPassword = await bcrypt.hash(userData.password, 10);
                        
                        const result = await client.query(
                            `INSERT INTO users (email, username, password, name, user_type) 
                             VALUES ($1, $2, $3, $4, $5) 
                             RETURNING id, email, username, name`,
                            [userData.email, userData.username, hashedPassword, userData.name, userData.user_type]
                        );

                        results.push({
                            action: 'created',
                            user: result.rows[0]
                        });
                    } else {
                        results.push({
                            action: 'already_exists',
                            user: { email: userData.email, username: userData.username }
                        });
                    }
                } catch (error) {
                    results.push({
                        action: 'error',
                        user: userData,
                        error: error.message
                    });
                }
            }

            return res.json({
                message: 'Usuarios por defecto procesados',
                results: results
            });
        }

        return res.status(405).json({ error: 'Método no permitido' });

    } catch (error) {
        console.error('Error en setup-users:', error);
        return res.status(500).json({
            error: 'Error en setup de usuarios',
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