import { NextResponse } from "next/server";
import { connectDB } from "@/database/db";
import User from "@/database/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email }).lean();

    if (!user) {
      return NextResponse.json({
        followerCount:  0,
        followingCount: 0,
      });
    }

    return NextResponse.json({
      followerCount:  (user.followers || []).length,
      followingCount: (user.following || []).length,
    });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}