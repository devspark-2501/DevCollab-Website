import { connectDB } from "@/database/db";
import User from "@/database/models/user";
import { NextResponse } from "next/server";

// GET all users
export async function GET() {
  try {
    await connectDB();

    const users = await User.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, users }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch users", error: error.message },
      { status: 500 }
    );
  }
}

// CREATE user
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, password } = body;

    // basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // check existing
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 409 }
      );
    }

    const newUser = await User.create({
      name,
      email,
      password, // later hash this (important)
    });

    return NextResponse.json(
      { success: true, user: newUser },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to create user", error: error.message },
      { status: 500 }
    );
  }
}