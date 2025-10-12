  import { NextResponse } from "next/server";
  import db from "@/app/api/lib/db";

  import { RowDataPacket } from "mysql2";

  export async function GET(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const user_id = searchParams.get("user_id");
      if (!user_id) {
        return NextResponse.json({ error: "user_id is required" }, { status: 400 });
      }
      const [rows] = await db.query<RowDataPacket[]>(
        `SELECT s.*, p.plan_name, p.price, p.billing_cycle
        FROM subscription s
        JOIN subscription_plan p ON s.plan_id = p.plan_id
        WHERE s.user_id = ?`,
        [user_id]
      );
      if (rows.length === 0) {
        return NextResponse.json(null, { status: 200 });
      }
      return NextResponse.json(rows[0]);
    } catch (err) {
      const error = err as Error;
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }


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
