import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

type Params = { params: { admin_id: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const [rows] = await db.query("SELECT * FROM admin_log WHERE admin_id = ?", [params.admin_id]);
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
