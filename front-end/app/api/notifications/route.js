import { NextResponse } from "next/server";
import { connectDB } from "@/database/db";
import Notification from "@/database/models/notification";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// This route handles all notification-related actions:

// GET — fetch notifications for the logged-in user
export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notifications = await Notification.find({ toEmail: session.user.email })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    const unreadCount = notifications.filter((n) => !n.read).length;

    return NextResponse.json({ notifications, unreadCount });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH — mark all notifications as read
export async function PATCH() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await Notification.updateMany(
      { toEmail: session.user.email, read: false },
      { $set: { read: true } }
    );

    return NextResponse.json({ ok: true });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE — clear all notifications
export async function DELETE() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await Notification.deleteMany({ toEmail: session.user.email });

    return NextResponse.json({ ok: true });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}