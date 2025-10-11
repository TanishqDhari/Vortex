import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

export async function POST(req: Request) {
  try {
    const { user_id, genre_id } = await req.json();
    const [result] = await db.query("INSERT INTO prefers (user_id, genre_id) VALUES (?, ?)", [user_id, genre_id]);
    return NextResponse.json(result);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { user_id, genre_id } = await req.json();
    const [result] = await db.execute("DELETE FROM prefers WHERE user_id=? AND genre_id=?", [user_id, genre_id]);
    return Response.json({ message: "Prefers deleted", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
