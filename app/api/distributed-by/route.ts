import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

export async function POST(req: Request) {
  try {
    const { media_id, studio_id } = await req.json();
    const [result] = await db.query("INSERT INTO distributed_by (media_id, studio_id) VALUES (?, ?)", [
      media_id,
      studio_id,
    ]);
    return NextResponse.json(result);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { media_id, studio_id } = await req.json();
    const [result] = await db.execute("DELETE FROM distributed_by WHERE media_id=? AND studio_id=?", [
      media_id,
      studio_id,
    ]);
    return Response.json({ message: "Distributed by deleted", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
