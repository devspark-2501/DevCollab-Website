import { connectDB } from "@/database/db";
import Otp from "@/database/models/otp";
import nodemailer from "nodemailer";

export async function POST(req) {
    try {
        const { email } = await req.json();

        if (!email) {
            return Response.json({ message: "Email is required" }, { status: 400 });
        }

        await connectDB();

        // Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Delete any existing OTP for this email
        await Otp.deleteMany({ email });

        // Save new OTP
        await Otp.create({ email, otp: otpCode });

        // Setup Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Send email
        await transporter.sendMail({
            from: `"Dev Community" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your OTP Code – Dev Community",
            html: `
                <div style="font-family: sans-serif; background: #0b0f1a; color: #fff; padding: 32px; border-radius: 12px; max-width: 480px; margin: auto;">
                    <h2 style="color: #a78bfa; margin-bottom: 8px;">Verify your email</h2>
                    <p style="color: #9ca3af; margin-bottom: 24px;">Use the OTP below to complete your registration. It expires in <strong style="color:#fff">5 minutes</strong>.</p>
                    <div style="font-size: 36px; font-weight: 700; letter-spacing: 12px; text-align: center; color: #fff; background: #111827; padding: 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
                        ${otpCode}
                    </div>
                    <p style="color: #6b7280; font-size: 12px; margin-top: 24px; text-align: center;">If you didn't request this, you can safely ignore this email.</p>
                </div>
            `,
        });

        return Response.json({ message: "OTP sent successfully" }, { status: 200 });

    } catch (error) {
        console.error("Send OTP error:", error);
        return Response.json({ message: "Failed to send OTP" }, { status: 500 });
    }
}