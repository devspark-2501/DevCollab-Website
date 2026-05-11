import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/database/db";
import User from "@/database/models/user";
import OTP from "@/database/models/otp"; // adjust path if needed

export async function POST(req) {
  try {
    await connectDB();
    const { username, email, password, otp } = await req.json();

    if (!username || !email || !password || !otp) {
      return NextResponse.json({ message: "All fields required" }, { status: 400 });
    }

    // validate username format
    if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
      return NextResponse.json({ message: "Invalid username format" }, { status: 400 });
    }

    // check username uniqueness
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return NextResponse.json({ message: "Username already taken" }, { status: 409 });
    }

    // check email uniqueness
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return NextResponse.json({ message: "Email already registered" }, { status: 409 });
    }

    // verify OTP
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12);
    await User.create({ username, email, password: hashed });
    await OTP.deleteMany({ email });

    return NextResponse.json({ message: "Account created" }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}