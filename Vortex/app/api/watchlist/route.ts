import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM watchlist");
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { created_by, title, watchlist_desc, visibility } = await req.json();
    const [result] = await db.query(
      "INSERT INTO watchlist (created_by, title, watchlist_desc, visibility) VALUES (?, ?, ?, ?)",
      [created_by, title, watchlist_desc, visibility]
    );
    return NextResponse.json(result);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
