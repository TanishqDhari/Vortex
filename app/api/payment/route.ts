import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM payment");
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { payment_amount, parment_mode } = await req.json();
    const [result] = await db.execute("INSERT INTO payment (payment_amount, parment_mode) VALUES (?, ?)", [
      payment_amount,
      parment_mode,
    ]);
    return Response.json({ message: "Payment created", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
