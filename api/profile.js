// Endpoint fusionado para perfil, likes, comentarios, mensajes, historias y contactos
const { Client } = require('pg');
const jwt = require('jsonwebtoken');
const { assignTrophies } = require('./trophyHelper');

function getClient() {
    return new Client({
        connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/storyup'
    });
}

function verifyToken(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;
    const token = authHeader.split(' ')[1];
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'storyup-secret-key');
    } catch {
        return null;
    }
}

module.exports = async function handler(req, res) {
    const client = getClient();
    await client.connect();
    try {
        // --- USUARIO ---
        if (req.method === 'GET' && req.url.includes('/profile/trophies')) {
            const { id } = req.query;
            if (!id) return res.status(400).json({ error: 'Falta el id de usuario' });
            await client.query(`CREATE TABLE IF NOT EXISTS user_trophies (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                trophy_name VARCHAR(128) NOT NULL,
                trophy_icon VARCHAR(32),
                awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`);
            const trophiesRes = await client.query('SELECT trophy_name, trophy_icon, awarded_at FROM user_trophies WHERE user_id = $1', [id]);
            return res.status(200).json({ trophies: trophiesRes.rows });
        }
        if (req.method === 'GET' && req.url.includes('/profile/likes')) {
            const { id } = req.query;
            if (!id) return res.status(400).json({ error: 'Falta el id de usuario' });
            const storiesLikesRes = await client.query('SELECT SUM(likes) as story_likes FROM historias WHERE author_id = $1', [id]);
            const storyLikes = storiesLikesRes.rows[0]?.story_likes || 0;
            const userRes = await client.query('SELECT likes FROM usuarios WHERE id = $1', [id]);
            const panelLikes = userRes.rows[0]?.likes || 0;
            const contestRes = await client.query('SELECT SUM(likes) as contest_likes FROM concursos WHERE ganador_id = $1', [id]);
            const contestLikes = contestRes.rows[0]?.contest_likes || 0;
            return res.status(200).json({
                totalLikes: storyLikes + panelLikes + contestLikes,
                storyLikes,
                panelLikes,
                contestLikes
            });
        }
        // --- HISTORIAS ---
        if (req.method === 'POST' && req.url.includes('/profile/story')) {
            const decoded = verifyToken(req);
            if (!decoded) return res.status(401).json({ error: 'Token requerido' });
            const { title, content, image } = req.body;
            if (!title || !content) return res.status(400).json({ error: 'Faltan datos' });
            await client.query(`CREATE TABLE IF NOT EXISTS stories (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                username VARCHAR(255) NOT NULL,
                title VARCHAR(500),
                content TEXT NOT NULL,
                image TEXT,
                likes INTEGER DEFAULT 0,
                comments_count INTEGER DEFAULT 0,
                visibility VARCHAR(50) DEFAULT 'public',
                is_news BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`);
            await client.query('INSERT INTO stories (user_id, username, title, content, image) VALUES ($1, $2, $3, $4, $5)', [decoded.userId, decoded.username, title, content, image]);
            await assignTrophies(client, decoded.userId);
            return res.status(200).json({ success: true });
        }
        // --- LIKES ---
        if (req.method === 'POST' && req.url.includes('/profile/like')) {
            const decoded = verifyToken(req);
            if (!decoded) return res.status(401).json({ error: 'Token requerido' });
            const { storyId } = req.body;
            if (!storyId) return res.status(400).json({ error: 'ID de historia requerido' });
            const storyCheck = await client.query('SELECT id, user_id FROM stories WHERE id = $1', [storyId]);
            if (storyCheck.rows.length === 0) return res.status(404).json({ error: 'Historia no encontrada' });
            const authorId = storyCheck.rows[0].user_id;
            await client.query('INSERT INTO story_likes (story_id, user_id, username) VALUES ($1, $2, $3)', [storyId, decoded.userId, decoded.username]);
            await client.query('UPDATE usuarios SET likes = likes + 1 WHERE id = $1', [authorId]);
            return res.status(200).json({ success: true });
        }
        // --- COMENTARIOS ---
        if (req.method === 'GET' && req.url.includes('/profile/comments')) {
            const { storyId, limit = 20, offset = 0 } = req.query;
            if (!storyId) return res.status(400).json({ error: 'ID de historia requerido' });
            const result = await client.query(`
                SELECT c.*, u.name, u.avatar
                FROM story_comments c
                LEFT JOIN users u ON c.user_id = u.id
                WHERE c.story_id = $1
                ORDER BY c.created_at ASC
                LIMIT $2 OFFSET $3
            `, [storyId, limit, offset]);
            return res.json({
                comments: result.rows.map(comment => ({
                    id: comment.id,
                    storyId: comment.story_id,
                    userId: comment.user_id,
                    username: comment.username,
                    name: comment.name,
                    avatar: comment.avatar,
                    content: comment.content,
                    createdAt: comment.created_at
                }))
            });
        }
        if (req.method === 'POST' && req.url.includes('/profile/comment')) {
            const decoded = verifyToken(req);
            if (!decoded) return res.status(401).json({ error: 'Token requerido' });
            const { storyId, content } = req.body;
            if (!storyId || !content) return res.status(400).json({ error: 'Datos requeridos' });
            await client.query('INSERT INTO story_comments (story_id, user_id, username, content) VALUES ($1, $2, $3, $4)', [storyId, decoded.userId, decoded.username, content]);
            await assignTrophies(client, decoded.userId);
            return res.status(200).json({ success: true });
        }
        // --- MENSAJES ---
        if (req.method === 'POST' && req.url.includes('/profile/message')) {
            const { from, to, content } = req.body;
            if (!from || !to || !content) return res.status(400).json({ error: 'Faltan campos requeridos' });
            await client.query('INSERT INTO messages (sender, receiver, content) VALUES ($1, $2, $3)', [from, to, content]);
            return res.status(200).json({ success: true });
        }
        if (req.method === 'GET' && req.url.includes('/profile/messages')) {
            const { from, to } = req.query;
            if (!from || !to) return res.status(400).json({ error: 'Faltan parámetros' });
            const result = await client.query('SELECT * FROM messages WHERE (sender = $1 AND receiver = $2) OR (sender = $2 AND receiver = $1) ORDER BY created_at ASC', [from, to]);
            return res.status(200).json(result.rows);
        }
        // --- CONTACTOS ---
        if (req.method === 'POST' && req.url.includes('/profile/contact')) {
            const { user_nick, contact_nick } = req.body;
            if (!user_nick || !contact_nick) return res.status(400).json({ error: 'Faltan campos requeridos' });
            if (contact_nick === user_nick) return res.status(400).json({ error: 'No puedes agregarte a ti mismo' });
            try {
                await client.query('INSERT INTO contacts (user_nick, contact_nick) VALUES ($1, $2)', [user_nick, contact_nick]);
                return res.status(200).json({ success: true, message: 'Contacto agregado' });
            } catch (error) {
                if (error.code === '23505') {
                    return res.status(400).json({ error: 'El contacto ya existe' });
                } else {
                    throw error;
                }
            }
        }
        if (req.method === 'POST' && req.url.includes('/profile/contacts')) {
            const { user_nick } = req.body;
            if (!user_nick) return res.status(400).json({ error: 'Falta user_nick' });
            const result = await client.query("SELECT DISTINCT contact_nick as nick, contact_nick as name, '' as avatar, 0 as unread_count, false as is_online, c.created_at FROM contacts c WHERE user_nick = $1", [user_nick]);
            return res.status(200).json({ contacts: result.rows });
        }
        // Si no coincide ninguna ruta
        return res.status(404).json({ error: 'Not found' });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    } finally {
        await client.end();
    }
};
