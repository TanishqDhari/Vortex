import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

type Params = { params: { crew_id: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const [rows] = await db.query(
      `
      SELECT m.*, con.crew_role
      FROM contribution con
      JOIN media m ON con.media_id = m.media_id
      WHERE con.crew_id = ?
      `,
      [params.crew_id]
    );
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
