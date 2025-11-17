import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ series_id: string }> }
) {
  const { series_id } = await ctx.params;

  try {
    const [rows] = await db.query<RowDataPacket[]>(
      `
      SELECT
        s.series_id AS id,
        s.title,
        YEAR(s.release_date) AS year,
        s.release_date,
        s.synopsis,
        s.image,
        s.cover,
        s.age_rating,

        -- genres from series_genre
        (
          SELECT JSON_ARRAYAGG(g.title)
          FROM series_genre sg
          JOIN genre g ON sg.genre_id = g.genre_id
          WHERE sg.series_id = s.series_id
        ) AS genres,

        -- average rating based on episodes (media)
        (
          SELECT AVG(r.rating)
          FROM episode e
          JOIN media m ON m.media_id = e.episode_id
          LEFT JOIN review r ON r.media_id = m.media_id
          WHERE e.series_id = s.series_id
        ) AS rating

      FROM series s
      WHERE s.series_id = ?
      LIMIT 1;
      `,
      [series_id]
    );

    if (!rows.length) {
      return NextResponse.json({ message: "Series not found" }, { status: 404 });
    }

    const s = rows[0];

    return NextResponse.json({
      id: s.id,
      title: s.title,
      year: s.year,
      release_date: s.release_date,
      synopsis: s.synopsis,
      image: s.image,
      cover: s.cover,
      age_rating: s.age_rating,
      rating: Number(s.rating || 0).toFixed(1),
      genres: s.genres || [],
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
