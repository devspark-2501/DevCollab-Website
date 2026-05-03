import { NextResponse } from "next/server";
import { connectDB } from "@/database/db";
import Post from "@/database/models/post";  // adjust model path to match yours

export async function GET() {
  try {
    await connectDB();
    const posts = await Post.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ posts });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { userContent } = await req.json();

    if (!userContent?.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // pull user info from session on the server side
    const { getServerSession } = await import("next-auth");
    const { authOptions }      = await import("@/app/api/auth/[...nextauth]/route");
    const session              = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const post = await Post.create({
      userEmail:   session.user.email,
      userName:    session.user.name,
      userContent: userContent.trim(),
      likes:       0,
      likedBy:     [],
      comments:    [],
    });

    return NextResponse.json({ post });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}