import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

type Params = { params: { season_id: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const [rows] = await db.query("SELECT * FROM season WHERE season_id = ?", [params.season_id]);
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { season_id, series_id, season_no } = await req.json();
    const [result] = await db.execute("UPDATE season SET series_id=?, season_no=? WHERE season_id=?", [
      series_id,
      season_no,
      season_id,
    ]);
    return Response.json({ message: "Season updated", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { season_id } = await req.json();
    const [result] = await db.execute("DELETE FROM season WHERE season_id=?", [season_id]);
    return Response.json({ message: "Season deleted", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

