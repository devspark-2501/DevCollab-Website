// front-end/app/api/community/stats/route.js

import { connectDB } from "@/database/db";
import User from "@/database/models/user";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const memberCount = await User.countDocuments();
    return NextResponse.json({ members: memberCount });
  } catch (error) {
    console.error("Stats fetch error:", error);
    return NextResponse.json({ members: 0 }, { status: 500 });
  }
}