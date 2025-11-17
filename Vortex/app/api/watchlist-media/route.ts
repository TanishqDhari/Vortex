import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const media_id = url.searchParams.get("media_id");

    if (!media_id) return NextResponse.json([]);

    const [rows]: any = await db.query(
      "SELECT watchlist_id FROM watchlist_media WHERE media_id = ?",
      [media_id]
    );

    return NextResponse.json(rows.map((r: any) => r.watchlist_id));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { watchlist_id, media_id } = await req.json();

    if (!watchlist_id || !media_id) {
      return NextResponse.json(
        { error: "watchlist_id and media_id are required" },
        { status: 400 }
      );
    }

    await db.query(
      "INSERT INTO watchlist_media (watchlist_id, media_id) VALUES (?, ?)",
      [watchlist_id, media_id]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { watchlist_id, media_id } = await req.json();

    if (!watchlist_id || !media_id) {
      return NextResponse.json(
        { error: "watchlist_id and media_id are required" },
        { status: 400 }
      );
    }

    await db.query(
      "DELETE FROM watchlist_media WHERE watchlist_id = ? AND media_id = ?",
      [watchlist_id, media_id]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}