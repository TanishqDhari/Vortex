import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

type Params = { params: { media_id: string } };

export async function GET(_req: Request, { params }: Params) {
  const [rows] = await db.query("SELECT * FROM media WHERE media_id = ?", [params.media_id]);
  return NextResponse.json(rows);
}

export async function PUT(req: Request) {
  try {
    const { media_id, views, title, media_desc, licence_expire_date } = await req.json();
    const [result] = await db.execute(
      "UPDATE media SET views=?, title=?, media_desc=?, licence_expire_date=? WHERE media_id=?",
      [views, title, media_desc, licence_expire_date, media_id]
    );
    return Response.json({ message: "Media updated", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { media_id } = await req.json();
    const [result] = await db.execute("DELETE FROM media WHERE media_id=?", [media_id]);
    return Response.json({ message: "Media deleted", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

