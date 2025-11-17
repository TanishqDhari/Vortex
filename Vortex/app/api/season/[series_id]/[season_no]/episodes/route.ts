import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

export async function GET(
  req: Request,
  context: { params: Promise<{ series_id: string; season_no: string }> }
) {
  const { series_id, season_no } = await context.params;
  const [rows] = await db.query(`
    SELECT
      e.episode_no,
      e.episode_id,
      m.title,
      m.image,
      m.synopsis,
      m.duration
    FROM episode e
    JOIN media m ON m.media_id = e.episode_id
    WHERE e.series_id = ?
    AND e.season_no = ?
    ORDER BY e.episode_id;
  `, [series_id, season_no]);

  return NextResponse.json(rows);
}
