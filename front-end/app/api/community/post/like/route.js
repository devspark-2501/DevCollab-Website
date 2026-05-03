import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Post from "@/models/Post";

export async function POST(req) {
  try {
    await dbConnect();

    const { postId, userEmail } = await req.json();

    if (!postId || !userEmail) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const alreadyLiked = post.likedBy.includes(userEmail);

    if (alreadyLiked) {
      // UNLIKE
      post.likedBy = post.likedBy.filter((e) => e !== userEmail);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      // LIKE
      post.likedBy.push(userEmail);
      post.likes += 1;
    }

    await post.save();

    return NextResponse.json({ post });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}