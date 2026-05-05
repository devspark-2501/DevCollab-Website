import { NextResponse } from "next/server";
import { connectDB } from "@/database/db";
import Post from "@/database/models/post";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const email = decodeURIComponent(params.email);

    const posts = await Post.find({ userEmail: email })
      .sort({ createdAt: -1 })
      .lean();

    const user = {
      email,
      name: posts[0]?.userName || email.split("@")[0],
    };

    return NextResponse.json({ user, posts });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}