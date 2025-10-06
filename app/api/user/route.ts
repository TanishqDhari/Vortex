import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM users");
    return NextResponse.json(rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { email, fname, lname, login_type, user_password, dob } = await req.json();

    if (!email || !fname || !lname || !login_type || !user_password) {
      return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 });
    }

    const [existing] = await db.query("SELECT user_id FROM users WHERE email = ?", [email]);
    if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
    }

    const [result] = await db.execute(
      "INSERT INTO users (email, fname, lname, login_type, user_password, dob) VALUES (?, ?, ?, ?, ?, ?)",
      [email, fname, lname, login_type, user_password, dob || null]
    );

    return NextResponse.json({
      message: "User created successfully",
      user: { email, fname, lname, login_type, dob },
      result,
    });
  } catch (err) {
    console.error("Error creating user:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
