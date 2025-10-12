import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

type Params = { params: { plan_id: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const [rows] = await db.query("SELECT * FROM subscription_plan WHERE plan_id = ?", [params.plan_id]);
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { plan_id, price, billing_cycle, device_limit, video_quality, currency, plan_name } = await req.json();
    const [result] = await db.execute(
      "UPDATE subscription_plan SET price=?, billing_cycle=?, device_limit=?, video_quality=?, currency=?, plan_name=? WHERE plan_id=?",
      [price, billing_cycle, device_limit, video_quality, currency, plan_name, plan_id]
    );
    return Response.json({ message: "Subscription plan updated", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { plan_id } = await req.json();
    const [result] = await db.execute("DELETE FROM subscription_plan WHERE plan_id=?", [plan_id]);
    return Response.json({ message: "Subscription plan deleted", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

