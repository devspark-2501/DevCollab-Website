'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Hero_Section_One from "./Components/layout/Hero-Section-one";
import { NavBar } from "./Components/layout/NavBar";
import Hero_Section_Two from "./Components/layout/Hero-Section-Two";

const Icon = ({ size = 16, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

function CountUp({ to, duration = 1600 }) {
  const [val, setVal] = useState(0);
  const started       = useRef(false);
  const ref           = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const steps = 50;
        const inc   = to / steps;
        let cur     = 0;
        const id = setInterval(() => {
          cur += inc;
          if (cur >= to) { setVal(to); clearInterval(id); }
          else setVal(Math.floor(cur));
        }, duration / steps);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);

  return <span ref={ref}>{val.toLocaleString()}</span>;
}

function Typewriter({ words, speed = 80, pause = 1800 }) {
  const [display, setDisplay]   = useState("");
  const [wIdx, setWIdx]         = useState(0);
  const [cIdx, setCIdx]         = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word  = words[wIdx];
    const delay = deleting ? speed / 2 : speed;
    const id = setTimeout(() => {
      if (!deleting) {
        setDisplay(word.slice(0, cIdx + 1));
        if (cIdx + 1 === word.length) setTimeout(() => setDeleting(true), pause);
        else setCIdx((c) => c + 1);
      } else {
        setDisplay(word.slice(0, cIdx - 1));
        if (cIdx - 1 === 0) {
          setDeleting(false);
          setWIdx((w) => (w + 1) % words.length);
          setCIdx(0);
        } else {
          setCIdx((c) => c - 1);
        }
      }
    }, delay);
    return () => clearTimeout(id);
  }, [cIdx, deleting, wIdx, words, speed, pause]);

  return (
    <span className="text-[#8ba4f5]">
      {display}
      <span className="animate-pulse">|</span>
    </span>
  );
}

function FloatingBadge({ children, className, style }) {
  return (
    <div className={`absolute px-3 py-2 rounded-xl bg-[#13161f]/95 border border-[#1e2029]
                     backdrop-blur text-[11.5px] text-[#c8cad4] flex items-center gap-2
                     shadow-2xl pointer-events-none select-none ${className}`}
         style={style}>
      {children}
    </div>
  );
}

const STATS = [
  { num: 1240, suffix: "+", label: "Developers"   },
  { num: 380,  suffix: "+", label: "Projects"     },
  { num: 5600, suffix: "+", label: "Posts"        },
  { num: 99,   suffix: "%", label: "Free forever" },
];

const FEATURES = [
  {
    icon:  <><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></>,
    label: "Code snippets",
    color: "bg-[#1d2b5c] text-[#8ba4f5] border-[#2a3a7a]",
  },
  {
    icon:  <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    label: "Real community",
    color: "bg-[#1a2e1a] text-[#4ade80] border-[#2a4a2a]",
  },
  {
    icon:  <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>,
    label: "Open discussions",
    color: "bg-[#2e1a2e] text-[#c084fc] border-[#4a2a4a]",
  },
  {
    icon:  <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    label: "Notifications",
    color: "bg-[#2e1a1a] text-[#f87171] border-[#4a2a2a]",
  },
];

