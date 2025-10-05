import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

type Params = { params: { episode_id: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const [rows] = await db.query("SELECT * FROM episode WHERE episode_id = ?", [params.episode_id]);
    return NextResponse.json(rows);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { episode_id, season_id, episode_no, file_link, duration } = await req.json();
    const [result] = await db.execute(
      "UPDATE episode SET season_id=?, episode_no=?, file_link=?, duration=? WHERE episode_id=?",
      [season_id, episode_no, file_link, duration, episode_id]
    );
    return Response.json({ message: "Episode updated", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { episode_id } = await req.json();
    const [result] = await db.execute("DELETE FROM episode WHERE episode_id=?", [episode_id]);
    return Response.json({ message: "Episode deleted", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

