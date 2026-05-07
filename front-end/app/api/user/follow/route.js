import { NextResponse } from "next/server";
import { connectDB } from "@/database/db";
import User from "@/database/models/user";
import Notification from "@/database/models/notification";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetEmail } = await req.json();

    if (!targetEmail) {
      return NextResponse.json({ error: "Missing targetEmail" }, { status: 400 });
    }

    const myEmail = session.user.email;
    const myName  = session.user.name;

    if (myEmail === targetEmail) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
    }

    const [me, target] = await Promise.all([
      User.findOne({ email: myEmail }),
      User.findOne({ email: targetEmail }),
    ]);

    if (!me || !target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const alreadyFollowing = me.following.includes(targetEmail);

    if (alreadyFollowing) {
      // ── UNFOLLOW
      me.following     = me.following.filter((e) => e !== targetEmail);
      target.followers = target.followers.filter((e) => e !== myEmail);
    } else {
      // ── FOLLOW
      me.following.push(targetEmail);
      target.followers.push(myEmail);

      // notify the person being followed
      await Notification.create({
        toEmail:     targetEmail,
        fromName:    myName,
        fromEmail:   myEmail,
        type:        "follow",
        postId:      "none",
        postSnippet: "",
      });
    }

    await Promise.all([me.save(), target.save()]);

    return NextResponse.json({
      following:        !alreadyFollowing,
      followerCount:    target.followers.length,
      followingCount:   me.following.length,
    });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}