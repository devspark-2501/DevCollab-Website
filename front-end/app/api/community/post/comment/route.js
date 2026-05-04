import { NextResponse } from "next/server";
import { connectDB } from "@/database/db";
import Post from "@/database/models/post";
import Notification from "@/database/models/notification";

export async function POST(req) {
  try {
    await connectDB();

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

    // ── notify post owner (but not if they reply to their own post)
    if (post.userEmail !== userEmail) {
      await Notification.create({
        toEmail:     post.userEmail,
        fromName:    userName,
        fromEmail:   userEmail,
        type:        "comment",
        postId:      postId,
        postSnippet: post.userContent?.slice(0, 60),
      });
    }

    const newComment = post.comments[post.comments.length - 1];
    return NextResponse.json({ comment: newComment });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}