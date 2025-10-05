import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

type Params = { params: { user_id: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const [rows] = await db.query(
      `
      SELECT m.*, r.rating, r.review_desc, r.review_type
      FROM review r
      JOIN media m ON r.media_id = m.media_id
      WHERE r.user_id = ?
      `,
      [params.user_id]
    );
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
