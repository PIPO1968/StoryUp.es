const { Client } = require('pg');

function getClient() {
    return new Client({
        connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/storyup'
    });
}

// Utilidad para crear la tabla de contactos si no existe
async function ensureTable(client) {
    await client.query(`CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        user_nick VARCHAR(255) NOT NULL,
        contact_nick VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_nick, contact_nick)
    )`);
}

module.exports = async function handler(req, res) {
    const client = getClient();
    await client.connect();
    await ensureTable(client);

    try {
        if (req.method === 'POST' && req.body.user_nick && req.body.contact_nick) {
            // Agregar contacto por nick
            const { user_nick, contact_nick } = req.body;
            if (!user_nick || !contact_nick) {
                res.status(400).json({ error: 'Faltan campos requeridos' });
                return;
            }

            // Verificar que el contacto existe (simulado por ahora)
            if (contact_nick === user_nick) {
                res.status(400).json({ error: 'No puedes agregarte a ti mismo' });
                return;
            }

            try {
                await client.query(
                    'INSERT INTO contacts (user_nick, contact_nick) VALUES ($1, $2)',
                    [user_nick, contact_nick]
                );
                res.status(200).json({ success: true, message: 'Contacto agregado' });
            } catch (error) {
                if (error.code === '23505') { // Duplicate key error
                    res.status(400).json({ error: 'El contacto ya existe' });
                } else {
                    throw error;
                }
            }
        } else if (req.method === 'POST' && req.body.user_nick) {
            // Obtener lista de contactos
            const { user_nick } = req.body;
            const result = await client.query(
                `SELECT DISTINCT contact_nick as nick, contact_nick as name, 
                 '' as avatar, 0 as unread_count, false as is_online,
                 c.created_at
                 FROM contacts c 
                 WHERE user_nick = $1 
                 ORDER BY c.created_at DESC`,
                [user_nick]
            );

            const contacts = result.rows.map(row => ({
                id: row.nick,
                nick: row.nick,
                name: row.name,
                avatar: row.avatar,
                unreadCount: row.unread_count,
                isOnline: row.is_online,
                lastMessage: '',
                lastMessageTime: null
            }));

            res.status(200).json({ contacts });
        } else if (req.method === 'DELETE') {
            // Eliminar contacto
            const { user_nick, contact_nick } = req.body;
            if (!user_nick || !contact_nick) {
                res.status(400).json({ error: 'Faltan campos requeridos' });
                return;
            }

            await client.query(
                'DELETE FROM contacts WHERE user_nick = $1 AND contact_nick = $2',
                [user_nick, contact_nick]
            );
            res.status(200).json({ success: true, message: 'Contacto eliminado' });
        } else {
            res.status(405).json({ error: 'Método no permitido' });
        }
    } catch (error) {
        console.error('Error en contacts API:', error);
        res.status(500).json({ error: error.message });
    } finally {
        await client.end();
    }
}