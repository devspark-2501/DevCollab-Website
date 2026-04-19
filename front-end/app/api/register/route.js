import { connectDB } from "@/database/db";
import User from "@/database/models/user";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();

        await connectDB();

        // check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return Response.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return Response.json(
            { message: "User created successfully" },
            { status: 201 }
        );

    } catch (error) {
        console.error(error);
        return Response.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}