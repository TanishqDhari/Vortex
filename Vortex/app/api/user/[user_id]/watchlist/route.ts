import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

type MediaItem = {
  id: number;
  title: string;
  release_date?: string;
  duration?: number;
  age_rating?: string;
  image: string;
  genres: string[];
};

type Watchlist = {
  id: number;
  name: string;
  desc: string;
  visibility: boolean;
  media: MediaItem[];
};

export async function GET(
  _req: Request,
  context: { params: Promise<{ user_id: string }> }
) {
  try {
    const { user_id } = await context.params;

    // ✅ Works for both MySQL and PostgreSQL clients (mysql2/promise or pg)
    const rows: any[] = await db
      .query?.(
        `
        SELECT 
          w.watchlist_id,
          w.title AS watchlist_title,
          w.watchlist_desc,
          w.visibility,
          m.media_id,
          m.title AS media_title,
          m.release_date,
          m.duration,
          m.age_rating,
          m.image,
          GROUP_CONCAT(g.title) AS genres
        FROM watchlist w
        LEFT JOIN watchlist_media wm ON w.watchlist_id = wm.watchlist_id
        LEFT JOIN media m ON wm.media_id = m.media_id
        LEFT JOIN media_genre mg ON m.media_id = mg.media_id
        LEFT JOIN genre g ON mg.genre_id = g.genre_id
        WHERE w.created_by = ?
        GROUP BY w.watchlist_id, m.media_id
        ORDER BY w.watchlist_id;
      `,
        [user_id]
      )
      .then((r: any) => (Array.isArray(r[0]) ? r[0] : r.rows || r))
      .catch((err: any) => {
        console.error("DB query error:", err);
        throw err;
      });

    const watchlists: Record<number, Watchlist> = {};

    rows.forEach((row) => {
      if (!watchlists[row.watchlist_id]) {
        watchlists[row.watchlist_id] = {
          id: row.watchlist_id,
          name: row.watchlist_title,
          desc: row.watchlist_desc,
          visibility: !!row.visibility,
          media: [],
        };
      }

      if (row.media_id) {
        watchlists[row.watchlist_id].media.push({
          id: row.media_id,
          title: row.media_title,
          release_date: row.release_date,
          duration: row.duration,
          age_rating: row.age_rating,
          image: row.image || "/placeholder.svg",
          genres: row.genres ? row.genres.split(",") : [],
        });
      }
    });

    return NextResponse.json(Object.values(watchlists));
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
