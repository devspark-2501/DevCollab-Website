'use client'
import { useState, useEffect, useRef } from "react";

const images = [
  { id: 1, src: "https://picsum.photos/seed/dev1/800/500", alt: "Community 1" },
  { id: 2, src: "https://picsum.photos/seed/dev2/800/500", alt: "Community 2" },
  { id: 3, src: "https://picsum.photos/seed/dev3/800/500", alt: "Community 3" },
  { id: 4, src: "https://picsum.photos/seed/dev4/800/500", alt: "Community 4" },
  { id: 5, src: "https://picsum.photos/seed/dev5/800/500", alt: "Community 5" },
  { id: 6, src: "https://picsum.photos/seed/dev6/800/500", alt: "Community 6" },
  { id: 7, src: "https://picsum.photos/seed/dev7/800/500", alt: "Community 7" },
  { id: 8, src: "https://picsum.photos/seed/dev8/800/500", alt: "Community 8" },
  { id: 9, src: "https://picsum.photos/seed/dev9/800/500", alt: "Community 9" },
  { id: 10, src: "https://picsum.photos/seed/dev10/800/500", alt: "Community 10" },
  { id: 11, src: "https://picsum.photos/seed/dev11/800/500", alt: "Community 11" },
];

export default function CommunitySection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [memberCount, setMemberCount] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const autoPlayRef = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    fetch("/api/community")
      .then((res) => res.json())
      .then((data) => setMemberCount(data.members))
      .catch(() => setMemberCount(null));
  }, []);

  const total = images.length;

  const getIndex = (offset) => (activeIndex + offset + total) % total;

  const goTo = (index) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((index + total) % total);
    setTimeout(() => setIsAnimating(false), 400);
  };

  const prev = () => goTo(activeIndex - 1);
  const next = () => goTo(activeIndex + 1);

  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      goTo(activeIndex + 1);
    }, 3500);
    return () => clearInterval(autoPlayRef.current);
  }, [activeIndex]);

  // Desktop: 7 slots, Mobile: 3 slots
  const visibleOffsets = isMobile ? [-1, 0, 1] : [-3, -2, -1, 0, 1, 2, 3];

  const slots = visibleOffsets.map((offset) => ({
    index: getIndex(offset),
    offset,
    image: images[getIndex(offset)],
  }));

  const slotStylesDesktop = {
    "-3": { transform: "translateX(-295%) scale(0.58)", opacity: 0.25, zIndex: 1, filter: "blur(1.5px)" },
    "-2": { transform: "translateX(-195%) scale(0.70)", opacity: 0.45, zIndex: 2, filter: "blur(1px)" },
    "-1": { transform: "translateX(-105%) scale(0.82)", opacity: 0.70, zIndex: 3, filter: "blur(0px)" },
    "0":  { transform: "translateX(0%)    scale(1)",    opacity: 1,    zIndex: 10, filter: "blur(0px)" },
    "1":  { transform: "translateX(105%)  scale(0.82)", opacity: 0.70, zIndex: 3, filter: "blur(0px)" },
    "2":  { transform: "translateX(195%)  scale(0.70)", opacity: 0.45, zIndex: 2, filter: "blur(1px)" },
    "3":  { transform: "translateX(295%)  scale(0.58)", opacity: 0.25, zIndex: 1, filter: "blur(1.5px)" },
  };

  const slotStylesMobile = {
    "-1": { transform: "translateX(-112%) scale(0.80)", opacity: 0.55, zIndex: 3, filter: "blur(0px)" },
    "0":  { transform: "translateX(0%)    scale(1)",    opacity: 1,    zIndex: 10, filter: "blur(0px)" },
    "1":  { transform: "translateX(112%)  scale(0.80)", opacity: 0.55, zIndex: 3, filter: "blur(0px)" },
  };

  const slotStyles = isMobile ? slotStylesMobile : slotStylesDesktop;

  // Card width: wider on mobile so the center card is readable
  const cardWidth = isMobile ? "clamp(220px, 72vw, 340px)" : "clamp(240px, 30vw, 420px)";

  return (
    <div className="min-h-screen bg-[#0b0f1a] relative overflow-hidden flex flex-col items-center justify-center py-24 px-6">

      {/* Glow Effects */}
      <div className="absolute top-[-150px] right-[-150px] w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-blue-500 opacity-20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-150px] left-[-150px] w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-purple-600 opacity-20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[200px] md:w-[600px] md:h-[300px] bg-indigo-600 opacity-10 blur-[140px] rounded-full pointer-events-none" />

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 text-center mb-14 max-w-2xl px-4">
        <span className="inline-block px-4 py-1 text-xs rounded-full bg-white/5 text-gray-400 border border-white/10 backdrop-blur tracking-widest uppercase mb-5">
          Meet The People
        </span>
        <h2
          className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight"
          style={{
            fontFamily: "'Syne', 'Space Grotesk', sans-serif",
            letterSpacing: "-0.02em",
          }}
        >
          Our{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #a78bfa, #60a5fa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Community
          </span>
        </h2>
        <p className="mt-4 text-gray-400 text-sm md:text-base leading-relaxed">
          Thousands of developers, designers, and builders — all in one place.
          Share ideas, ship products, and grow together.
        </p>

        {/* Stat pills */}
        <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
          <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur flex items-center gap-2">
            <span
              className="text-sm font-bold"
              style={{
                background: "linear-gradient(90deg, #a78bfa, #60a5fa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {memberCount === null ? (
                <span className="inline-block w-6 h-3 rounded bg-white/10 animate-pulse align-middle" />
              ) : (
                memberCount.toLocaleString()
              )}
            </span>
            <span className="text-gray-400 text-xs">Members</span>
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="relative z-10 w-full max-w-6xl">
        <div className="relative h-[200px] md:h-[260px] lg:h-[300px] flex items-center justify-center overflow-hidden">
          {slots.map(({ index, offset, image }) => {
            const style = slotStyles[String(offset)];
            const isCenter = offset === 0;
            return (
              <div
                key={`${index}-${offset}`}
                onClick={() => !isCenter && goTo(index)}
                style={{
                  position: "absolute",
                  width: cardWidth,
                  aspectRatio: "16/9",
                  borderRadius: "10px",
                  overflow: "hidden",
                  transition: "transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.45s ease, filter 0.45s ease",
                  cursor: !isCenter ? "pointer" : "default",
                  border: isCenter ? "1.5px solid rgba(139,92,246,0.5)" : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: isCenter ? "0 0 40px rgba(124,58,237,0.25), 0 8px 32px rgba(0,0,0,0.5)" : "0 4px 16px rgba(0,0,0,0.3)",
                  ...style,
                }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  draggable={false}
                />
                {!isCenter && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(11,15,26,0.35)", borderRadius: "10px" }} />
                )}
                {isCenter && (
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(11,15,26,0.55) 0%, transparent 60%)" }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Nav Arrows */}
        <button
          onClick={prev}
          className="absolute left-1 md:left-0 top-1/2 -translate-y-1/2 md:-translate-x-2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/10 transition"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          onClick={next}
          className="absolute right-1 md:right-0 top-1/2 -translate-y-1/2 md:translate-x-2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/10 transition"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Dots */}
      <div className="relative z-10 flex items-center gap-2 mt-6">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === activeIndex ? "24px" : "6px",
              height: "6px",
              background:
                i === activeIndex
                  ? "linear-gradient(90deg, #a78bfa, #60a5fa)"
                  : "rgba(255,255,255,0.2)",
            }}
          />
        ))}
      </div>

      {/* CTA Button */}
      <div className="relative z-10 mt-12 text-center px-4">
        <button
          className="relative px-8 md:px-10 py-3 md:py-4 rounded-xl text-white font-semibold text-sm md:text-base overflow-hidden group transition-all duration-300"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #2563eb)",
            boxShadow: "0 0 30px rgba(124,58,237,0.35), 0 4px 20px rgba(37,99,235,0.2)",
            fontFamily: "'Syne', sans-serif",
            letterSpacing: "0.01em",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 0 50px rgba(124,58,237,0.55), 0 8px 30px rgba(37,99,235,0.35)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 0 30px rgba(124,58,237,0.35), 0 4px 20px rgba(37,99,235,0.2)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)",
            }}
          />
          <span className="relative z-10 flex items-center gap-2">
            Join Our Community!!
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </button>
        <p className="mt-3 text-gray-500 text-sm">Free forever · No credit card required</p>
      </div>

    </div>
  );
}