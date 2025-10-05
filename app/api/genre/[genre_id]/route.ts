import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

type Params = { params: { genre_id: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const [rows] = await db.query("SELECT * FROM genre WHERE genre_id = ?", [params.genre_id]);
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { genre_id, title } = await req.json();
    const [result] = await db.execute("UPDATE genre SET title=? WHERE genre_id=?", [title, genre_id]);
    return Response.json({ message: "Genre updated", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { genre_id } = await req.json();
    const [result] = await db.execute("DELETE FROM genre WHERE genre_id=?", [genre_id]);
    return Response.json({ message: "Genre deleted", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

