import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM studio");
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { studio_name, studio_desc } = await req.json();
    const [result] = await db.execute("INSERT INTO studio (studio_name, studio_desc) VALUES (?, ?)", [
      studio_name,
      studio_desc,
    ]);
    return Response.json({ message: "Studio created", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
