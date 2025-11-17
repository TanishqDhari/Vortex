import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

type Params = { params: { media_id: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { media_id } = params;

    const [rows] = await db.query(
      "SELECT watchlist_id FROM watchlist_media WHERE media_id = ?",
      [media_id]
    );

    const watchlistIds = (rows as { watchlist_id: number }[]).map(
      (row) => row.watchlist_id
    );

    return NextResponse.json(watchlistIds);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}