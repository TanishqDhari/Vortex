import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM admins");
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { admin_status, email, f_name, l_name, login_type, admin_password } = await req.json();
    const [result] = await db.execute(
      "INSERT INTO admins (admin_status, email, f_name, l_name, login_type, admin_password) VALUES (?, ?, ?, ?, ?, ?)",
      [admin_status, email, f_name, l_name, login_type, admin_password]
    );
    return Response.json({ message: "Admin created", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
