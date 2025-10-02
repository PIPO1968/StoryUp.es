const { Client } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function getClient() {
    console.log('=== DEBUG VARIABLES DE ENTORNO ===');
    console.log('DATABASE_URL existe:', !!process.env.DATABASE_URL);
    console.log('POSTGRES_URL existe:', !!process.env.POSTGRES_URL);
    
    // Hardcode temporal de la URL de Neon para testing
    const neonUrl = 'postgresql://neondb_owner:npg_HnBMTqDUc1W8@ep-still-bread-agolimhp-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
    
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || neonUrl;
    console.log('Usando conexión a:', connectionString.includes('neon') ? 'NEON DATABASE' : 'LOCAL/OTHER');
    
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
    // Agregar headers CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const client = getClient();

    try {
        console.log('Conectando a la base de datos...');
        await client.connect();
        console.log('Conexión exitosa');

        await ensureUsersTable(client);

        if (req.method === 'POST') {
            console.log('POST request recibido');
            console.log('Body:', JSON.stringify(req.body));
            
            const { email, password, username, name } = req.body;

            if (!email || !password) {
                console.log('Error: Email o contraseña faltantes');
                return res.status(400).json({ error: 'Email y contraseña requeridos' });
            }
            
            console.log('Datos válidos recibidos:', { email, username, name });

            // Verificar si el usuario ya existe
            const existingUser = await client.query(
                'SELECT * FROM users WHERE email = $1 OR username = $2',
                [email, username]
            );

            if (existingUser.rows.length > 0) {
                // Login
                const user = existingUser.rows[0];
                const isValidPassword = await bcrypt.compare(password, user.password);

                if (!isValidPassword) {
                    return res.status(400).json({ error: 'Contraseña incorrecta' });
                }

                const token = jwt.sign(
                    {
                        userId: user.id,
                        email: user.email,
                        username: user.username
                    },
                    process.env.JWT_SECRET || 'storyup-secret-key',
                    { expiresIn: '7d' }
                );

                return res.json({
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                        username: user.username,
                        name: user.name,
                        avatar: user.avatar,
                        bio: user.bio,
                        userType: user.user_type,
                        school: user.school,
                        grade: user.grade,
                        followers: user.followers,
                        following: user.following,
                        isVerified: user.is_verified
                    }
                });
            } else {
                // Registro
                console.log('Iniciando proceso de registro para:', email);
                if (!username) {
                    console.log('Error: Username faltante');
                    return res.status(400).json({ error: 'Nombre de usuario requerido para registro' });
                }

                console.log('Hasheando contraseña...');
                const hashedPassword = await bcrypt.hash(password, 10);
                console.log('Contraseña hasheada exitosamente');

                console.log('Insertando usuario en la base de datos...');
                const result = await client.query(
                    `INSERT INTO users (email, username, password, name) 
                     VALUES ($1, $2, $3, $4) 
                     RETURNING id, email, username, name, avatar, bio, user_type, school, grade, followers, following, is_verified`,
                    [email, username, hashedPassword, name || username]
                );

                console.log('Usuario insertado exitosamente');
                const newUser = result.rows[0];

                const token = jwt.sign(
                    {
                        userId: newUser.id,
                        email: newUser.email,
                        username: newUser.username
                    },
                    process.env.JWT_SECRET || 'storyup-secret-key',
                    { expiresIn: '7d' }
                );

                return res.json({
                    token,
                    user: {
                        id: newUser.id,
                        email: newUser.email,
                        username: newUser.username,
                        name: newUser.name,
                        avatar: newUser.avatar,
                        bio: newUser.bio,
                        userType: newUser.user_type,
                        school: newUser.school,
                        grade: newUser.grade,
                        followers: newUser.followers,
                        following: newUser.following,
                        isVerified: newUser.is_verified
                    }
                });
            }
        } else if (req.method === 'GET') {
            // Obtener perfil de usuario
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ error: 'Token de autorización requerido' });
            }

            const token = authHeader.split(' ')[1];

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'storyup-secret-key');

                const result = await client.query(
                    'SELECT id, email, username, name, avatar, bio, user_type, school, grade, followers, following, is_verified FROM users WHERE id = $1',
                    [decoded.userId]
                );

                if (result.rows.length === 0) {
                    return res.status(404).json({ error: 'Usuario no encontrado' });
                }

                const user = result.rows[0];
                return res.json({
                    user: {
                        id: user.id,
                        email: user.email,
                        username: user.username,
                        name: user.name,
                        avatar: user.avatar,
                        bio: user.bio,
                        userType: user.user_type,
                        school: user.school,
                        grade: user.grade,
                        followers: user.followers,
                        following: user.following,
                        isVerified: user.is_verified
                    }
                });
            } catch (error) {
                return res.status(401).json({ error: 'Token inválido' });
            }
        } else {
            return res.status(405).json({ error: 'Método no permitido' });
        }
    } catch (error) {
        console.error('Error en auth API:', error);
        return res.status(500).json({
            error: 'Error interno del servidor',
            details: error.message || 'Error desconocido'
        });
    } finally {
        try {
            await client.end();
        } catch (clientError) {
            console.error('Error cerrando conexión:', clientError);
        }
    }
}