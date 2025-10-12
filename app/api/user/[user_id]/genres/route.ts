import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

type Params = { params: { user_id: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const [rows] = await db.query(
      `
      SELECT g.*
      FROM prefers p
      JOIN genre g ON p.genre_id = g.genre_id
      WHERE p.user_id = ?
      `,
      [params.user_id]
    );
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
