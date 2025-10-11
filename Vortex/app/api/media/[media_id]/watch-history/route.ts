import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

type Params = { params: { media_id: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const [rows] = await db.query(
      `
      SELECT w.*, wh.progress, wh.last_seen
      FROM watch_history wh
      JOIN users w ON wh.user_id = w.user_id
      WHERE wh.media_id = ?
      `,
      [params.media_id]
    );
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
