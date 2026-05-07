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

    // fetch me first to check current follow state
    const me = await User.findOne({ email: myEmail });
    if (!me) {
      return NextResponse.json({ error: "Your account not found" }, { status: 404 });
    }

    // safely handle missing array on old users
    const alreadyFollowing = (me.following || []).includes(targetEmail);

    if (alreadyFollowing) {
      // ── UNFOLLOW — $pull works even if array was missing
      await User.updateOne(
        { email: myEmail },
        { $pull: { following: targetEmail } }
      );
      await User.updateOne(
        { email: targetEmail },
        { $pull: { followers: myEmail } }
      );
    } else {
      // ── FOLLOW — $addToSet prevents duplicates automatically
      await User.updateOne(
        { email: myEmail },
        { $addToSet: { following: targetEmail } }
      );
      await User.updateOne(
        { email: targetEmail },
        { $addToSet: { followers: myEmail } }
      );

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

    // fetch fresh counts AFTER the update
    const [updatedMe, updatedTarget] = await Promise.all([
      User.findOne({ email: myEmail }),
      User.findOne({ email: targetEmail }),
    ]);

    return NextResponse.json({
      following:      !alreadyFollowing,
      followerCount:  (updatedTarget?.followers || []).length,
      followingCount: (updatedMe?.following    || []).length,
    });

  } catch (err) {
    console.error("Follow error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}