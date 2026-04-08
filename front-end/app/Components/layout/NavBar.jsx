'use client'

import Link from "next/link";

export const NavBar = () => {
  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full flex justify-center z-50">
      
      <div className="w-[90%] max-w-6xl px-6 py-1 rounded-xl bg-[#0b0f1a]/80 backdrop-blur-xl border border-white/10 shadow-lg flex items-center justify-between">

        <div className="flex items-center">
          <img 
            src="/logo.png" 
            alt="DevCollab Logo" 
            className="h-15 w-auto drop-shadow-[0_0_12px_rgba(124,58,237,0.7)]"
          />
        </div>

        <div className="hidden md:flex gap-8 text-gray-300 text-sm">
          <a href="#" className="hover:text-white transition">Explore</a>
          <a href="#" className="hover:text-white transition">Projects</a>
          <a href="#" className="hover:text-white transition">Community</a>
          <a href="#" className="hover:text-white transition">Profile</a>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/sign-up">
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium hover:opacity-90 transition">
              Sign Up
            </button>
          </Link>
        </div>

      </div>

    </div>
  );
};