const { updateLastActiveFromRequest } = require('./updateLastActive');

const { Client } = require('pg');
import jwt from 'jsonwebtoken';
const { assignTrophies } = require('./trophyHelper');

function getClient() {
    return new Client({
        connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/storyup'
    });
}

// Crear tablas si no existen
async function ensureTables(client) {
    // Tabla de historias
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

    // Tabla de likes
    await client.query(`CREATE TABLE IF NOT EXISTS story_likes (
        id SERIAL PRIMARY KEY,
        story_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        username VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(story_id, user_id)
    )`);

    // Tabla de comentarios
    await client.query(`CREATE TABLE IF NOT EXISTS story_comments (
        id SERIAL PRIMARY KEY,
        story_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        username VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
}

// Verificar token JWT
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
    await updateLastActiveFromRequest(req);
    const client = getClient();
    await client.connect();

    try {
        await ensureTables(client);

        if (req.method === 'GET') {
            // Obtener historias
            const { limit = 20, offset = 0, userId, visibility = 'public' } = req.query;

            let query = `
                SELECT s.*, 
                       (SELECT COUNT(*) FROM story_likes WHERE story_id = s.id) as likes,
                       (SELECT COUNT(*) FROM story_comments WHERE story_id = s.id) as comments_count
                FROM stories s 
                WHERE s.visibility = $1
            `;
            const params = [visibility];

            if (userId) {
                query += ' AND s.user_id = $2';
                params.push(userId);
            }

            query += ' ORDER BY s.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
            params.push(limit, offset);

            const result = await client.query(query, params);

            return res.json({
                stories: result.rows.map(story => ({
                    id: story.id,
                    userId: story.user_id,
                    username: story.username,
                    title: story.title,
                    content: story.content,
                    image: story.image,
                    likes: parseInt(story.likes),
                    commentsCount: parseInt(story.comments_count),
                    visibility: story.visibility,
                    isNews: story.is_news,
                    createdAt: story.created_at,
                    updatedAt: story.updated_at
                }))
            });
        }

        if (req.method === 'POST') {
            // Crear nueva historia
            const decoded = verifyToken(req);
            if (!decoded) {
                return res.status(401).json({ error: 'Token de autorización requerido' });
            }

            const { title, content, image, visibility = 'public', isNews = false } = req.body;

            if (!content || content.trim().length === 0) {
                return res.status(400).json({ error: 'El contenido es requerido' });
            }

            const result = await client.query(`
                INSERT INTO stories (user_id, username, title, content, image, visibility, is_news)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *
            `, [decoded.userId, decoded.username, title, content, image, visibility, isNews]);

            const story = result.rows[0];

            // Asignar trofeos automáticamente tras crear historia
            await assignTrophies(client, decoded.userId);

            return res.json({
                story: {
                    id: story.id,
                    userId: story.user_id,
                    username: story.username,
                    title: story.title,
                    content: story.content,
                    image: story.image,
                    likes: 0,
                    commentsCount: 0,
                    visibility: story.visibility,
                    isNews: story.is_news,
                    createdAt: story.created_at,
                    updatedAt: story.updated_at
                }
            });
        }

        if (req.method === 'PUT') {
            // Actualizar historia
            const decoded = verifyToken(req);
            if (!decoded) {
                return res.status(401).json({ error: 'Token de autorización requerido' });
            }

            const { id } = req.query;
            const { title, content, image, visibility } = req.body;

            // Verificar que la historia pertenece al usuario
            const storyCheck = await client.query(
                'SELECT user_id FROM stories WHERE id = $1',
                [id]
            );

            if (storyCheck.rows.length === 0) {
                return res.status(404).json({ error: 'Historia no encontrada' });
            }

            if (storyCheck.rows[0].user_id !== decoded.userId) {
                return res.status(403).json({ error: 'No tienes permiso para editar esta historia' });
            }

            const result = await client.query(`
                UPDATE stories 
                SET title = $1, content = $2, image = $3, visibility = $4, updated_at = CURRENT_TIMESTAMP
                WHERE id = $5
                RETURNING *
            `, [title, content, image, visibility, id]);

            const story = result.rows[0];

            return res.json({
                story: {
                    id: story.id,
                    userId: story.user_id,
                    username: story.username,
                    title: story.title,
                    content: story.content,
                    image: story.image,
                    likes: story.likes,
                    commentsCount: story.comments_count,
                    visibility: story.visibility,
                    isNews: story.is_news,
                    createdAt: story.created_at,
                    updatedAt: story.updated_at
                }
            });
        }

        if (req.method === 'DELETE') {
            // Eliminar historia
            const decoded = verifyToken(req);
            if (!decoded) {
                return res.status(401).json({ error: 'Token de autorización requerido' });
            }

            const { id } = req.query;

            // Verificar que la historia pertenece al usuario
            const storyCheck = await client.query(
                'SELECT user_id FROM stories WHERE id = $1',
                [id]
            );

            if (storyCheck.rows.length === 0) {
                return res.status(404).json({ error: 'Historia no encontrada' });
            }

            if (storyCheck.rows[0].user_id !== decoded.userId) {
                return res.status(403).json({ error: 'No tienes permiso para eliminar esta historia' });
            }

            // Eliminar likes, comentarios y la historia
            await client.query('DELETE FROM story_likes WHERE story_id = $1', [id]);
            await client.query('DELETE FROM story_comments WHERE story_id = $1', [id]);
            await client.query('DELETE FROM stories WHERE id = $1', [id]);

            return res.json({ success: true, message: 'Historia eliminada correctamente' });
        }

        return res.status(405).json({ error: 'Método no permitido' });

    } catch (error) {
        console.error('Error en stories API:', error);
        return res.status(500).json({ error: error.message });
    } finally {
        await client.end();
    }
}