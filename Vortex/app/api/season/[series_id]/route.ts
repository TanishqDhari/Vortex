import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

export async function GET(
  req: Request,
  context: { params: Promise<{ seasonId: string }> }
) {
  const { seasonId } = await context.params;

  try {
    // Fetch season details (season_no = seasonId)
    const [seasonRows]: any = await db.query(
      `
      SELECT
        series_id,
        season_no AS seasonNumber,
        title AS seasonTitle,
        synopsis AS seasonSynopsis,
        image AS seasonImage,
        cover AS seasonCover,
        release_date
      FROM season
      WHERE season_no = ?
      LIMIT 1
    `,
      [seasonId]
    );

    if (seasonRows.length === 0) {
      return NextResponse.json(
        { message: "Season not found" },
        { status: 404 }
      );
    }

    const season = seasonRows[0];

    // Fetch episodes for this season
    const [episodeRows]: any = await db.query(
      `
      SELECT
        e.episode_id AS id,
        m.title AS episodeTitle,
        m.synopsis AS episodeSynopsis,
        m.image AS episodeImage,
        m.duration AS episodeDuration
      FROM episode e
      JOIN media m ON m.media_id = e.episode_id
      WHERE e.series_id = ?
        AND e.season_no = ?
      ORDER BY e.episode_no ASC
    `,
      [season.series_id, season.seasonNumber]
    );

    const episodes = episodeRows.map((row: any) => ({
      ...row,
      episodeDuration: row.episodeDuration
        ? row.episodeDuration.slice(0, 8)
        : "00:00:00",
    }));

    return NextResponse.json({ season, episodes });
  } catch (error) {
    console.error("DB Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
