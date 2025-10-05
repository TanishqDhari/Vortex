import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM season");
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { season_id, series_id, season_no } = await req.json();
    const [result] = await db.execute("INSERT INTO season (season_id, series_id, season_no) VALUES (?, ?, ?)", [
      season_id,
      series_id,
      season_no,
    ]);
    return Response.json({ message: "Season created", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
