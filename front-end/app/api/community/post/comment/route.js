import { NextResponse } from "next/server";
import { connectDB } from "@/database/db";   // named import
import Post from "@/database/models/post";   // adjust if needed

export async function POST(req) {
  try {
    await connectDB();                        // ✅ correct function name

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

    // return the newly saved comment (has _id + timestamps from Mongo)
    const newComment = post.comments[post.comments.length - 1];
    return NextResponse.json({ comment: newComment });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}