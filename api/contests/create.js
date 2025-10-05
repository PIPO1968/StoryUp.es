import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    const { title, description, startDate, endDate, winner, creatorUsername } = req.body;
    await sql`
    INSERT INTO contests (title, description, creator_username, start_date, end_date, winner)
    VALUES (${title}, ${description}, ${creatorUsername}, ${startDate}, ${endDate}, ${winner || null})
  `;
    res.json({ success: true });
}
