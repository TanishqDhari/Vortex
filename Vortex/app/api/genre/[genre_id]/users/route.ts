import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

type Params = { params: { genre_id: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const [rows] = await db.query(
      `
      SELECT u.*
      FROM prefers p
      JOIN users u ON p.user_id = u.user_id
      WHERE p.genre_id = ?
      `,
      [params.genre_id]
    );
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
