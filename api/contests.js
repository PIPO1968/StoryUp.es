
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    const { method, url } = req;
    // Crear concurso
    if (method === 'POST' && url.endsWith('/contests')) {
        const { title, description, startDate, endDate, winner, creatorUsername } = req.body;
        await sql`
            INSERT INTO contests (title, description, creator_username, start_date, end_date, winner)
            VALUES (${title}, ${description}, ${creatorUsername}, ${startDate}, ${endDate}, ${winner || null})
        `;
        return res.json({ success: true });
    }
    // Actualizar ganador
    if (method === 'POST' && url.match(/\/contests\/(\d+)\/winner$/)) {
        const id = url.split('/')[3];
        const { winner } = req.body;
        await sql`UPDATE contests SET winner = ${winner} WHERE id = ${id}`;
        return res.json({ success: true });
    }
    // Listar concursos activos y actualizar estado
    if (method === 'GET' && url.endsWith('/contests/active')) {
        const now = new Date().toISOString().slice(0, 10);
        await sql`UPDATE contests SET status = 'finished' WHERE end_date < ${now} AND status = 'active'`;
        const { rows } = await sql`
            SELECT * FROM contests
            WHERE status = 'active' AND start_date <= ${now} AND end_date >= ${now}
            ORDER BY id DESC
        `;
        return res.json({ contests: rows });
    }
    // Listar concursos terminados
    if (method === 'GET' && url.endsWith('/contests/finished')) {
        const { rows } = await sql`
            SELECT * FROM contests
            WHERE status = 'finished'
            ORDER BY end_date DESC
        `;
        return res.json({ contests: rows });
    }
    // Si no coincide ninguna ruta
    res.status(404).json({ error: 'Not found' });
}
