import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM subscription_plan");
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { price, billing_cycle, device_limit, video_quality, currency, plan_name } = await req.json();
    const [result] = await db.execute(
      "INSERT INTO subscription_plan (price, billing_cycle, device_limit, video_quality, currency, plan_name) VALUES (?, ?, ?, ?, ?, ?)",
      [price, billing_cycle, device_limit, video_quality, currency, plan_name]
    );
    return Response.json({ message: "Subscription plan created", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
