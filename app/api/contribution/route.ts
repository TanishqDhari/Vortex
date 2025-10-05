import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

export async function POST(req: Request) {
  try {
    const { crew_id, media_id, crew_role } = await req.json();
    const [result] = await db.query("INSERT INTO contribution (crew_id, media_id, crew_role) VALUES (?, ?, ?)", [
      crew_id,
      media_id,
      crew_role,
    ]);
    return NextResponse.json(result);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
