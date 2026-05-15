import { NextResponse } from "next/server";
import { connectDB } from "@/database/db";
import User from "@/database/models/user";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const email = decodeURIComponent(params.email);

    const user = await User.findOne({ email }).lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // get full user docs for everyone in followers array
    const followers = await User.find(
      { email: { $in: user.followers || [] } },
      { username: 1, email: 1, _id: 0 }
    ).lean();

    return NextResponse.json({ followers });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}