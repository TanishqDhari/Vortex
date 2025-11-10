// app/api/user/check-email/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/app/api/lib/db";
import { RowDataPacket } from "mysql2";

type UserRow = RowDataPacket & {
  user_id: number;
  fname: string;
  lname: string;
  email: string;
  user_password: string;
  dob?: string;
  login_type?: string;
};

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    const [rows] = await db.query<UserRow[]>(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.user_password);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User authenticated successfully.",
      user: {
        id: user.user_id,
        name: `${user.fname} ${user.lname}`,
        email: user.email,
        dob: user.dob,
        loginType: user.login_type,
      },
    });
  } catch (err) {
    console.error("Error in /api/user/check-email:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
