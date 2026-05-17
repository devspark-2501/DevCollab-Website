import { NextResponse } from "next/server";
import { connectDB } from "@/database/db";
import User from "@/database/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const me = await User.findOne({ email: session.user.email }).lean();
    if (!me) return NextResponse.json({ followers: [] });

    const followers = await User.find(
      { email: { $in: me.followers || [] } },
      { username: 1, email: 1, _id: 0 }
    ).lean();

    return NextResponse.json({ followers });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}