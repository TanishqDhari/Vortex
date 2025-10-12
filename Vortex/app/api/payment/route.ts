import { NextResponse, NextRequest } from "next/server";
import db from "@/app/api/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    
    const query = `
      SELECT DISTINCT p.*
      FROM payment p
      JOIN subscription s ON p.payment_id = s.payment_id
      WHERE s.user_id = ?
    `;
    const [rows] = await db.query(query, [userId]);
    return NextResponse.json(rows);

  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { user_id, payment_amount, payment_mode } = await req.json();
    if (!user_id || !payment_amount || !payment_mode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const [result] = await db.execute(
      "INSERT INTO payment (payment_amount, payment_mode) VALUES (?, ?)",
      [payment_amount, payment_mode]
    );
    const payment_id = (result as any).insertId;
    return NextResponse.json({ message: "Payment created", payment_id });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

