import { NextResponse } from "next/server";
import { connectDB } from "@/database/db";
import Post from "@/database/models/post";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// ── GET — fetch all posts, returns EVERY field including image
export async function GET() {
  try {
    await connectDB();

    // ✅ NO .select() — returns all fields including image and imageName
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({ posts });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── POST — create a new post (text + optional image)
export async function POST(req) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { userContent, image, imageName } = await req.json();

    // must have at least text or image
    if (!userContent?.trim() && !image) {
      return NextResponse.json(
        { error: "Write something or add an image." },
        { status: 400 }
      );
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