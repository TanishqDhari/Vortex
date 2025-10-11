// app/api/user/[user_id]/watchlist/route.ts
import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

export async function GET(_req: Request, context: { params: Promise<{ user_id: string }> }) {
  try {
    const { user_id } = await context.params; // ✅ await params first

    const [rows] = await db.query(
      `
      SELECT m.*
      FROM watchlist w
      JOIN watchlist_media wm ON w.watchlist_id = wm.watchlist_id
      JOIN media m ON wm.media_id = m.media_id
      WHERE w.user_id = ?
      `,
      [user_id]
    );

    return NextResponse.json(rows);
  } catch (err) {
    console.error("Error fetching watchlist:", err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
