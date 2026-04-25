"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";

export const NavBar = () => {
const { data: session, status } = useSession();
const [menuOpen, setMenuOpen] = useState(false);
const [mounted, setMounted] = useState(false);

useEffect(() => {
setMounted(true);
}, []);

if (!mounted) return null;

return ( <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full flex justify-center z-50"> <div className="w-[90%] max-w-6xl px-6 py-2 rounded-xl bg-[#0b0f1a]/80 backdrop-blur-xl border border-white/10 shadow-lg flex flex-col md:flex-row md:items-center justify-between">

    {/* Top Row */}
    <div className="flex items-center justify-between w-full">

      {/* Logo */}
      <Link href="/" className="flex items-center">
        <img
          src="/logo.png"
          alt="DevCollab Logo"
          className="h-12 w-auto"
        />
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex gap-8 text-gray-300 text-sm">
        <Link href="/Explore">Explore</Link>
        <Link href="/Feed">Posts</Link>
        <Link href="/Community">Community</Link>
        <Link href="/Profile">Profile</Link>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">

        {status === "loading" ? (
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        ) : session ? (
          <Link href="/Profile">
            <img
              src={session?.user?.image || "/default-avatar.png"}
              alt="profile"
              className="w-9 h-9 rounded-full border border-white/10"
            />
          </Link>
        ) : (
          <Link href="/sign-up">
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm">
              Sign Up
            </button>
          </Link>
        )}

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`block w-5 h-0.5 bg-gray-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-0.5 bg-gray-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-gray-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>

      </div>
    </div>

    {/* Mobile Menu */}
    {menuOpen && (
      <div className="md:hidden flex flex-col gap-4 text-gray-300 text-sm pt-4 pb-2 border-t border-white/10 mt-3">
        <Link href="/Explore">Explore</Link>
        <Link href="/Feed">Posts</Link>
        <Link href="/Community">Community</Link>
        <Link href="/Profile">Profile</Link>
      </div>
    )}

  </div>
</div>

);
};
