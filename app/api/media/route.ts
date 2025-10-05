import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM media");
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    console.log(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { media_id, title, release_year, duration, synopsis, image, licence_expire_date, views } = await req.json();
    const [result] = await db.execute(
      "INSERT INTO media (media_id, title, release_year, duration, synopsis, image, licence_expire_date, views) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [media_id, title, release_year, duration, synopsis, image, licence_expire_date, views]
    );
    return Response.json({ message: "Media created", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
