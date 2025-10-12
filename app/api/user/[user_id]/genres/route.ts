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

export async function PUT(req: Request, { params }: Params) {
  try {
    const { genres }: { genres: number[] } = await req.json(); // array of genre_ids
    await db.query(`DELETE FROM prefers WHERE user_id = ?`, [params.user_id]);
    if (genres.length > 0) {
      const values = genres.map((gId) => [params.user_id, gId]);
      await db.query(`INSERT INTO prefers (user_id, genre_id) VALUES ?`, [values]);
    }
    return NextResponse.json({ message: "Preferences updated successfully" });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
