import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

type Params = { params: { user_id: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const [rows] = await db.query(
      `
      SELECT m.*
      FROM watchlist w
      JOIN watchlist_media wm ON w.watchlist_id = wm.watchlist_id
      JOIN media m ON wm.media_id = m.media_id
      WHERE w.user_id = ?
      `,
      [params.user_id]
    );
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
