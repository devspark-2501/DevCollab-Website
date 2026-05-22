import { NextResponse } from "next/server";
import { connectDB } from "@/database/db";
import Post from "@/database/models/post";

export async function GET() {
  try {
    await connectDB();
    // ✅ no .select() — return everything including image & imageName
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({ posts });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { userContent, image, imageName } = await req.json();

    if (!userContent?.trim() && !image) {
      return NextResponse.json({ error: "Content or image required" }, { status: 400 });
    }

    const { getServerSession } = await import("next-auth");
    const { authOptions }      = await import("@/app/api/auth/[...nextauth]/route");
    const session              = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const post = await Post.create({
      userEmail:   session.user.email,
      userName:    session.user.username || session.user.name,
      userContent: userContent?.trim() || "",
      image:       image     || null,
      imageName:   imageName || null,
      likes:       0,
      likedBy:     [],
      comments:    [],
    });

    return NextResponse.json({ post });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}