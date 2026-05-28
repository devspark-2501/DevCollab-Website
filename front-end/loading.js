'use client'

// client component!!
export default function Loading() {
  return (
    // loading page!
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a] relative overflow-hidden">

      <div className="absolute w-[400px] h-[400px] bg-purple-600 opacity-20 blur-[120px] rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-blue-500 opacity-20 blur-[120px] rounded-full bottom-[-100px] right-[-100px]" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        
        <div className="w-14 h-14 border-2 border-white/10 border-t-purple-500 border-r-blue-500 rounded-lg animate-spin shadow-[0_0_20px_rgba(124,58,237,0.5)]" />

        // loading content text
        <p className="text-gray-400 text-sm tracking-wide">
          Loading your dev space...
        </p>

      </div>
    </div>
  );
}
