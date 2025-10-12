import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

type Params = { params: { feedback_id: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const [rows] = await db.query("SELECT * FROM feedback WHERE feedback_id = ?", [params.feedback_id]);
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { feedback_id } = await req.json();
    const [result] = await db.execute("DELETE FROM feedback WHERE feedback_id=?", [feedback_id]);
    return Response.json({ message: "Feedback deleted", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

