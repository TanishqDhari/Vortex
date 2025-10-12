import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM episode");
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { episode_id, season_id, episode_no, file_link, duration } = await req.json();
    const [result] = await db.execute(
      "INSERT INTO episode (episode_id, season_id, episode_no, file_link, duration) VALUES (?, ?, ?, ?, ?)",
      [episode_id, season_id, episode_no, file_link, duration]
    );
    return Response.json({ message: "Episode created", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