export default function Home() {
  const pathname        = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const fadeUp = (delay = 0) => ({
    opacity:    mounted ? 1 : 0,
    transform:  mounted ? "translateY(0)" : "translateY(32px)",
    transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
  });

  return (
    <div className="bg-[#0b0f1a] overflow-x-hidden relative">

      {pathname === "/" && <NavBar />}

      {/* ══════════════════════════════════════════════════════ HERO */}
      <div className="min-h-screen flex items-center justify-start relative">

        {/* glows */}
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-purple-600
                        opacity-[0.15] blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-blue-500
                        opacity-[0.12] blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[700px] h-[300px] bg-indigo-600 opacity-[0.05] blur-[160px]
                        rounded-full pointer-events-none" />

        {/* grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        {/* keyframes */}
        <style>{`
          @keyframes float1 {
            0%,100% { transform: translateY(0px);   }
            50%      { transform: translateY(-10px); }
          }
          @keyframes float2 {
            0%,100% { transform: translateY(0px); }
            50%      { transform: translateY(9px); }
          }
          @keyframes marquee-left {
            0%   { transform: translateX(0);    }
            100% { transform: translateX(-50%); }
          }
          @keyframes marquee-right {
            0%   { transform: translateX(-50%); }
            100% { transform: translateX(0);    }
          }
        `}</style>

        {/* floating badges — desktop only */}
        <div className="hidden lg:block">
          <FloatingBadge
            className="top-[30%] right-[7%]"
            style={{ animation: "float1 6s ease-in-out infinite" }}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
            New post by Tanush M
          </FloatingBadge>

          <FloatingBadge
            className="top-[50%] right-[15%]"
            style={{ animation: "float2 7s ease-in-out infinite" }}>
            <div className="w-5 h-5 rounded-md bg-[#1d2b5c] border border-[#2a3a7a]
                            flex items-center justify-center text-[#8ba4f5] shrink-0">
              <Icon size={10}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></Icon>
            </div>
            <span className="font-mono text-[10.5px] text-[#8ba4f5]">git push origin main</span>
          </FloatingBadge>

          <FloatingBadge
            className="top-[70%] right-[6%]"
            style={{ animation: "float1 8s ease-in-out infinite 1s" }}>
            <div className="flex -space-x-1.5">
              {["T","S","A"].map((l, i) => (
                <div key={i}
                  className="w-5 h-5 rounded-full border border-[#0b0f1a] bg-[#1d2b5c]
                             flex items-center justify-center text-[8px] font-bold text-[#8ba4f5]">
                  {l}
                </div>
              ))}
            </div>
            3 new followers
          </FloatingBadge>

          <FloatingBadge
            className="top-[38%] right-[28%]"
            style={{ animation: "float2 5.5s ease-in-out infinite 0.5s" }}>
            <svg width="12" height="12" viewBox="0 0 24 24"
                 fill="#8ba4f5" stroke="#8ba4f5" strokeWidth="1.5"
                 strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            Sara liked your post
          </FloatingBadge>
        </div>

        {/* ── hero content ── */}
        {/* pt-32 on mobile (navbar ~64px + breathing room), sm:pt-0 centres it vertically */}
        <div className="relative z-10 w-full max-w-3xl px-6 sm:px-10 pt-32 sm:pt-20 lg:pt-0 pb-16 sm:pb-20">

          {/* platform badge */}
          <div style={fadeUp(0)} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 text-[11.5px] rounded-full
                             bg-[#13161f] border border-[#1e2029] text-[#8ba4f5]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8ba4f5] animate-pulse" />
              Developers Platform · Free forever
            </span>
          </div>

          {/* headline */}
          <div style={fadeUp(0.1)}>
            <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-bold leading-[1.08]
                           tracking-tight text-[#ebedf5] mb-6">
              Code. Share.{" "}
              <br className="hidden sm:block" />
              Get{" "}
              <Typewriter
                words={["Noticed.", "Hired.", "Connected.", "Inspired."]}
                speed={75}
                pause={2000}
              />
            </h1>
          </div>

          {/* subtitle */}
          <div style={fadeUp(0.18)}>
            <p className="text-[16px] sm:text-[17px] text-[#5a5f72] leading-relaxed max-w-lg mb-10">
              Turn your ideas into projects, connect with developers worldwide
              and build your presence — all in one place.
            </p>
          </div>

          {/* CTA buttons */}
          <div style={fadeUp(0.26)} className="flex flex-col sm:flex-row gap-3 mb-10">
            <Link href="/sign-up">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2
                                 px-7 py-3.5 rounded-xl text-[14px] font-medium
                                 bg-[#1d2b5c] border border-[#2a3a7a] text-[#8ba4f5]
                                 hover:bg-[#22336e] transition-all">
                Get Started — it's free
                <Icon size={14}>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </Icon>
              </button>
            </Link>
            <Link href="/Feed">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2
                                 px-7 py-3.5 rounded-xl text-[14px] font-medium
                                 bg-transparent border border-[#1e2029] text-[#4a4f62]
                                 hover:bg-[#161820] hover:text-[#8ba4f5] transition-all">
                Browse the feed
                <Icon size={14}><path d="M4 6h16M4 12h16M4 18h16"/></Icon>
              </button>
            </Link>
          </div>

          {/* feature pills */}
          <div style={fadeUp(0.34)} className="flex flex-wrap gap-2 mb-10">
            {FEATURES.map((f, i) => (
              <div key={i}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border
                             text-[11.5px] font-medium ${f.color}`}>
                <Icon size={11}>{f.icon}</Icon>
                {f.label}
              </div>
            ))}
          </div>

          {/* stats */}
          <div style={fadeUp(0.42)} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STATS.map((s, i) => (
              <div key={i}
                className="bg-[#13161f] border border-[#1e2029] rounded-xl p-3.5 text-center
                           hover:border-[#2a3060] transition-colors">
                <div className="text-[22px] font-bold text-[#ebedf5] font-mono leading-none mb-0.5">
                  <CountUp to={s.num} />{s.suffix}
                </div>
                <div className="text-[10px] text-[#2e3244] uppercase tracking-wider">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════════════════ DIVIDER */}
      <div className="flex items-center gap-4 px-6 sm:px-10 py-1">
        <div className="flex-1 border-t border-[#1e2029]" />
        <span className="text-[10px] text-[#2e3244] uppercase tracking-widest">
          What we offer
        </span>
        <div className="flex-1 border-t border-[#1e2029]" />
      </div>

      {/* ══════════════════════════════════════════════════ SECTION 1 */}
      <Hero_Section_One />

      {/* ══════════════════════════════════════════════════ DIVIDER */}
      <div className="flex items-center gap-4 px-6 sm:px-10 py-1">
        <div className="flex-1 border-t border-[#1e2029]" />
        <span className="text-[10px] text-[#2e3244] uppercase tracking-widest">
          Community posts
        </span>
        <div className="flex-1 border-t border-[#1e2029]" />
      </div>

      {/* ══════════════════════════════════════════════════ SECTION 2 */}
      <Hero_Section_Two />

    </div>
  );
}