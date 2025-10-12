import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

export async function POST(req: Request) {
  try {
    const { admin_id, media_id, user_id, operation_type, operation_date } = await req.json();
    const [result] = await db.query(
      "INSERT INTO admin_log (admin_id, media_id, user_id, operation_type, operation_date) VALUES (?, ?, ?, ?, ?)",
      [admin_id, media_id ?? null, user_id ?? null, operation_type, operation_date]
    );
    return NextResponse.json(result);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
