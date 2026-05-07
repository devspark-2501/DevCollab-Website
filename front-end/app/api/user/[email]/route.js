import { NextResponse } from "next/server";
import { connectDB } from "@/database/db";
import Post from "@/database/models/post";
import User from "@/database/models/user";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const email = decodeURIComponent(params.email);

    const [posts, user] = await Promise.all([
      Post.find({ userEmail: email }).sort({ createdAt: -1 }).lean(),
      User.findOne({ email }).lean(),
    ]);

    if (!user) {
      // fallback — user exists in posts but not users collection
      return NextResponse.json({
        user: {
          email,
          name:           posts[0]?.userName || email.split("@")[0],
          followers:      [],
          following:      [],
          followerCount:  0,
          followingCount: 0,
        },
        posts,
      });
    }

    return NextResponse.json({
      user: {
        email,
        name:           user.name,
        followers:      user.followers || [],
        following:      user.following || [],
        followerCount:  (user.followers || []).length,
        followingCount: (user.following || []).length,
      },
      posts,
    });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}