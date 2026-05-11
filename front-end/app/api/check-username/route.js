import { NextResponse } from "next/server";
import { connectDB } from "@/database/db";
import User from "@/database/models/user";

export async function POST(req) {
  try {
    await connectDB();
    const { username } = await req.json();

    if (!username || username.length < 3) {
      return NextResponse.json({ available: false, message: "Too short" });
    }

    // only allow letters, numbers, underscores, dots, hyphens
    if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
      return NextResponse.json({
        available: false,
        message: "Only letters, numbers, _ . - allowed",
      });
    }

    const exists = await User.findOne({ username });
    return NextResponse.json({
      available: !exists,
      message: exists ? "Username already taken" : "Username available",
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}