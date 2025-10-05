import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query(`
    SELECT 
      g.*,
      (
        SELECT COUNT(*)
        FROM media_genre mg
        WHERE mg.genre_id = g.genre_id
      ) AS media_count
    FROM genre g;
  `);

    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title } = await req.json();
    const [result] = await db.execute("INSERT INTO genre (title) VALUES (?)", [title]);
    return Response.json({ message: "Genre created", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
