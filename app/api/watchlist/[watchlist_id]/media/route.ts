import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

type Params = { params: { watchlist_id: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const [rows] = await db.query(
      `
      SELECT m.*
      FROM watchlist_media wm
      JOIN media m ON wm.media_id = m.media_id
      WHERE wm.watchlist_id = ?
      `,
      [params.watchlist_id]
    );
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
