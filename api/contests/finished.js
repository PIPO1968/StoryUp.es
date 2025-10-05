import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    const { rows } = await sql`
    SELECT * FROM contests
    WHERE status = 'finished'
    ORDER BY end_date DESC
  `;
    res.json({ contests: rows });
}
