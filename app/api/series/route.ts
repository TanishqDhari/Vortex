import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const [rows] = await db.query<RowDataPacket[]>(`
  SELECT
    m.*,
    s.*,
    (
      SELECT JSON_ARRAYAGG(g.title)
      FROM media_genre mg
      JOIN genre g ON g.genre_id = mg.genre_id
      WHERE mg.media_id = m.media_id
    ) AS genres,
    (
      SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
          'name', CONCAT(c.fname, ' ', c.lname),
          'role', ca.role,
          'image', c.image
        )
      )
      FROM cast ca
      JOIN crew c ON c.crew_id = ca.crew_id
      WHERE ca.media_id = m.media_id
    ) AS cast,
    (
      SELECT AVG(r.rating)
      FROM review r
      WHERE r.media_id = m.media_id
    ) AS avg_rating
  FROM series s
  JOIN media m ON s.series_id = m.media_id;
`);

    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { series_id, age_rating } = await req.json();
    const [result] = await db.execute("INSERT INTO series (series_id, age_rating) VALUES (?, ?)", [
      series_id,
      age_rating,
    ]);
    return Response.json({ message: "Series created", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
