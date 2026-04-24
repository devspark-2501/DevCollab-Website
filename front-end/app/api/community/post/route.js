import { connectDB } from "@/database/db";
import Post from "@/database/models/post";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // new option
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    // fetch only THIS logged in user's posts
    const posts = await Post.find({ userEmail: session.user.email }).sort({ createdAt: -1 });

    return NextResponse.json({ posts }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

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
      userEmail: session.user.email,   // straight from session
      userName: session.user.name,     // straight from session
      userContent: userContent.trim(),
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}