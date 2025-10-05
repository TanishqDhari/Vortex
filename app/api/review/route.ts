import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

export async function POST(req: Request) {
  try {
    const { media_id, user_id, rating, review_desc, review_type } = await req.json();
    const [result] = await db.query(
      "INSERT INTO review (media_id, user_id, rating, review_desc, review_type) VALUES (?, ?, ?, ?, ?)",
      [media_id, user_id, rating, review_desc, review_type]
    );
    return NextResponse.json(result);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { user_id, media_id, rating, review_desc, review_type } = await req.json();
    const [result] = await db.execute(
      "UPDATE review SET rating=?, review_desc=?, review_type=? WHERE user_id=? AND media_id=?",
      [rating, review_desc, review_type, user_id, media_id]
    );
    return Response.json({ message: "Review updated", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { user_id } = await req.json();
    const [result] = await db.execute("DELETE FROM review WHERE user_id=?", [user_id]);
    return Response.json({ message: "Review deleted", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
