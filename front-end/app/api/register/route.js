import { connectDB } from "@/database/db";
import User from "@/database/models/user";
import Otp from "@/database/models/otp";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const { name, email, password, otp } = await req.json();

        await connectDB();

        // Verify OTP
        const otpRecord = await Otp.findOne({ email });

        if (!otpRecord) {
            return Response.json(
                { message: "OTP expired or not found. Please request a new one." },
                { status: 400 }
            );
        }

        if (otpRecord.otp !== otp) {
            return Response.json(
                { message: "Invalid OTP. Please try again." },
                { status: 400 }
            );
        }

        // OTP is valid — delete it so it can't be reused
        await Otp.deleteMany({ email });

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return Response.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }

        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashedPassword });

        return Response.json(
            { message: "User created successfully" },
            { status: 201 }
        );

    } catch (error) {
        console.error("Register error:", error);
        return Response.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}