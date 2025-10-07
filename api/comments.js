const { Client } = require('pg');
import jwt from 'jsonwebtoken';

function getClient() {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!connectionString) {
        throw new Error('No se ha definido la variable de entorno DATABASE_URL o POSTGRES_URL para la conexión a Neon.');
    }
    return new Client({ connectionString });
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
    const client = getClient();
    await client.connect();

    try {
        if (req.method === 'GET') {
            // Obtener comentarios de una historia
            const { storyId, limit = 20, offset = 0 } = req.query;

            if (!storyId) {
                return res.status(400).json({ error: 'ID de historia requerido' });
            }

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

        if (req.method === 'POST') {
            // Crear un nuevo comentario
            const decoded = verifyToken(req);
            if (!decoded) {
                return res.status(401).json({ error: 'Token de autorización requerido' });
            }

            const { storyId, content } = req.body;

            if (!storyId || !content || content.trim().length === 0) {
                return res.status(400).json({ error: 'ID de historia y contenido son requeridos' });
            }

            // Verificar que la historia existe
            const storyCheck = await client.query(
                'SELECT id FROM stories WHERE id = $1',
                [storyId]
            );

            if (storyCheck.rows.length === 0) {
                return res.status(404).json({ error: 'Historia no encontrada' });
            }

            // Insertar el comentario
            const result = await client.query(`
                INSERT INTO story_comments (story_id, user_id, username, content)
                VALUES ($1, $2, $3, $4)
                RETURNING *
            `, [storyId, decoded.userId, decoded.username, content.trim()]);

            const comment = result.rows[0];

            // Obtener información del usuario para la respuesta
            const userResult = await client.query(
                'SELECT name, avatar FROM users WHERE id = $1',
                [decoded.userId]
            );

            const user = userResult.rows[0] || {};

            return res.json({
                comment: {
                    id: comment.id,
                    storyId: comment.story_id,
                    userId: comment.user_id,
                    username: comment.username,
                    name: user.name,
                    avatar: user.avatar,
                    content: comment.content,
                    createdAt: comment.created_at
                }
            });
        }

        if (req.method === 'PUT') {
            // Actualizar un comentario
            const decoded = verifyToken(req);
            if (!decoded) {
                return res.status(401).json({ error: 'Token de autorización requerido' });
            }

            const { id } = req.query;
            const { content } = req.body;

            if (!content || content.trim().length === 0) {
                return res.status(400).json({ error: 'Contenido requerido' });
            }

            // Verificar que el comentario pertenece al usuario
            const commentCheck = await client.query(
                'SELECT user_id FROM story_comments WHERE id = $1',
                [id]
            );

            if (commentCheck.rows.length === 0) {
                return res.status(404).json({ error: 'Comentario no encontrado' });
            }

            if (commentCheck.rows[0].user_id !== decoded.userId) {
                return res.status(403).json({ error: 'No tienes permiso para editar este comentario' });
            }

            const result = await client.query(`
                UPDATE story_comments 
                SET content = $1
                WHERE id = $2
                RETURNING *
            `, [content.trim(), id]);

            const comment = result.rows[0];

            // Obtener información del usuario
            const userResult = await client.query(
                'SELECT name, avatar FROM users WHERE id = $1',
                [decoded.userId]
            );

            const user = userResult.rows[0] || {};

            return res.json({
                comment: {
                    id: comment.id,
                    storyId: comment.story_id,
                    userId: comment.user_id,
                    username: comment.username,
                    name: user.name,
                    avatar: user.avatar,
                    content: comment.content,
                    createdAt: comment.created_at
                }
            });
        }

        if (req.method === 'DELETE') {
            // Eliminar un comentario
            const decoded = verifyToken(req);
            if (!decoded) {
                return res.status(401).json({ error: 'Token de autorización requerido' });
            }

            const { id } = req.query;

            // Verificar que el comentario pertenece al usuario
            const commentCheck = await client.query(
                'SELECT user_id FROM story_comments WHERE id = $1',
                [id]
            );

            if (commentCheck.rows.length === 0) {
                return res.status(404).json({ error: 'Comentario no encontrado' });
            }

            if (commentCheck.rows[0].user_id !== decoded.userId) {
                return res.status(403).json({ error: 'No tienes permiso para eliminar este comentario' });
            }

            await client.query('DELETE FROM story_comments WHERE id = $1', [id]);

            return res.json({ success: true, message: 'Comentario eliminado correctamente' });
        }

        return res.status(405).json({ error: 'Método no permitido' });

    } catch (error) {
        console.error('Error en comments API:', error);
        return res.status(500).json({ error: error.message });
    } finally {
        await client.end();
    }
}