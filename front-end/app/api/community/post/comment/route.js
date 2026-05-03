import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Post from "@/models/Post";

export async function POST(req) {
  try {
    await dbConnect();

    const { postId, userEmail, userName, text } = await req.json();

    if (!postId || !userEmail || !userName || !text?.trim()) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    post.comments.push({ userEmail, userName, text: text.trim() });
    await post.save();

    // return the last comment (the one just added)
    const newComment = post.comments[post.comments.length - 1];
    return NextResponse.json({ comment: newComment });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}