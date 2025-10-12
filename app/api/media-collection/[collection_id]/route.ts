import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

type Params = { params: { collection_id: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const [rows] = await db.query("SELECT * FROM media_collection WHERE collection_id = ?", [params.collection_id]);
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
