import { NextResponse } from "next/server";

export async function POST() {
  try {
    const res = NextResponse.json({ success: true, message: "Logged out" });

    // Clear cookies or session if applicable
    res.cookies.set("token", "", { expires: new Date(0), path: "/" });
    res.cookies.set("session", "", { expires: new Date(0), path: "/" });

    return res;
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json({ success: false, message: "Logout failed" }, { status: 500 });
  }
}
