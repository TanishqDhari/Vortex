import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

type Params = { params: { media_id: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const [rows] = await db.query(
      `
      SELECT s.*
      FROM distributed_by dbrel
      JOIN studio s ON dbrel.studio_id = s.studio_id
      WHERE dbrel.media_id = ?
      `,
      [params.media_id]
    );
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
