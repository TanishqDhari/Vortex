import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

type Params = { params: { movie_id: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const [rows] = await db.query("SELECT * FROM movie WHERE movie_id = ?", [params.movie_id]);
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { movie_id, file_link, age_rating, duration } = await req.json();
    const [result] = await db.execute(
      "UPDATE movie SET file_link=?, age_rating=?, duration=? WHERE movie_id=?",
      [file_link, age_rating, duration, movie_id]
    );
    return Response.json({ message: "Movie updated", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { movie_id } = await req.json();
    const [result] = await db.execute("DELETE FROM movie WHERE movie_id=?", [movie_id]);
    return Response.json({ message: "Movie deleted", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

