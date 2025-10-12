import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

type Params = { params: { studio_id: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const [rows] = await db.query(
      `
      SELECT m.*
      FROM distributed_by dbrel
      JOIN media m ON dbrel.media_id = m.media_id
      WHERE dbrel.studio_id = ?
      `,
      [params.studio_id]
    );
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
