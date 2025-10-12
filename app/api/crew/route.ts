import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM crew");
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { fname, lname, nationality, crew_desc, image_link, dob } = await req.json();
    const [result] = await db.execute(
      "INSERT INTO crew (fname, lname, nationality, crew_desc, image_link, dob) VALUES (?, ?, ?, ?, ?, ?)",
      [fname, lname, nationality, crew_desc, image_link, dob]
    );
    return Response.json({ message: "Crew member created", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
