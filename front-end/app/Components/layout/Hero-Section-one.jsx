'use client'

import { useState, useEffect, useRef } from "react";

const Icon = ({ size = 16, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const COLORS = [
  "bg-[#1d2b5c] text-[#8ba4f5] border-[#2a3a7a]",
  "bg-[#1a2e1a] text-[#4ade80] border-[#2a4a2a]",
  "bg-[#2e1a2e] text-[#c084fc] border-[#4a2a4a]",
  "bg-[#2e1a1a] text-[#f87171] border-[#4a2a2a]",
  "bg-[#1a2a2e] text-[#38bdf8] border-[#2a3a4a]",
  "bg-[#2e2a1a] text-[#fbbf24] border-[#4a3a2a]",
];
function getColor(i) { return COLORS[i % COLORS.length]; }

const MEMBERS_ROW_1 = [
  { name: "Tanush M",  role: "Full Stack Dev" },
  { name: "Sara K",    role: "ML Engineer" },
  { name: "Alex R",    role: "DevOps" },
  { name: "Priya S",   role: "Frontend Dev" },
  { name: "Jordan L",  role: "Backend Dev" },
  { name: "Wei C",     role: "Systems Eng" },
  { name: "Maya P",    role: "Product Eng" },
  { name: "Omar F",    role: "Security Eng" },
];

const MEMBERS_ROW_2 = [
  { name: "Lena V",    role: "Data Eng" },
  { name: "Kai B",     role: "Mobile Dev" },
  { name: "Ines T",    role: "UI Engineer" },
  { name: "Dev N",     role: "Cloud Arch" },
  { name: "Zara H",    role: "SRE" },
  { name: "Rohan D",   role: "Blockchain Dev" },
  { name: "Mia L",     role: "Game Dev" },
  { name: "Felix W",   role: "Embedded Eng" },
];

const FEATURES = [
  {
    icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    title: "Real people",
    desc:  "Connect with builders, designers and engineers shipping real products.",
  },
  {
    icon: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>,
    title: "Open discussions",
    desc:  "Post ideas, ask questions and get honest feedback from the community.",
  },
  {
    icon: <><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></>,
    title: "Code together",
    desc:  "Share snippets, review PRs and solve problems with fellow engineers.",
  },
  {
    icon: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    title: "Stay updated",
    desc:  "Get notified when someone replies, likes or follows you.",
  },
];

function CountUp({ target }) {
  const [count, setCount] = useState(0);
  const ref     = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    if (target === null) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const steps = 60;
        const inc   = target / steps;
        let cur     = 0;
        const id = setInterval(() => {
          cur += inc;
          if (cur >= target) { setCount(target); clearInterval(id); }
          else setCount(Math.floor(cur));
        }, 1800 / steps);
      }
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="tabular-nums">
      {target === null
        ? <span className="inline-block w-10 h-5 rounded bg-[#1e2029] animate-pulse align-middle" />
        : count.toLocaleString()
      }
    </span>
  );
}

