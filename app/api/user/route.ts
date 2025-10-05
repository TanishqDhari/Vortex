import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM users");
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { email, fname, lname, login_type, user_password, dob } = await req.json();
    const [result] = await db.execute(
      "INSERT INTO users (email, fname, lname, login_type, user_password, dob) VALUES (?, ?, ?, ?, ?, ?)",
      [email, fname, lname, login_type, user_password, dob]
    );
    return Response.json({ message: "User created", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
