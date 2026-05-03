import { NextResponse } from "next/server";
import { connectDB } from "@/database/db";   // ✅ named import
import Post from "@/database/models/post";   // adjust if needed

export async function POST(req) {
  try {
    await connectDB();                        // ✅ correct function name

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
      post.likedBy = post.likedBy.filter((e) => e !== userEmail);
      post.likes   = Math.max(0, post.likes - 1);
    } else {
      post.likedBy.push(userEmail);
      post.likes += 1;
    }

    await post.save();

    // ✅ return real DB values so the UI always shows the true count
    return NextResponse.json({ likes: post.likes, likedBy: post.likedBy });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}