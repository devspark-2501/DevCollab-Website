import { NextResponse } from "next/server";
import { connectDB } from "@/database/db";
import Review from "@/database/models/review";

// GET — fetch all reviews, newest first
export async function GET() {
  try {
    await connectDB();
    const reviews = await Review.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, reviews }, { status: 200 });
  } catch (error) {
    console.error("GET /api/review/community error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch reviews." },
      { status: 500 }
    );
  }
}

// POST — save a new review
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, role, rating, text, tag } = body;

    // Server-side validation
    if (!name?.trim())
      return NextResponse.json({ success: false, message: "Name is required." }, { status: 400 });

    if (!role?.trim())
      return NextResponse.json({ success: false, message: "Role is required." }, { status: 400 });

    if (!rating || rating < 1 || rating > 5)
      return NextResponse.json({ success: false, message: "Rating must be between 1 and 5." }, { status: 400 });

    if (!text?.trim() || text.trim().length < 20)
      return NextResponse.json({ success: false, message: "Review must be at least 20 characters." }, { status: 400 });

    // Generate initials + consistent color from name
    const AVATAR_COLORS = [
      "bg-blue-500/20 text-blue-300 border-blue-500/30",
      "bg-purple-500/20 text-purple-300 border-purple-500/30",
      "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      "bg-rose-500/20 text-rose-300 border-rose-500/30",
      "bg-amber-500/20 text-amber-300 border-amber-500/30",
      "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    ];
    const avatar = name.trim().split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    const color  = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

    const review = await Review.create({
      name:   name.trim(),
      role:   role.trim(),
      avatar,
      color,
      rating,
      text:   text.trim(),
      tag:    tag || "General",
      likes:  0,
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error) {
    console.error("POST /api/review/community error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save review." },
      { status: 500 }
    );
  }
}

// PATCH — increment likes for a review
export async function PATCH(req) {
  try {
    await connectDB();

    const { id } = await req.json();
    if (!id)
      return NextResponse.json({ success: false, message: "Review ID required." }, { status: 400 });

    const review = await Review.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!review)
      return NextResponse.json({ success: false, message: "Review not found." }, { status: 404 });

    return NextResponse.json({ success: true, likes: review.likes }, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/review/community error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update likes." },
      { status: 500 }
    );
  }
}