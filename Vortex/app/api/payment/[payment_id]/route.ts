import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

type Params = { params: { payment_id: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const [rows] = await db.query("SELECT * FROM payment WHERE payment_id = ?", [params.payment_id]);
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { payment_id, payment_amount, parment_mode } = await req.json();
    const [result] = await db.execute("UPDATE payment SET payment_amount=?, parment_mode=? WHERE payment_id=?", [
      payment_amount,
      parment_mode,
      payment_id,
    ]);
    return Response.json({ message: "Payment updated", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { payment_id } = await req.json();
    const [result] = await db.execute("DELETE FROM payment WHERE payment_id=?", [payment_id]);
    return Response.json({ message: "Payment deleted", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
