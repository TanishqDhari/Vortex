import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM media");
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { media_id, views, title, media_desc, licence_expire_date } = await req.json();
    const [result] = await db.execute(
      "INSERT INTO media (media_id, views, title, media_desc, licence_expire_date) VALUES (?, ?, ?, ?, ?)",
      [media_id, views, title, media_desc, licence_expire_date]
    );
    return Response.json({ message: "Media created", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
