import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const media_id = searchParams.get("media_id");
    let user_id = searchParams.get("user_id");
    if (!media_id) {
      return NextResponse.json(
        { error: "media_id is required" },
        { status: 400 }
      );
    }
    if (user_id === "null" || user_id === "undefined") {
      user_id = null;
    }
    const result: any = await db.query(
      `SELECT 
         r.media_id,
         r.user_id,
         r.rating,
         r.review_desc,
         r.review_type,
         CONCAT(u.fname, ' ', u.lname) AS username
       FROM review r
       JOIN users u ON r.user_id = u.user_id
       WHERE r.media_id = ?`,
      [media_id]
    );
    const rows: any[] = result[0];
    if (user_id !== null) {
      rows.sort((a: any, b: any) => {
        if (a.user_id == user_id) return -1;
        if (b.user_id == user_id) return 1;
        return 0;
      });
    }
    return NextResponse.json(rows);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { media_id, user_id, rating, review_desc, review_type } = await req.json();
    if (!media_id || !user_id) {
      return NextResponse.json({ error: "media_id and user_id are required" }, { status: 400 });
    }
    const [result] = await db.execute(
      `INSERT INTO review (media_id, user_id, rating, review_desc, review_type)
       VALUES (?, ?, ?, ?, ?)`,
      [
        media_id,
        user_id,
        rating ?? null,
        review_desc ?? null,
        review_type ?? null
      ]
    );
    return NextResponse.json({ message: "Review added", result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


export async function PUT(req: Request) {
  try {
    const { user_id, media_id, rating } = await req.json();
    if (!user_id || !media_id) {
      return NextResponse.json({ error: "user_id and media_id required" }, { status: 400 });
    }
    if (rating === undefined || rating === null) {
      return NextResponse.json({ error: "rating is required" }, { status: 400 });
    }
    const [result] = await db.execute(
      `UPDATE review SET rating = ? WHERE user_id = ? AND media_id = ?`,
      [rating, user_id, media_id]
    );
    return NextResponse.json({ message: "Rating updated", result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { user_id, media_id, review_desc, review_type } = await req.json();
    if (!user_id || !media_id) {
      return NextResponse.json({ error: "user_id and media_id required" }, { status: 400 });
    }
    const [existing]: any = await db.query(
      "SELECT * FROM review WHERE user_id = ? AND media_id = ?",
      [user_id, media_id]
    );
    if (existing.length === 0) {
      const [insertResult] = await db.execute(
        `INSERT INTO review (media_id, user_id, review_desc, review_type)
         VALUES (?, ?, ?, ?)`,
        [media_id, user_id, review_desc ?? null, review_type ?? null]
      );
      return NextResponse.json({ message: "Review created", result: insertResult });
    }
    const fields: string[] = [];
    const values: any[] = [];
    if (typeof review_desc !== "undefined") {
      fields.push("review_desc = ?");
      values.push(review_desc ?? null);
    }
    if (typeof review_type !== "undefined") {
      fields.push("review_type = ?");
      values.push(review_type ?? null);
    }
    if (fields.length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }
    values.push(user_id, media_id);
    const sql = `UPDATE review SET ${fields.join(", ")} WHERE user_id = ? AND media_id = ?`;
    const [result] = await db.execute(sql, values);
    return NextResponse.json({ message: "Review updated", result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { user_id, media_id } = await req.json();
    if (!user_id || !media_id) {
      return NextResponse.json({ error: "user_id and media_id required" }, { status: 400 });
    }
    const [result] = await db.execute(
      "UPDATE review SET review_desc = NULL WHERE user_id = ? AND media_id = ?",
      [user_id, media_id]
    );
    return NextResponse.json({ message: "Description removed", result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
