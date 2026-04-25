'use client'

import { useState, useEffect, useRef } from "react";

function TimeAgo({ date }) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return <span>{diff}s ago</span>;
  if (diff < 3600) return <span>{Math.floor(diff / 60)}m ago</span>;
  if (diff < 86400) return <span>{Math.floor(diff / 3600)}h ago</span>;
  return <span>{Math.floor(diff / 86400)}d ago</span>;
}

const COLORS = [
  "bg-[#1d2b5c] text-[#8ba4f5] border-[#2a3a7a]",
  "bg-[#1a2e1a] text-[#4ade80] border-[#2a4a2a]",
  "bg-[#2e1a2e] text-[#c084fc] border-[#4a2a4a]",
  "bg-[#2e1a1a] text-[#f87171] border-[#4a2a2a]",
  "bg-[#1a2a2e] text-[#38bdf8] border-[#2a3a4a]",
  "bg-[#2e2a1a] text-[#fbbf24] border-[#4a3a2a]",
];

function getColor(name = "") {
  const i = name.charCodeAt(0) % COLORS.length;
  return COLORS[i];
}

function PostCard({ post, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes || 0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  function handleLike() {
    if (liked) return;
    setLiked(true);
    setLikes((l) => l + 1);
  }

  const colorCls = getColor(post.userName);
  const initial  = post.userName?.charAt(0).toUpperCase() || "?";

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${(index % 5) * 60}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(28px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
      className="bg-[#13161f] border border-[#1e2029] rounded-2xl p-5
                 hover:border-[#2a3060] hover:bg-[#14172a] transition-colors group"
    >
      {/* header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center
                          text-[13px] font-semibold shrink-0 ${colorCls}`}>
            {initial}
          </div>
          <div>
            <p className="text-[13.5px] font-semibold text-[#ebedf5] leading-none">
              {post.userName}
            </p>
            <p className="text-[10.5px] text-[#3f4357] mt-0.5">
              <TimeAgo date={post.createdAt} />
            </p>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full shrink-0
                         bg-[#1d2b5c]/60 text-[#8ba4f5] border border-[#2a3a7a]/50">
          Post
        </span>
      </div>

      {/* divider */}
      <div className="border-t border-[#191b24] mb-4" />

      {/* body */}
      <p className="text-[13.5px] text-[#8a8fa8] leading-relaxed whitespace-pre-wrap break-words">
        {post.userContent}
      </p>

      {/* footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#191b24]">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-[11.5px] transition-all
            ${liked ? "text-[#8ba4f5] scale-110" : "text-[#3a4470] hover:text-[#8ba4f5]"}`}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"}
               stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          {likes}
        </button>
        <span className="text-[10px] text-[#2e3244]">
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-[#13161f] border border-[#1e2029] rounded-2xl p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-[#1e2029] shrink-0" />
        <div className="space-y-1.5 flex-1">
          <div className="h-2.5 bg-[#1e2029] rounded w-1/3" />
          <div className="h-2 bg-[#1e2029] rounded w-1/5" />
        </div>
      </div>
      <div className="border-t border-[#191b24] mb-4" />
      <div className="space-y-2">
        <div className="h-2.5 bg-[#1e2029] rounded w-full" />
        <div className="h-2.5 bg-[#1e2029] rounded w-5/6" />
        <div className="h-2.5 bg-[#1e2029] rounded w-3/4" />
      </div>
    </div>
  );
}

export default function Hero_Section_Two() {
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const headerRef             = useRef(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setHeaderVisible(true); },
      { threshold: 0.2 }
    );
    if (headerRef.current) obs.observe(headerRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    fetch("/api/community/post")
      .then((r) => r.json())
      .then((d) => setPosts(d.posts || []))
      .catch(() => setError("Failed to load posts."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="relative min-h-screen bg-[#0b0f1a] overflow-hidden">

      {/* ── background glows ── */}
      <div className="absolute top-[-80px] right-[-80px] w-[420px] h-[420px] bg-blue-500 opacity-[0.07] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-[-80px] w-[400px] h-[400px] bg-purple-600 opacity-[0.07] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600 opacity-[0.04] blur-[140px] rounded-full pointer-events-none" />

      {/* ── grid ── */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 py-20">

        {/* ── header ── */}
        <div
          ref={headerRef}
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="inline-block px-3 py-1 text-[11px] rounded-full
                             bg-[#1d2b5c]/60 text-[#8ba4f5] border border-[#2a3a7a]/50 tracking-wide">
              DevCollab Community
            </span>
            <span className="inline-block px-3 py-1 text-[11px] rounded-full
                             bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ● Live
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#ebedf5] tracking-tight leading-tight mb-4">
            Community{" "}
            <span className="text-[#8ba4f5]">Discussions</span>
          </h2>

          <p className="text-[14px] sm:text-[15px] text-[#5a5f72] leading-relaxed max-w-xl mx-auto">
            Real thoughts from real builders. See what the community is talking about right now.
          </p>

          {/* live stat pills */}
          {!loading && (
            <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
              <div className="px-4 py-2 rounded-xl bg-[#13161f] border border-[#1e2029] text-center">
                <span className="text-[16px] font-semibold text-[#ebedf5] font-mono">{posts.length}</span>
                <span className="text-[10px] text-[#2e3244] uppercase tracking-wider ml-2">Posts</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-[#13161f] border border-[#1e2029] text-center">
                <span className="text-[16px] font-semibold text-[#ebedf5] font-mono">
                  {[...new Set(posts.map((p) => p.userEmail))].length}
                </span>
                <span className="text-[10px] text-[#2e3244] uppercase tracking-wider ml-2">Contributors</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-[#13161f] border border-[#1e2029] text-center">
                <span className="text-[16px] font-semibold text-[#ebedf5] font-mono">
                  {posts.reduce((s, p) => s + (p.likes || 0), 0)}
                </span>
                <span className="text-[10px] text-[#2e3244] uppercase tracking-wider ml-2">Likes</span>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-[#1e2029] mb-10" />

        {/* ── error ── */}
        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20
                          text-red-400 text-[13px] text-center mb-6">
            {error}
          </div>
        )}

        {/* ── loading skeletons ── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1,2,3,4,5,6].map((n) => <SkeletonCard key={n} />)}
          </div>
        )}

        {/* ── empty state ── */}
        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-14 h-14 rounded-full bg-[#13161f] border border-[#1e2029]
                            flex items-center justify-center mx-auto mb-4 text-[#3a4470]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <p className="text-[14px] font-medium text-[#4a4f62] mb-1">No discussions yet</p>
            <p className="text-[12px] text-[#2e3244]">Be the first to post something.</p>
          </div>
        )}

        {/* ── posts grid ── */}
        {!loading && posts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {posts.map((post, i) => (
              <PostCard key={post._id} post={post} index={i} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}