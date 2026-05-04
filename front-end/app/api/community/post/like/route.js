// app/api/community/post/like/route.js
import { connectDB } from "@/database/db";
import Post from "@/database/models/post";
import Notification from "@/database/models/notification";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { postId, userEmail, userName } = await req.json();

    const post = await Post.findById(postId);
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    const alreadyLiked = post.likedBy.includes(userEmail);
    if (alreadyLiked) {
      post.likedBy = post.likedBy.filter((e) => e !== userEmail);
      post.likes   = Math.max(0, post.likes - 1);
    } else {
      post.likedBy.push(userEmail);
      post.likes += 1;

      // only notify if liking someone else's post
      if (post.userEmail !== userEmail) {
        await Notification.create({
          toEmail:     post.userEmail,
          fromName:    userName,
          fromEmail:   userEmail,
          type:        "like",
          postId:      postId,
          postSnippet: post.userContent?.slice(0, 60),
        });
      }
    }

    await post.save();
    return NextResponse.json({ likes: post.likes, likedBy: post.likedBy });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}