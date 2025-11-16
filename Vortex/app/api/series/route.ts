import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const [rows] = await db.query<RowDataPacket[]>(`
      SELECT
        s.series_id,
        s.title,
        s.age_rating,
        s.release_date,
        s.synopsis,
        s.image,
        s.cover,
        s.licence_expire_date,

        -- Genres
        (
          SELECT JSON_ARRAYAGG(g.title)
          FROM series_genre sg
          JOIN genre g ON g.genre_id = sg.genre_id
          WHERE sg.series_id = s.series_id
        ) AS genres,

        -- Cast / Crew
        (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'name', CONCAT(c.fname, ' ', c.lname),
              'role', sc.crew_role,
              'image', c.image
            )
          )
          FROM series_contribution sc
          JOIN crew c ON c.crew_id = sc.crew_id
          WHERE sc.series_id = s.series_id
        ) AS cast,

        -- Studios
        (
          SELECT JSON_ARRAYAGG(st.studio_name)
          FROM series_distributed_by sd
          JOIN studio st ON st.studio_id = sd.studio_id
          WHERE sd.series_id = s.series_id
        ) AS studios,

        -- Seasons Count
        (
          SELECT COUNT(*)
          FROM season se
          WHERE se.series_id = s.series_id
        ) AS seasons,

        -- Episode Count
        (
          SELECT COUNT(*)
          FROM episode e
          WHERE e.series_id = s.series_id
        ) AS episodes

      FROM series s
      ORDER BY s.series_id;
    `);

    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { series_id, age_rating, title, release_date, synopsis, image, cover, licence_expire_date } =
      await req.json();

    const [result] = await db.execute(
      `INSERT INTO series 
      (series_id, age_rating, title, release_date, synopsis, image, cover, licence_expire_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [series_id, age_rating, title, release_date, synopsis, image, cover, licence_expire_date]
    );

    return NextResponse.json({ message: "Series created", result });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
