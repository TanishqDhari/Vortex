import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(
  req: Request,
  context: { params: Promise<{ series_id: string }> }
) {
  const { series_id } = await context.params;

  const [rows] = await db.query<RowDataPacket[]>(
    `
    SELECT
      series_id,
      season_no,
      title,
      image,
      cover,
      release_date,
      (
        SELECT COUNT(*)
        FROM episode e
        WHERE e.series_id = season.series_id
        AND e.season_no = season.season_no
      ) AS episode_count
    FROM season
    WHERE series_id = ?
    ORDER BY season_no;
    `,
    [series_id]
  );

  return NextResponse.json(rows);
}
