import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

type Params = { params: { series_id: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const [rows] = await db.query("SELECT * FROM series WHERE series_id = ?", [params.series_id]);
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { series_id, age_rating } = await req.json();
    const [result] = await db.execute("UPDATE series SET age_rating=? WHERE series_id=?", [age_rating, series_id]);
    return Response.json({ message: "Series updated", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { series_id } = await req.json();
    const [result] = await db.execute("DELETE FROM series WHERE series_id=?", [series_id]);
    return Response.json({ message: "Series deleted", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

