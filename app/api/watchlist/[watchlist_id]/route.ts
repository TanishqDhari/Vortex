import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

type Params = { params: { watchlist_id: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const [rows] = await db.query("SELECT * FROM watchlist WHERE watchlist_id = ?", [params.watchlist_id]);
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { created_by, title, watchlist_desc, visibility, watchlist_id } = await req.json();
    const [result] = await db.query(
      "UPDATE watchlist SET created_by = ?, title = ?, watchlist_desc = ?, visibility = ? WHERE watchlist_id = ?",
      [created_by, title, watchlist_desc, visibility, watchlist_id]
    );
    return Response.json({ message: "Watchlist updated", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { watchlist_id } = await req.json();
    const [result] = await db.execute("DELETE FROM watchlist WHERE watchlist_id=?", [watchlist_id]);
    return Response.json({ message: "Watchlist deleted", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
