import { connectDB } from "@/database/db";
import Post from "@/database/models/post";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";

// ── PUBLIC — anyone can read all posts (Hero_Section_Two feed)
export async function GET() {
  try {
    await connectDB();
    const posts = await Post.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ posts }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

// ── PROTECTED — only logged-in users can create a post
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { userContent } = await req.json();

    if (!userContent?.trim()) {
      return NextResponse.json({ error: "Content cannot be empty" }, { status: 400 });
    }

    const post = await Post.create({
      userEmail: session.user.email,
      userName:  session.user.name,
      userContent: userContent.trim(),
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    console.log("POST ERROR:", err.message);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}