import { NextResponse } from "next/server"
import db from "@/app/api/lib/db"
import { RowDataPacket } from "mysql2"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT user_id FROM users WHERE email = ?",
      [email]
    )
    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "User not found" })
    }
    return NextResponse.json({ success: true, userId: rows[0].user_id })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, message: "Server error" })
  }
}