import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

type Params = { params: { media_id: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const [rows] = await db.query(
      `
      SELECT u.*,  r.rating, r.review_desc, r.review_type
      FROM review r
      JOIN users u ON r.user_id = u.user_id
      WHERE r.media_id = ?
      `,
      [params.media_id]
    );
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
