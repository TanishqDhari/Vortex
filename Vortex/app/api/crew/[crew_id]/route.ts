import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

type Params = { params: { crew_id: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const [rows] = await db.query("SELECT * FROM crew WHERE crew_id = ?", [params.crew_id]);
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { crew_id, fname, lname, nationality, crew_desc, image_link, dob } = await req.json();
    const [result] = await db.execute(
      "UPDATE crew SET fname=?, lname=?, nationality=?, crew_desc=?, image_link=?, dob=? WHERE crew_id=?",
      [fname, lname, nationality, crew_desc, image_link, dob, crew_id]
    );
    return Response.json({ message: "Crew member updated", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { crew_id } = await req.json();
    const [result] = await db.execute("DELETE FROM crew WHERE crew_id=?", [crew_id]);
    return Response.json({ message: "Crew member deleted", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
