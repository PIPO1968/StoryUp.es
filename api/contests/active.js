import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    const now = new Date().toISOString().slice(0, 10);
    await sql`UPDATE contests SET status = 'finished' WHERE end_date < ${now} AND status = 'active'`;
    const { rows } = await sql`
    SELECT * FROM contests
    WHERE status = 'active' AND start_date <= ${now} AND end_date >= ${now}
    ORDER BY id DESC
  `;
    res.json({ contests: rows });
}
