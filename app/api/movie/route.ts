import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM movie");
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { movie_id, file_link, age_rating, duration } = await req.json();
    const [result] = await db.execute(
      "INSERT INTO movie (movie_id, file_link, age_rating, duration) VALUES (?, ?, ?, ?)",
      [movie_id, file_link, age_rating, duration]
    );
    return Response.json({ message: "Movie created", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
