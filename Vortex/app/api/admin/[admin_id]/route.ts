import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

type Params = { params: { admin_id: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const [rows] = await db.query("SELECT * FROM admins WHERE admin_id = ?", [params.admin_id]);
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { admin_id, admin_status, email, f_name, l_name, login_type, admin_password } = await req.json();
    const [result] = await db.execute(
      "UPDATE admins SET admin_status=?, email=?, f_name=?, l_name=?, login_type=?, admin_password=? WHERE admin_id=?",
      [admin_status, email, f_name, l_name, login_type, admin_password, admin_id]
    );
    return Response.json({ message: "Admin updated", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { admin_id } = await req.json();
    const [result] = await db.execute("DELETE FROM admins WHERE admin_id=?", [admin_id]);
    return Response.json({ message: "Admin deleted", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

