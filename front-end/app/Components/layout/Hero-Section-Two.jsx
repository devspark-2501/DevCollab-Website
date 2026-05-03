'use client'

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

function TimeAgo({ date }) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60)    return <span>{diff}s ago</span>;
  if (diff < 3600)  return <span>{Math.floor(diff / 60)}m ago</span>;
  if (diff < 86400) return <span>{Math.floor(diff / 3600)}h ago</span>;
  return <span>{new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>;
}

const COLORS = [
  "bg-[#1d2b5c] text-[#8ba4f5] border-[#2a3a7a]",
  "bg-[#1a2e1a] text-[#4ade80] border-[#2a4a2a]",
  "bg-[#2e1a2e] text-[#c084fc] border-[#4a2a4a]",
  "bg-[#2e1a1a] text-[#f87171] border-[#4a2a2a]",
  "bg-[#1a2a2e] text-[#38bdf8] border-[#2a3a4a]",
  "bg-[#2e2a1a] text-[#fbbf24] border-[#4a3a2a]",
];
function getColor(name = "") { return COLORS[name.charCodeAt(0) % COLORS.length]; }

const Icon = ({ size = 14, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

// ── Comment Modal ────────────────────────────────────────────────────────────
function CommentModal({ post: initialPost, onClose, userEmail, userName }) {
  const [post, setPost]             = useState(initialPost);
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting]       = useState(false);
  const [error, setError]           = useState("");
  const comments = post.comments || [];

  async function handleSubmit() {
    const text = commentText.trim();
    if (!text || !userEmail) return;
    setPosting(true); setError("");
    try {
      const res  = await fetch("/api/community/post/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post._id, userEmail, userName, text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setPost((p) => ({ ...p, comments: [...(p.comments || []), data.comment] }));
      setCommentText("");
    } catch (e) { setError(e.message); }
    finally { setPosting(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
         onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-lg bg-[#13161f] border border-[#1e2029] rounded-2xl shadow-2xl
                      flex flex-col max-h-[80vh]">

        {/* header */}
        <div className="flex items-start justify-between gap-3 p-5 border-b border-[#1e2029]">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center
                            text-[13px] font-bold shrink-0 ${getColor(post.userName || "")}`}>
              {post.userName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[13.5px] font-semibold text-[#ebedf5]">{post.userName}</p>
              <p className="text-[10.5px] text-[#3f4357] mt-0.5"><TimeAgo date={post.createdAt} /></p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md border border-[#1e2029]
                       text-[#3a3d4a] hover:bg-[#161820] hover:text-[#e05a5a] transition-colors shrink-0">
            <Icon size={12}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Icon>
          </button>
        </div>

        {/* post body */}
        <div className="px-5 py-4 border-b border-[#1e2029]">
          <p className="text-[13.5px] text-[#8a8fa8] leading-relaxed whitespace-pre-wrap">
            {post.userContent}
          </p>
        </div>

        {/* comments list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 min-h-0">
          {comments.length === 0 && (
            <p className="text-[12px] text-[#2e3244] text-center py-6">
              No replies yet. Be the first!
            </p>
          )}
          {comments.map((c) => (
            <div key={c._id} className="flex gap-2.5">
              <div className={`w-7 h-7 rounded-xl border flex items-center justify-center
                               text-[11px] font-bold shrink-0 mt-0.5 ${getColor(c.userName || "")}`}>
                {c.userName?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 bg-[#0d0f14] border border-[#1e2029] rounded-xl px-3.5 py-2.5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[12px] font-semibold text-[#c8cad4]">{c.userName}</span>
                  <span className="text-[10px] text-[#2e3244]"><TimeAgo date={c.createdAt} /></span>
                </div>
                <p className="text-[12.5px] text-[#7a7f96] leading-relaxed whitespace-pre-wrap">
                  {c.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* comment input */}
        <div className="p-4 border-t border-[#1e2029]">
          {userEmail ? (
            <>
              <div className="flex gap-2.5 items-start">
                <div className={`w-7 h-7 rounded-xl border flex items-center justify-center
                                 text-[11px] font-bold shrink-0 mt-1 ${getColor(userName || "")}`}>
                  {userName?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault(); handleSubmit();
                      }
                    }}
                    placeholder="Write a reply… (Enter to post)"
                    rows={2}
                    maxLength={300}
                    className="w-full bg-[#0d0f14] border border-[#1e2029] rounded-xl
                               px-3.5 py-2.5 text-[12.5px] text-[#c8cad4]
                               placeholder-[#2e3244] resize-none
                               focus:outline-none focus:border-[#2a3a7a] transition-colors"
                  />
                  {error && <p className="text-[11px] text-red-400 mt-1">{error}</p>}
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] text-[#2e3244]">{commentText.length}/300</span>
                    <button
                      onClick={handleSubmit}
                      disabled={posting || !commentText.trim()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11.5px]
                                 font-medium bg-[#1d2b5c] border border-[#2a3a7a] text-[#8ba4f5]
                                 hover:bg-[#22336e] transition-colors
                                 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {posting
                        ? <svg className="animate-spin" width="11" height="11" viewBox="0 0 24 24"
                               fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                          </svg>
                        : <Icon size={11}>
                            <line x1="22" y1="2" x2="11" y2="13"/>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                          </Icon>
                      }
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-[12px] text-[#3a4470] text-center py-2">
              <a href="/login" className="text-[#8ba4f5] hover:underline">Sign in</a> to reply
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Post Card ────────────────────────────────────────────────────────────────
function PostCard({ post: initialPost, userEmail, userName }) {
  const [post, setPost]         = useState(initialPost);
  const [liked, setLiked]       = useState(
    () => initialPost.likedBy?.includes(userEmail) ?? false
  );
  const [modalOpen, setModalOpen] = useState(false);

  // syncs if parent re-renders with fresh data
  useEffect(() => {
    setPost(initialPost);
    setLiked(initialPost.likedBy?.includes(userEmail) ?? false);
  }, [initialPost, userEmail]);

  async function handleLike() {
    if (!userEmail) {
      window.location.href = "/login";
      return;
    }
    const wasLiked = liked;
    // optimistic
    setLiked(!wasLiked);
    setPost((p) => ({ ...p, likes: wasLiked ? p.likes - 1 : p.likes + 1 }));

    try {
      const res  = await fetch("/api/community/post/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post._id, userEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      // sync real DB values
      setPost((p) => ({ ...p, likes: data.likes, likedBy: data.likedBy }));
      setLiked(data.likedBy.includes(userEmail));
    } catch {
      // revert
      setLiked(wasLiked);
      setPost((p) => ({ ...p, likes: wasLiked ? p.likes + 1 : p.likes - 1 }));
    }
  }

  const colorCls   = getColor(post.userName || "");
  const initial    = post.userName?.charAt(0).toUpperCase() || "?";
  const commentCount = (post.comments || []).length;

  return (
    <>
      <div className="bg-[#13161f] border border-[#1e2029] rounded-2xl p-5 flex flex-col
                      hover:border-[#2a3060] hover:bg-[#14172a] transition-colors
                      w-[300px] sm:w-[340px] shrink-0 h-full">

        {/* header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center
                            text-[13px] font-semibold shrink-0 ${colorCls}`}>
              {initial}
            </div>
            <div>
              <p className="text-[13.5px] font-semibold text-[#ebedf5] leading-none">{post.userName}</p>
              <p className="text-[10.5px] text-[#3f4357] mt-0.5"><TimeAgo date={post.createdAt} /></p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full shrink-0
                           bg-[#1d2b5c]/60 text-[#8ba4f5] border border-[#2a3a7a]/50">Post</span>
        </div>

        <div className="border-t border-[#191b24] mb-4" />

        {/* body */}
        <p className="text-[13.5px] text-[#8a8fa8] leading-relaxed whitespace-pre-wrap
                      break-words flex-1 overflow-hidden"
           style={{ display: "-webkit-box", WebkitLineClamp: 6,
                    WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {post.userContent}
        </p>

        {/* footer */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#191b24]">
          {/* Like — real, persisted */}
          <button onClick={handleLike}
            className={`flex items-center gap-1.5 text-[11.5px] transition-all
              ${liked ? "text-[#8ba4f5]" : "text-[#3a4470] hover:text-[#8ba4f5]"}`}>
            <svg width="13" height="13" viewBox="0 0 24 24"
                 fill={liked ? "currentColor" : "none"}
                 stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {post.likes}
          </button>

          {/* Reply — opens modal */}
          <button onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 text-[11.5px] text-[#3a4470] hover:text-[#8ba4f5] transition-colors">
            <Icon size={13}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </Icon>
            {commentCount > 0 ? commentCount : "Reply"}
          </button>

          <span className="text-[10px] text-[#2e3244] ml-auto">
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Comment modal — rendered outside the card so it escapes the scroll container */}
      {modalOpen && (
        <CommentModal
          post={post}
          onClose={() => setModalOpen(false)}
          userEmail={userEmail}
          userName={userName}
        />
      )}
    </>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-[#13161f] border border-[#1e2029] rounded-2xl p-5
                    w-[300px] sm:w-[340px] shrink-0 animate-pulse">
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
        <div className="h-2.5 bg-[#1e2029] rounded w-2/3" />
      </div>
    </div>
  );
}

// ── Main Section ─────────────────────────────────────────────────────────────
export default function Hero_Section_Two() {
  const { data: session }                   = useSession();
  const [posts, setPosts]                   = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState("");
  const [headerVisible, setHeaderVisible]   = useState(false);
  const [canScrollLeft, setCanScrollLeft]   = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging]         = useState(false);
  const [dragStart, setDragStart]           = useState(0);
  const [scrollStart, setScrollStart]       = useState(0);

  const headerRef = useRef(null);
  const scrollRef = useRef(null);

  const userEmail = session?.user?.email ?? null;
  const userName  = session?.user?.name  ?? null;

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setHeaderVisible(true); },
      { threshold: 0.2 }
    );
    if (headerRef.current) obs.observe(headerRef.current);
    return () => obs.disconnect();
  }, []);

  // fetch posts — re-fetch when userEmail is available so likedBy is applied correctly
  useEffect(() => {
    fetch("/api/community/post")
      .then((r) => r.json())
      .then((d) => setPosts(d.posts || []))
      .catch(() => setError("Failed to load posts."))
      .finally(() => setLoading(false));
  }, []); // fetch once; liked state is derived from likedBy inside PostCard

  function updateArrows() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [posts, loading]);

  function scrollBy(dir) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (340 + 16) * 2, behavior: "smooth" });
  }

  function onMouseDown(e) {
    setIsDragging(true);
    setDragStart(e.pageX);
    setScrollStart(scrollRef.current.scrollLeft);
    scrollRef.current.style.cursor = "grabbing";
  }
  function onMouseMove(e) {
    if (!isDragging) return;
    scrollRef.current.scrollLeft = scrollStart - (e.pageX - dragStart);
  }
  function onMouseUp() {
    setIsDragging(false);
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  }

  return (
    <section className="relative min-h-screen bg-[#0b0f1a] overflow-hidden">
      <div className="absolute top-[-80px] right-[-80px] w-[420px] h-[420px] bg-blue-500 opacity-[0.07] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-[-80px] w-[400px] h-[400px] bg-purple-600 opacity-[0.07] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative z-10 py-20">

        {/* header */}
        <div ref={headerRef} style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }} className="text-center mb-14 px-4 sm:px-8">
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
            Community <span className="text-[#8ba4f5]">Discussions</span>
          </h2>
          <p className="text-[14px] sm:text-[15px] text-[#5a5f72] leading-relaxed max-w-xl mx-auto">
            Real thoughts from real builders. See what the community is talking about right now.
          </p>
          {!loading && posts.length > 0 && (
            <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
              {[
                { val: posts.length, label: "Posts" },
                { val: [...new Set(posts.map((p) => p.userEmail))].length, label: "Contributors" },
                { val: posts.reduce((s, p) => s + (p.likes || 0), 0), label: "Likes" },
              ].map((s) => (
                <div key={s.label} className="px-4 py-2 rounded-xl bg-[#13161f] border border-[#1e2029]">
                  <span className="text-[16px] font-semibold text-[#ebedf5] font-mono">{s.val}</span>
                  <span className="text-[10px] text-[#2e3244] uppercase tracking-wider ml-2">{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-[#1e2029] mb-10 mx-4 sm:mx-8" />

        {error && (
          <div className="mx-4 sm:mx-8 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20
                          text-red-400 text-[13px] text-center mb-6">{error}</div>
        )}

        {!loading && posts.length > 0 && (
          <div className="flex items-center justify-between px-4 sm:px-8 mb-4">
            <p className="text-[11px] text-[#3a4470] select-none">
              {posts.length} post{posts.length !== 1 ? "s" : ""} · drag or use arrows to browse
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => scrollBy(-1)} disabled={!canScrollLeft}
                className="w-8 h-8 rounded-full bg-[#13161f] border border-[#1e2029] flex items-center justify-center
                           text-[#3a4470] hover:border-[#2a3a7a] hover:text-[#8ba4f5]
                           disabled:opacity-25 disabled:cursor-not-allowed transition-all">
                <Icon size={14}><polyline points="15 18 9 12 15 6"/></Icon>
              </button>
              <button onClick={() => scrollBy(1)} disabled={!canScrollRight}
                className="w-8 h-8 rounded-full bg-[#13161f] border border-[#1e2029] flex items-center justify-center
                           text-[#3a4470] hover:border-[#2a3a7a] hover:text-[#8ba4f5]
                           disabled:opacity-25 disabled:cursor-not-allowed transition-all">
                <Icon size={14}><polyline points="9 18 15 12 9 6"/></Icon>
              </button>
            </div>
          </div>
        )}

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
               style={{ background: "linear-gradient(to right, #0b0f1a, transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
               style={{ background: "linear-gradient(to left, #0b0f1a, transparent)" }} />

          {loading && (
            <div className="flex gap-4 overflow-hidden px-4 sm:px-8">
              {[1,2,3,4].map((n) => <SkeletonCard key={n} />)}
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="text-center py-20 px-4">
              <div className="w-14 h-14 rounded-full bg-[#13161f] border border-[#1e2029]
                              flex items-center justify-center mx-auto mb-4 text-[#3a4470]">
                <Icon size={22}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></Icon>
              </div>
              <p className="text-[14px] font-medium text-[#4a4f62] mb-1">No discussions yet</p>
              <p className="text-[12px] text-[#2e3244]">Be the first to post something.</p>
            </div>
          )}

          {!loading && posts.length > 0 && (
            <div ref={scrollRef}
              onMouseDown={onMouseDown} onMouseMove={onMouseMove}
              onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
              className="flex gap-4 overflow-x-auto pb-4 px-4 sm:px-8 select-none"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none", cursor: "grab" }}>
              <style>{`div::-webkit-scrollbar{display:none}`}</style>
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  userEmail={userEmail}
                  userName={userName}
                />
              ))}
              <div className="shrink-0 w-4" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}