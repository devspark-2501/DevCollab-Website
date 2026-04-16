'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import Hero_Section_One from "./Components/layout/Hero-Section-one";
import { NavBar } from "./Components/layout/NavBar";

// export const metadata = {
//   title: "Dev Collab | Home"
// };

export default function Home() {
  const pathname = usePathname();

  return (
    <div className="bg-[#0b0f1a] overflow-hidden relative">
      
      {pathname === "/" && <NavBar />}

      {/* HERO SECTION */}
      <div className="min-h-screen flex items-center justify-start relative">
        
        {/* Glow */}
        <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-purple-600 opacity-20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-200px] left-[100px] w-[400px] h-[400px] bg-blue-500 opacity-20 blur-[120px] rounded-full"></div>

        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl px-10">
          
          <div className="mb-6">
            <span className="px-4 py-1 text-sm rounded-full bg-white/5 text-gray-300 border border-white/10 backdrop-blur">
              Developers Platform
            </span>
          </div>

          <h1 className="text-5xl font-bold leading-tight text-white">
            Code. Share. Get Noticed.<br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
              Built for Developers
            </span>
          </h1>

          <p className="mt-6 text-gray-400 text-lg max-w-lg">
            Turn your ideas into projects, connect with developers, and build your presence.
          </p>

          <div className="mt-8 flex gap-4">
            <Link href="/sign-up">
              <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium shadow-lg hover:opacity-90 transition">
                Get Started
              </button>
            </Link>
            <button className="px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition">
              Learn More
            </button>
          </div>

        </div>
      </div>

      {/* NEW SECTION (separate, full width) */}
      <Hero_Section_One />

    </div>
  );
}