import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

export async function POST(req: Request) {
  try {
    const { user_id, media_id } = await req.json();
    const [result] = await db.query("INSERT INTO watch_history (user_id, media_id) VALUES (?, ?)", [user_id, media_id]);
    return NextResponse.json(result);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { user_id, media_id, progress, last_seen } = await req.json();
    const [result] = await db.execute(
      "UPDATE watch_history SET progress=?, last_seen=? WHERE user_id=? AND media_id=?",
      [progress, last_seen, user_id, media_id]
    );
    return Response.json({ message: "Watch history updated", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { user_id, media_id } = await req.json();
    const [result] = await db.execute("DELETE FROM watch_history WHERE user_id=? AND media_id=?", [user_id, media_id]);
    return Response.json({ message: "Watch historydeleted", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
