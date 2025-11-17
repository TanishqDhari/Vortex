import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const [rows] = await db.query<RowDataPacket[]>(`
      SELECT
        m.*,
        mv.file_link,
        mv.duration AS movie_duration,
        mv.age_rating AS movie_age_rating,

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
          SELECT AVG(r.rating)
          FROM review r
          WHERE r.media_id = m.media_id
        ) AS avg_rating

      FROM movie mv
      JOIN media m ON mv.movie_id = m.media_id;
    `);

    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
