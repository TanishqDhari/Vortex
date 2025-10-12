import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM feedback");
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { given_by, category, feedback_desc, post_date } = await req.json();
    const [result] = await db.execute(
      "INSERT INTO feedback (given_by, category, feedback_desc, post_date) VALUES (?, ?, ?, ?)",
      [given_by, category, feedback_desc, post_date]
    );
    return Response.json({ message: "Feedback created", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
