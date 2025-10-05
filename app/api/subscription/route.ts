import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

export async function POST(req: Request) {
  try {
    const { user_id, plan_id, payment_id, start_date, end_date } = await req.json();
    const [result] = await db.query(
      "INSERT INTO subscription (user_id, plan_id, payment_id, start_date, end_date) VALUES (?, ?, ?, ?, ?)",
      [user_id, plan_id, payment_id, start_date, end_date]
    );
    return NextResponse.json(result);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { user_id, plan_id, payment_id, start_date, end_date } = await req.json();
    const [result] = await db.execute(
      "UPDATE subscription SET plan_id=?, payment_id=?, start_date=?, end_date=? WHERE user_id=? AND plan_id=?",
      [plan_id, payment_id, start_date, end_date, user_id, plan_id]
    );
    return Response.json({ message: "Subscription updated", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { user_id } = await req.json();
    const [result] = await db.execute("DELETE FROM subscription WHERE user_id=?", [user_id]);
    return Response.json({ message: "Subscription deleted", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
