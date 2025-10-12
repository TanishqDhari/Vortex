import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

type Params = { params: { media_id: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const [rows] = await db.query(
      `
      SELECT c.*
      FROM collection_media cm
      JOIN media_collection c ON cm.collection_id = c.collection_id
      WHERE cm.media_id = ?
      `,
      [params.media_id]
    );
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
