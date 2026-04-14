'use client'
import Link from "next/link";

export default function Hero_Section_One() {
  return (
    <div className="min-h-screen bg-[#0b0f1a] relative overflow-hidden flex items-center justify-center">
      
      {/* Glow Effects */}
      <div className="absolute top-[-150px] right-[-150px] w-[400px] h-[400px] bg-blue-500 opacity-20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-150px] left-[-150px] w-[400px] h-[400px] bg-purple-600 opacity-20 blur-[120px] rounded-full"></div>

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="relative z-10 max-w-6xl px-6 py-20 w-full">
        
        {/* Heading */}
        <div className="text-center mb-16">
          <span className="px-4 py-1 text-sm rounded-full bg-white/5 text-gray-300 border border-white/10 backdrop-blur">
            Developer Community
          </span>

          <h2 className="mt-6 text-4xl font-bold text-white">
            Connect. Collaborate. Grow.
          </h2>

          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            A social network built for developers to share projects, collaborate in real-time, and build a strong presence in the tech community.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur hover:bg-white/10 transition">
            <h3 className="text-xl font-semibold text-white mb-2">
              Share Projects
            </h3>
            <p className="text-gray-400 text-sm">
              Showcase your work, get feedback, and build your developer portfolio.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur hover:bg-white/10 transition">
            <h3 className="text-xl font-semibold text-white mb-2">
              Collaborate Live
            </h3>
            <p className="text-gray-400 text-sm">
              Team up with other developers, contribute to projects, and grow together.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur hover:bg-white/10 transition">
            <h3 className="text-xl font-semibold text-white mb-2">
              Build Reputation
            </h3>
            <p className="text-gray-400 text-sm">
              Gain followers, earn credibility, and stand out in the dev community.
            </p>
          </div>

        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link href="/explore">
            <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium shadow-lg hover:opacity-90 transition">
              Explore Community
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}