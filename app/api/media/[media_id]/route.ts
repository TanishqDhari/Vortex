import { NextResponse } from "next/server";
import db from "@/app/api/lib/db";

type Params = { params: { media_id: string } };

export async function GET(_req: Request, context: { params: Params["params"] | Promise<Params["params"]> }) {
  try {
    const { params } = context;
    const { media_id } = params instanceof Promise ? await params : params;

const [rows] = await db.query(
`
SELECT 
  m.*,
  (
    SELECT JSON_ARRAYAGG(s.studio_name)
    FROM distributed_by d
    JOIN studio s ON s.studio_id = d.studio_id
    WHERE d.media_id = m.media_id
  ) AS studios,
  (
    SELECT JSON_ARRAYAGG(
      JSON_OBJECT(
        'title', g.title
      )
    )
    FROM media_genre mg
    JOIN genre g ON g.genre_id = mg.genre_id
    WHERE mg.media_id = m.media_id
  ) AS genres,
  (
    SELECT JSON_ARRAYAGG(
      JSON_OBJECT(
        'name', CONCAT(c.fname, ' ', c.lname),
        'role', ct.crew_role,
        'image', c.image
      )
    )
    FROM contribution ct
    JOIN crew c ON c.crew_id = ct.crew_id
    WHERE ct.media_id = m.media_id
  ) AS cast,
  (
    SELECT JSON_ARRAYAGG(
      JSON_OBJECT(
        'name', CONCAT(c.fname, ' ', c.lname),
        'image', c.image
      )
    )
    FROM contribution ct
    JOIN crew c ON c.crew_id = ct.crew_id
    WHERE ct.media_id = m.media_id AND ct.crew_role = 'Director'
  ) AS directors,
  (
    SELECT COALESCE(AVG(r.rating), 0)
    FROM review r
    WHERE r.media_id = m.media_id
  ) AS rating
FROM media m
WHERE m.media_id = ?
`,
[media_id]
);

    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { media_id, title, release_year, duration, synopsis, image, licence_expire_date, views } = await req.json();
    const [result] = await db.execute(
      "UPDATE media SET title=?, release_year=?, duration=?, synopsis=?, image=?, licence_expire_date=?, views=? WHERE media_id=?",
      [title, release_year, duration, synopsis, image, licence_expire_date, views, media_id]
    );
    return Response.json({ message: "Media updated", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, context: { params: Params["params"] | Promise<Params["params"]> }) {
  try {
    const { params } = context;
    const { media_id } = params instanceof Promise ? await params : params;
    
    const [result] = await db.execute("DELETE FROM media WHERE media_id=?", [media_id]);
    return Response.json({ message: "Media deleted", result });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
