// app/api/user/check-email/route.ts
import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";
import { RowDataPacket } from "mysql2";

type UserRow = RowDataPacket & {
  user_id: number;
  fname: string;
  lname: string;
  email: string;
  dob?: string;
  login_type?: string;
};

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Query user
    const [rows] = await db.query<UserRow[]>("SELECT * FROM users WHERE email = ?", [email]);

    const exists = rows.length > 0;

    return NextResponse.json({
      exists,
      userId: exists ? rows[0].user_id : null,
    });
  } catch (err) {
    console.error("Error checking email:", err);
    return NextResponse.json({ exists: false, error: "Server error" }, { status: 500 });
  }
}
