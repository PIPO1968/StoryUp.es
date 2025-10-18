const { updateLastActiveFromRequest } = require('./updateLastActive');
const { Client } = require('pg');

function getClient() {
    const neonUrl = 'postgresql://neondb_owner:npg_HnBMTqDUc1W8@ep-still-bread-agolimhp-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || neonUrl;
    return new Client({ connectionString });
}

module.exports = async function handler(req, res) {
    await updateLastActiveFromRequest(req);
    // Endpoint para obtener los trofeos del usuario
    if (req.method === 'GET' && req.url.includes('/trophies')) {
        const client = getClient();
        await client.connect();
        const { id } = req.query;
        if (!id) {
            await client.end();
            return res.status(400).json({ error: 'Falta el id de usuario' });
        }
        // Obtener trofeos del usuario
        await client.query(`CREATE TABLE IF NOT EXISTS user_trophies (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            trophy_name VARCHAR(128) NOT NULL,
            trophy_icon VARCHAR(32),
            awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
        const trophiesRes = await client.query('SELECT trophy_name, trophy_icon, awarded_at FROM user_trophies WHERE user_id = $1', [id]);
        await client.end();
        return res.status(200).json({ trophies: trophiesRes.rows });
    }
    // Endpoint para obtener el total de likes del usuario
    if (req.method === 'GET' && req.url.includes('/likes')) {
        const client = getClient();
        await client.connect();
        const { id } = req.query;
        if (!id) {
            await client.end();
            return res.status(400).json({ error: 'Falta el id de usuario' });
        }
        // Likes en historias
        const storiesLikesRes = await client.query('SELECT SUM(likes) as story_likes FROM historias WHERE author_id = $1', [id]);
        const storyLikes = storiesLikesRes.rows[0]?.story_likes || 0;
        // Likes manuales (panel)
        const userRes = await client.query('SELECT likes FROM usuarios WHERE id = $1', [id]);
        const panelLikes = userRes.rows[0]?.likes || 0;
        // Likes en concursos
        const contestRes = await client.query('SELECT SUM(likes) as contest_likes FROM concursos WHERE ganador_id = $1', [id]);
        const contestLikes = contestRes.rows[0]?.contest_likes || 0;
        await client.end();
        return res.status(200).json({
            totalLikes: storyLikes + panelLikes + contestLikes,
            storyLikes,
            panelLikes,
            contestLikes
        });
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const client = getClient();
    await client.connect();

    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Falta el id de usuario' });

    if (req.method === 'PUT') {
        const { theme, language, centro_escolar } = req.body;
        let updates = [];
        let values = [];
        let idx = 1;
        if (theme) {
            updates.push(`theme = $${idx++}`);
            values.push(theme);
        }
        if (language) {
            updates.push(`language = $${idx++}`);
            values.push(language);
        }
        if (centro_escolar) {
            updates.push(`centro_escolar = $${idx++}`);
            values.push(centro_escolar);
        }
        if (updates.length === 0) {
            await client.end();
            return res.status(400).json({ error: 'No hay datos para actualizar' });
        }
        values.push(id);
        await client.query(`ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS theme VARCHAR(20);`);
        await client.query(`ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS language VARCHAR(10);`);
        await client.query(`ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS centro_escolar VARCHAR(128);`);
        await client.query(`UPDATE usuarios SET ${updates.join(', ')} WHERE id = $${idx}`, values);
        await client.end();
        return res.status(200).json({ success: true });
    }

    if (req.method === 'GET') {
        await client.query(`ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS theme VARCHAR(20);`);
        await client.query(`ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS language VARCHAR(10);`);
        await client.query(`ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS centro_escolar VARCHAR(128);`);
        const result = await client.query('SELECT theme, language, centro_escolar FROM usuarios WHERE id = $1', [id]);
        await client.end();
        if (result.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        return res.status(200).json(result.rows[0]);
    }

    await client.end();
    return res.status(405).json({ error: 'Método no permitido' });
};
