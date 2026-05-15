import { NextResponse } from "next/server";
import { encode } from "next-auth/jwt";
import { cookies } from "next/headers";
 
const SESSION_COOKIE =
  process.env.NODE_ENV === "production"
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token";
 
export async function POST(req) {
  try {
    const { token } = await req.json();
 
    if (!token || typeof token !== "object") {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }
 
    // Re-encode the saved token payload into a fresh signed JWT
    const encoded = await encode({
      token,
      secret: process.env.NEXTAUTH_SECRET,
    });
 
    // Set it as the session cookie — browser is now "logged in" as that account
    const cookieStore = cookies();
    cookieStore.set(SESSION_COOKIE, encoded, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      // Mirror your next-auth session maxAge (default 30 days)
      maxAge: 60 * 60 * 24 * 30,
    });
 
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("switch-account error:", err);
    return NextResponse.json({ error: "Switch failed" }, { status: 500 });
  }
}