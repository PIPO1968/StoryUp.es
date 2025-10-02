const { Client } = require('pg');
import jwt from 'jsonwebtoken';

function getClient() {
    return new Client({
        connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/storyup'
    });
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
        if (req.method === 'POST') {
            // Dar like a una historia
            const decoded = verifyToken(req);
            if (!decoded) {
                return res.status(401).json({ error: 'Token de autorización requerido' });
            }

            const { storyId } = req.body;

            if (!storyId) {
                return res.status(400).json({ error: 'ID de historia requerido' });
            }

            // Verificar que la historia existe
            const storyCheck = await client.query(
                'SELECT id FROM stories WHERE id = $1',
                [storyId]
            );

            if (storyCheck.rows.length === 0) {
                return res.status(404).json({ error: 'Historia no encontrada' });
            }

            try {
                // Intentar agregar el like
                await client.query(`
                    INSERT INTO story_likes (story_id, user_id, username)
                    VALUES ($1, $2, $3)
                `, [storyId, decoded.userId, decoded.username]);

                // Obtener el nuevo conteo de likes
                const likesResult = await client.query(
                    'SELECT COUNT(*) as count FROM story_likes WHERE story_id = $1',
                    [storyId]
                );

                return res.json({
                    success: true,
                    liked: true,
                    likesCount: parseInt(likesResult.rows[0].count)
                });
            } catch (error) {
                if (error.code === '23505') { // Duplicate key error
                    return res.status(400).json({ error: 'Ya has dado like a esta historia' });
                }
                throw error;
            }
        }

        if (req.method === 'DELETE') {
            // Quitar like de una historia
            const decoded = verifyToken(req);
            if (!decoded) {
                return res.status(401).json({ error: 'Token de autorización requerido' });
            }

            const { storyId } = req.query;

            if (!storyId) {
                return res.status(400).json({ error: 'ID de historia requerido' });
            }

            await client.query(`
                DELETE FROM story_likes 
                WHERE story_id = $1 AND user_id = $2
            `, [storyId, decoded.userId]);

            // Obtener el nuevo conteo de likes
            const likesResult = await client.query(
                'SELECT COUNT(*) as count FROM story_likes WHERE story_id = $1',
                [storyId]
            );

            return res.json({
                success: true,
                liked: false,
                likesCount: parseInt(likesResult.rows[0].count)
            });
        }

        if (req.method === 'GET') {
            // Obtener información de likes de una historia
            const { storyId, userId } = req.query;

            if (!storyId) {
                return res.status(400).json({ error: 'ID de historia requerido' });
            }

            // Obtener conteo total de likes
            const likesResult = await client.query(
                'SELECT COUNT(*) as count FROM story_likes WHERE story_id = $1',
                [storyId]
            );

            let isLikedByUser = false;
            if (userId) {
                const userLikeResult = await client.query(
                    'SELECT id FROM story_likes WHERE story_id = $1 AND user_id = $2',
                    [storyId, userId]
                );
                isLikedByUser = userLikeResult.rows.length > 0;
            }

            // Obtener lista de usuarios que dieron like (últimos 10)
            const likersResult = await client.query(`
                SELECT username FROM story_likes 
                WHERE story_id = $1 
                ORDER BY created_at DESC 
                LIMIT 10
            `, [storyId]);

            return res.json({
                storyId: parseInt(storyId),
                likesCount: parseInt(likesResult.rows[0].count),
                isLikedByUser,
                recentLikers: likersResult.rows.map(row => row.username)
            });
        }

        return res.status(405).json({ error: 'Método no permitido' });

    } catch (error) {
        console.error('Error en likes API:', error);
        return res.status(500).json({ error: error.message });
    } finally {
        await client.end();
    }
}