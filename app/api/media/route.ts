import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const [rows] = await db.query<RowDataPacket[]>(`
  SELECT
    m.*,
    (
      SELECT JSON_ARRAYAGG(g.title)
      FROM media_genre mg
      JOIN genre g ON g.genre_id = mg.genre_id
      WHERE mg.media_id = m.media_id  
    ) AS genres,
    (
      SELECT JSON_ARRAYAGG(s.studio_name)
      FROM distributed_by d
      JOIN studio s ON s.studio_id = d.studio_id
      WHERE d.media_id = m.media_id  
    ) AS studio,
    (
      SELECT JSON_ARRAYAGG(t.trailer_url)  -- or t.title, whatever column you want
      FROM trailer t
      WHERE t.media_id = m.media_id  
    ) AS trailer,
    (
      SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
          'name', CONCAT(c.fname, ' ', c.lname),
          'role', ct.crew_role,
          'image', c.image
        )
      )
      FROM contribution ct
      JOIN crew c ON c.crew_id = ct.crew_id
      WHERE ct.media_id = m.media_id
    ) AS cast,
    (
      SELECT JSON_OBJECT(
        'name', CONCAT(c.fname, ' ', c.lname),
        'role', ct.crew_role,
        'image', c.image
      )
      FROM contribution ct
      JOIN crew c ON c.crew_id = ct.crew_id
      WHERE ct.media_id = m.media_id AND ct.crew_role = 'director'
    ) AS director,
    (
      SELECT AVG(r.rating)
      FROM review r
      WHERE r.media_id = m.media_id
    ) AS rating
  FROM media m;
`);

    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    console.log(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { media_id, title, release_year, duration, synopsis, image, licence_expire_date, views } = await req.json();
    const [result] = await db.execute(
      "INSERT INTO media (media_id, title, release_year, duration, synopsis, image, licence_expire_date, views) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [media_id, title, release_year, duration, synopsis, image, licence_expire_date, views]
    );
    return Response.json({ message: "Media created", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
