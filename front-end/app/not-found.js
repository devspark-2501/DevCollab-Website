'use client';

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[#0b0f1a] flex items-center justify-center overflow-hidden">

      <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-150px] right-[-100px] w-[350px] h-[350px] bg-blue-500/20 blur-[120px] rounded-full"></div>

      <div className="absolute inset-0 opacity-40 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-10 max-w-xl w-full text-center shadow-2xl">

        {/* <div className="flex flex-col items-center gap-4 mb-6">
          <img
            src="/logo.png"
            alt="DevCollab Logo"
            className="h-14 w-auto drop-shadow-[0_0_18px_rgba(124,58,237,0.8)]"
          />
          <span className="text-sm text-gray-400 tracking-wide">
            DevCollab
          </span>
        </div> */}

        <h1 className="text-6xl font-bold text-white tracking-tight">
          Lost in Code?
        </h1>

        <p className="mt-4 text-gray-400 text-lg">
          This route doesn’t exist. Maybe it was never pushed.
        </p>

        <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <button className="w-full sm:w-auto px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium shadow-lg hover:scale-[1.03] transition">
              Back to Home
            </button>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-6 py-3 rounded-lg border border-white/10 text-gray-300 hover:bg-white/10 transition"
          >
            Go Back
          </button>
        </div>

        <p className="mt-8 text-xs text-gray-500">
          Error 404 • Route not found
        </p>

      </div>
    </div>
  );
}