// ── Infinite marquee row ──────────────────────────────────────────────────────
function MarqueeRow({ members, direction = "left", speed = 35 }) {
  // duplicate enough times so gap never shows
  const items = [...members, ...members, ...members, ...members];

  return (
    <div className="relative overflow-hidden">
      {/* left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
           style={{ background: "linear-gradient(to right, #0b0f1a, transparent)" }} />
      {/* right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
           style={{ background: "linear-gradient(to left, #0b0f1a, transparent)" }} />

      <div
        className="flex gap-3 w-max"
        style={{
          animation: `marquee-${direction} ${speed}s linear infinite`,
        }}
      >
        {items.map((m, i) => (
          <div key={i}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl
                       bg-[#13161f] border border-[#1e2029]
                       hover:border-[#2a3060] hover:bg-[#14172a]
                       transition-colors shrink-0 group cursor-default"
            style={{ minWidth: "180px" }}
          >
            <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center
                             text-[13px] font-bold shrink-0 ${getColor(i)}`}>
              {m.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-[12.5px] font-semibold text-[#c8cad4] leading-none truncate">
                {m.name}
              </p>
              <p className="text-[10.5px] text-[#3a4470] mt-0.5 truncate">{m.role}</p>
            </div>
            {/* online dot */}
            <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CommunitySection() {
  const [memberCount, setMemberCount] = useState(null);
  const [visible, setVisible]         = useState(false);
  const sectionRef                    = useRef(null);

  useEffect(() => {
    fetch("/api/community")
      .then((r) => r.json())
      .then((d) => setMemberCount(d.members))
      .catch(() => setMemberCount(null));
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const fadeUp = (delay = 0) => ({
    opacity:    visible ? 1 : 0,
    transform:  visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  });

  return (
    <section ref={sectionRef}
             className="relative bg-[#0b0f1a] overflow-hidden py-28">

      {/* keyframes injected once */}
      <style>{`
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      {/* glows */}
      <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-blue-500 opacity-[0.06] blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-purple-600 opacity-[0.06] blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8">

        {/* ── HEADER ── */}
        <div style={fadeUp(0)} className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] rounded-full
                             bg-[#1d2b5c]/60 text-[#8ba4f5] border border-[#2a3a7a]/50 tracking-wide">
              <Icon size={10}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </Icon>
              Meet the people
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] rounded-full
                             bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              Growing daily
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-[58px] font-bold text-[#ebedf5]
                         tracking-tight leading-[1.08] mb-5">
            Our{" "}
            <span className="text-[#8ba4f5]">Community</span>
          </h2>

          <p className="text-[15px] sm:text-[16px] text-[#5a5f72] leading-relaxed max-w-xl mx-auto mb-10">
            Thousands of developers, designers and builders — all in one place.
            Share ideas, ship products and grow together.
          </p>

          {/* member count */}
          <div className="inline-flex flex-col items-center gap-1.5
                          px-10 py-6 rounded-2xl bg-[#13161f] border border-[#1e2029]
                          hover:border-[#2a3060] transition-colors">
            <span className="text-5xl sm:text-6xl font-bold text-[#ebedf5] font-mono tracking-tight">
              <CountUp target={memberCount} />
            </span>
            <span className="text-[11px] text-[#2e3244] uppercase tracking-widest">
              Members &amp; counting
            </span>
          </div>
        </div>

      </div>

      {/* ── MARQUEE ROWS (full bleed, no container constraint) ── */}
      <div style={fadeUp(0.1)} className="relative z-10 mb-4 space-y-3">
        {/* row 1 — left */}
        <MarqueeRow members={MEMBERS_ROW_1} direction="left"  speed={30} />
        {/* row 2 — right (opposite direction for depth) */}
        <MarqueeRow members={MEMBERS_ROW_2} direction="right" speed={28} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8">

        {/* trailing hint */}
        <div style={fadeUp(0.15)} className="flex items-center justify-center gap-2 mt-5 mb-20">
          <div className="flex -space-x-2.5">
            {[0,1,2,3,4,5].map((i) => (
              <div key={i}
                className={`w-7 h-7 rounded-full border-2 border-[#0b0f1a]
                             flex items-center justify-center text-[10px] font-bold ${getColor(i)}`}>
                {MEMBERS_ROW_1[i].name.charAt(0)}
              </div>
            ))}
          </div>
          <span className="text-[12px] text-[#3a4470]">
            +{memberCount !== null ? (memberCount - 16).toLocaleString() : "…"} more developers online
          </span>
        </div>

        {/* ── FEATURES ── */}
        <div style={fadeUp(0.2)} className="mb-20">
          <p className="text-[10.5px] text-[#2e3244] uppercase tracking-widest text-center mb-6">
            What you get
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {FEATURES.map((f, i) => (
              <div key={i}
                className="bg-[#13161f] border border-[#1e2029] rounded-xl p-5
                           hover:border-[#2a3060] hover:bg-[#14172a] transition-all">
                <div className={`w-9 h-9 rounded-lg border flex items-center justify-center mb-4 ${getColor(i)}`}>
                  <Icon size={15}>{f.icon}</Icon>
                </div>
                <p className="text-[13.5px] font-semibold text-[#ebedf5] mb-1.5">{f.title}</p>
                <p className="text-[12px] text-[#5a5f72] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── STATS ── */}
        <div style={fadeUp(0.25)} className="mb-20">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { val: "100%", label: "Free forever",      icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/> },
              { val: "24/7", label: "Always online",     icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></> },
              { val: "0",    label: "Ads or tracking",   icon: <><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></> },
              { val: "∞",    label: "Posts & replies",   icon: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></> },
            ].map((s, i) => (
              <div key={i}
                className="bg-[#13161f] border border-[#1e2029] rounded-xl p-4 text-center
                           hover:border-[#2a3060] transition-colors">
                <div className="flex items-center justify-center mb-2 text-[#3a4470]">
                  <Icon size={14}>{s.icon}</Icon>
                </div>
                <div className="text-2xl font-bold text-[#ebedf5] font-mono mb-0.5">{s.val}</div>
                <div className="text-[10px] text-[#2e3244] uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div style={fadeUp(0.3)} className="text-center">
          <div className="inline-flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <a href="/sign-up"
                className="flex items-center gap-2 px-7 py-3 rounded-xl text-[13.5px] font-medium
                           bg-[#1d2b5c] border border-[#2a3a7a] text-[#8ba4f5]
                           hover:bg-[#22336e] transition-all">
                Join for free
                <Icon size={13}>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </Icon>
              </a>
              <a href="/Feed"
                className="flex items-center gap-2 px-7 py-3 rounded-xl text-[13.5px] font-medium
                           bg-transparent border border-[#1e2029] text-[#4a4f62]
                           hover:bg-[#161820] hover:text-[#8ba4f5] transition-all">
                Browse feed
                <Icon size={13}><path d="M4 6h16M4 12h16M4 18h16"/></Icon>
              </a>
            </div>
            <p className="text-[11.5px] text-[#2e3244]">
              No credit card · No ads · No BS
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}