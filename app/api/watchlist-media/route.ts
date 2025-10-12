import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

export async function POST(req: Request) {
  try {
    const { watchlist_id, media_id } = await req.json();
    const [result] = await db.query("INSERT INTO watchlist_media (watchlist_id, media_id) VALUES (?, ?)", [
      watchlist_id,
      media_id,
    ]);
    return NextResponse.json(result);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { watchlist_id,media_id } = await req.json();
    const [result] = await db.execute("DELETE FROM watchlist_media WHERE watchlist_id=? AND media_id=?", [watchlist_id,media_id]);
    return Response.json({ message: "Watchlist media deleted", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
