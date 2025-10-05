import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    const { id } = req.query;
    const { winner } = req.body;
    await sql`UPDATE contests SET winner = ${winner} WHERE id = ${id}`;
    res.json({ success: true });
}
