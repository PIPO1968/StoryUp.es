// Helper para asignación automática de trofeos
const TROPHIES = [
    // Ejemplo: Trofeo por publicar la primera historia
    {
        name: 'Primer historia',
        icon: '🥇',
        condition: async (client, userId) => {
            const res = await client.query('SELECT COUNT(*) FROM stories WHERE user_id = $1', [userId]);
            return parseInt(res.rows[0].count) === 1;
        },
        likes: 10 // Likes que otorga
    },
    // Ejemplo: Trofeo por publicar 10 historias
    {
        name: '10 historias',
        icon: '🏆',
        condition: async (client, userId) => {
            const res = await client.query('SELECT COUNT(*) FROM stories WHERE user_id = $1', [userId]);
            return parseInt(res.rows[0].count) === 10;
        },
        likes: 50
    },
    // Trofeo negativo por eliminar una historia
    {
        name: 'Eliminador',
        icon: '⚠️',
        condition: async (client, userId) => {
            const res = await client.query('SELECT COUNT(*) FROM stories WHERE user_id = $1 AND deleted = true', [userId]);
            return parseInt(res.rows[0].count) >= 1;
        },
        likes: -10
    }
    // ...agregar más trofeos según la tabla validada
];

async function assignTrophies(client, userId) {
    await client.query(`CREATE TABLE IF NOT EXISTS user_trophies (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    trophy_name VARCHAR(128) NOT NULL,
    trophy_icon VARCHAR(32),
    awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
    for (const trophy of TROPHIES) {
        const already = await client.query('SELECT 1 FROM user_trophies WHERE user_id = $1 AND trophy_name = $2', [userId, trophy.name]);
        if (already.rows.length === 0) {
            if (await trophy.condition(client, userId)) {
                await client.query('INSERT INTO user_trophies (user_id, trophy_name, trophy_icon) VALUES ($1, $2, $3)', [userId, trophy.name, trophy.icon]);
                // Aquí podrías sumar/restar likes si lo deseas
            }
        }
    }
}

module.exports = { assignTrophies, TROPHIES };