// app/api/user/route.ts
import { NextResponse } from "next/server"
import db from "@/app/api/lib/db"
import bcrypt from "bcryptjs"

// Fetch all users (⚠️ Avoid returning passwords in production)
export async function GET() {
  try {
    const [rows] = await db.query("SELECT user_id, fname, lname, email, dob, login_type FROM users")
    return NextResponse.json(rows)
  } catch (err) {
    console.error("Error fetching users:", err)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

// Create a new user (signup)
export async function POST(req: Request) {
  try {
    const { email, fname, lname, login_type, user_password, dob } = await req.json()

    // Validate input
    if (!email || !fname || !lname || !login_type || !user_password) {
      return NextResponse.json(
        { success: false, message: "All required fields must be provided." },
        { status: 400 }
      )
    }

    // Check if email already exists
    const [existing] = await db.query("SELECT user_id FROM users WHERE email = ?", [email])
    if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists." },
        { status: 409 }
      )
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(user_password, salt)

    // Insert new user
    const [result] = await db.execute(
      "INSERT INTO users (email, fname, lname, login_type, user_password, dob) VALUES (?, ?, ?, ?, ?, ?)",
      [email, fname, lname, login_type, hashedPassword, dob || null]
    )

    // Response
    return NextResponse.json(
      {
        success: true,
        message: "User created successfully.",
        user: { email, fname, lname, login_type, dob },
        result,
      },
      { status: 201 }
    )
  } catch (err) {
    console.error("Error creating user:", err)
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 })
  }
}
