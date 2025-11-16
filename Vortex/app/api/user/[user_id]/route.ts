import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

type Params = { params: { user_id: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE user_id = ?", [params.user_id]);
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
}

export async function PUT(req: Request) {
  try {
    const { user_id, email, fname, lname, login_type, user_password, dob } = await req.json();
    const [result] = await db.execute(
      "UPDATE users SET email=?, fname=?, lname=?, login_type=?, user_password=?, dob=? WHERE user_id=?",
      [email, fname, lname, login_type, user_password, dob, user_id]
    );
    return Response.json({ message: "User updated", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { user_id } = await req.json();
    const [result] = await db.execute("DELETE FROM users WHERE user_id=?", [user_id]);
    return Response.json({ message: "User deleted", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

