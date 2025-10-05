import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/app/api/lib/db"; // your MySQL / SQLite / whatever client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const user = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    res.status(200).json({ exists: Array.isArray(user) && user.length > 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ exists: false, error: "Server error" });
  }
}
