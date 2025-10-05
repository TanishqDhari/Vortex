import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

type Params = { params: { studio_id: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const [rows] = await db.query("SELECT * FROM studio WHERE studio_id = ?", [params.studio_id]);
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { studio_id, studio_name, studio_desc } = await req.json();
    const [result] = await db.execute("UPDATE studio SET studio_name=?, studio_desc=? WHERE studio_id=?", [
      studio_name,
      studio_desc,
      studio_id,
    ]);
    return Response.json({ message: "Studio updated", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { studio_id } = await req.json();
    const [result] = await db.execute("DELETE FROM studio WHERE studio_id=?", [studio_id]);
    return Response.json({ message: "Studio deleted", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

