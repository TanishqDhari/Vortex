import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

type Params = { params: Promise<{ media_id: string }> };

export async function GET(_req: Request, context: Params) {
  try {
    const { media_id } = await context.params;

    const [rows] = await db.query(
      "SELECT watchlist_id FROM watchlist_media WHERE media_id = ?",
      [media_id]
    );

    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}


