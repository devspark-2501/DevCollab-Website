'use client'

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const NAV = [
  { id: "home",    label: "Home",    href: "/",        icon: <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/> },
  { id: "feed",    label: "Feed",    href: "/Feed",    icon: <><path d="M4 6h16M4 12h16M4 18h16"/></> },
  { id: "people",  label: "People",  href: null,       icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></> },
  { id: "code",    label: "Code",    href: null,       icon: <><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></> },
  { id: "profile", label: "Profile", href: "/Profile", icon: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></> },
];

const COLORS = [
  "bg-[#1d2b5c] text-[#8ba4f5] border-[#2a3a7a]",
  "bg-[#1a2e1a] text-[#4ade80] border-[#2a4a2a]",
  "bg-[#2e1a2e] text-[#c084fc] border-[#4a2a4a]",
  "bg-[#2e1a1a] text-[#f87171] border-[#4a2a2a]",
  "bg-[#1a2a2e] text-[#38bdf8] border-[#2a3a4a]",
  "bg-[#2e2a1a] text-[#fbbf24] border-[#4a3a2a]",
];
function getColor(name = "") { return COLORS[name.charCodeAt(0) % COLORS.length]; }

const Icon = ({ size = 17, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

function TimeAgo({ date }) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60)    return <span>{diff}s ago</span>;
  if (diff < 3600)  return <span>{Math.floor(diff / 60)}m ago</span>;
  if (diff < 86400) return <span>{Math.floor(diff / 3600)}h ago</span>;
  return <span>{new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>;
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ expanded, onToggle, active, mobileOpen, onMobileClose }) {
  const { data: session } = useSession();
  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-20 bg-black/60 md:hidden" onClick={onMobileClose} />
      )}
      <aside className={`
        flex flex-col bg-[#0d0f14] border-r border-[#1e2029] p-3 transition-all duration-300
        fixed inset-y-0 left-0 z-30 md:relative md:z-auto shrink-0
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${expanded ? "w-[220px]" : "w-[60px]"}
      `}>
        <div className={`flex items-center mb-6 ${expanded ? "justify-between" : "justify-center"}`}>
          {expanded && (
            <span className="text-[11px] font-semibold tracking-widest uppercase text-[#3a3d4a] px-2">
              DevCollab
            </span>
          )}
          <button onClick={onToggle}
            className="w-7 h-7 flex items-center justify-center rounded-md border border-[#1e2029]
                       text-[#3a3d4a] hover:bg-[#161820] hover:text-[#8ba4f5] transition-colors">
            <Icon size={11}>
              {expanded ? <polyline points="15 18 9 12 15 6"/> : <polyline points="9 18 15 12 9 6"/>}
            </Icon>
          </button>
        </div>
        <nav className="flex-1 flex flex-col gap-0.5">
          {NAV.map(({ id, label, href, icon }) => {
            const isActive = active === id;
            const cls = `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] font-normal
                         border transition-all no-underline cursor-pointer
                         ${expanded ? "" : "justify-center"}
                         ${isActive
                           ? "bg-[#161c2e] text-[#8ba4f5] border-[#1e2a4a] font-medium"
                           : "text-[#5a5f72] border-transparent hover:bg-[#161820] hover:text-[#c8cad4]"}`;
            const content = <><Icon>{icon}</Icon>{expanded && <span>{label}</span>}</>;
            return href
              ? <Link key={id} href={href} className={cls} onClick={onMobileClose}>{content}</Link>
              : <div key={id} className={cls} onClick={onMobileClose}>{content}</div>;
          })}
        </nav>
        {expanded && session?.user && (
          <div className="mb-3 px-2 py-2.5 rounded-xl bg-[#13161f] border border-[#1e2029]">
            <div className="flex items-center gap-2.5">
              {session.user.image
                ? <img src={session.user.image} alt="av"
                       className="w-7 h-7 rounded-full border border-[#2a2e3e] object-cover shrink-0"/>
                : <div className={`w-7 h-7 rounded-full border flex items-center justify-center
                                   text-[11px] font-semibold shrink-0 ${getColor(session.user.username || session.user.name || "")}`}>
                    {(session.user.username || session.user.name)?.charAt(0).toUpperCase()}
                  </div>
              }
              <div className="min-w-0">
                <p className="text-[12px] font-medium text-[#c8cad4] truncate leading-none font-mono">
                  @{session.user.username || session.user.name}
                </p>
                <p className="text-[10px] text-[#3f4357] truncate mt-0.5">{session.user.email}</p>
              </div>
            </div>
          </div>
        )}
        <hr className="border-[#1a1c23] my-2" />
        <button onClick={() => signOut({ callbackUrl: "/login" })}
          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px]
                      text-[#5a3a3a] border border-transparent
                      hover:bg-[#1c1414] hover:text-[#e05a5a] hover:border-[#2a1818]
                      transition-all ${expanded ? "" : "justify-center"}`}>
          <Icon size={15}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </Icon>
          {expanded && <span>Sign out</span>}
        </button>
      </aside>
    </>
  );
}

function SkeletonPost() {
  return (
    <div className="bg-[#13161f] border border-[#1e2029] rounded-2xl overflow-hidden animate-pulse">
      <div className="h-48 bg-[#1e2029]" />
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#1e2029] shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-2.5 bg-[#1e2029] rounded w-1/4" />
            <div className="h-2 bg-[#1e2029] rounded w-1/6" />
          </div>
        </div>
        <div className="space-y-2.5">
          <div className="h-2.5 bg-[#1e2029] rounded w-full" />
          <div className="h-2.5 bg-[#1e2029] rounded w-5/6" />
        </div>
      </div>
    </div>
  );
}

// ─── POST CARD ────────────────────────────────────────────────────────────────
function PostCard({ post: initialPost, animate, userEmail, userName }) {
  const [post, setPost]                     = useState(initialPost);
  const [liked, setLiked]                   = useState(
    () => initialPost.likedBy?.includes(userEmail) ?? false
  );
  const [showComments, setShowComments]     = useState(false);
  const [commentText, setCommentText]       = useState("");
  const [commentPosting, setCommentPosting] = useState(false);
  const [commentError, setCommentError]     = useState("");
  const [lightbox, setLightbox]             = useState(false);
  const [visible, setVisible]               = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  async function handleLike() {
    const wasLiked = liked;
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
      setPost((p) => ({ ...p, likes: data.likes, likedBy: data.likedBy }));
      setLiked(data.likedBy.includes(userEmail));
    } catch {
      setLiked(wasLiked);
      setPost((p) => ({ ...p, likes: wasLiked ? p.likes + 1 : p.likes - 1 }));
    }
  }

  async function handleComment() {
    const text = commentText.trim();
    if (!text) return;
    setCommentPosting(true);
    setCommentError("");
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
    } catch (e) {
      setCommentError(e.message);
    } finally {
      setCommentPosting(false);
    }
  }

  const colorCls = getColor(post.userName || "");
  const initial  = post.userName?.charAt(0).toUpperCase() || "?";
  const comments = post.comments || [];

  return (
    <>
      <div
        ref={ref}
        style={{
          opacity:    animate ? (visible ? 1 : 0) : 1,
          transform:  animate ? (visible ? "translateY(0)" : "translateY(20px)") : "none",
          transition: "opacity 0.45s ease, transform 0.45s ease",
        }}
        className="bg-[#13161f] border border-[#1e2029] rounded-2xl overflow-hidden
                   hover:border-[#2a3060] transition-colors"
      >
        {/* ══ IMAGE — rendered first, full bleed, before all text ══ */}
        {post.image && (
          <div
            className="w-full cursor-zoom-in overflow-hidden relative group"
            onClick={() => setLightbox(true)}
          >
            <img
              src={post.image}
              alt={post.imageName || "post image"}
              loading="lazy"
              className="w-full max-h-[460px] object-cover block"
              onError={(e) => { e.target.style.display = "none"; }}
            />
            {/* zoom hint */}
            <div className="absolute inset-0 flex items-center justify-center
                            opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
              <div className="w-9 h-9 rounded-full bg-black/50 border border-white/20
                              flex items-center justify-center text-white">
                <Icon size={14}>
                  <polyline points="15 3 21 3 21 9"/>
                  <polyline points="9 21 3 21 3 15"/>
                  <line x1="21" y1="3" x2="14" y2="10"/>
                  <line x1="3" y1="21" x2="10" y2="14"/>
                </Icon>
              </div>
            </div>
          </div>
        )}

        <div className="p-5">
          {/* header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center
                              text-[13px] font-bold shrink-0 ${colorCls}`}>
                {initial}
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#ebedf5] leading-none font-mono">
                  @{post.userName}
                </p>
                <p className="text-[10.5px] text-[#3f4357] mt-0.5">
                  <TimeAgo date={post.createdAt} />
                  <span className="mx-1.5 opacity-30">·</span>
                  <span className="text-[#2e3244]">{post.userEmail}</span>
                </p>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full shrink-0 mt-0.5
                             bg-[#1d2b5c]/60 text-[#8ba4f5] border border-[#2a3a7a]/50">
              {post.image && !post.userContent ? "Photo" : "Post"}
            </span>
          </div>

          {/* ══ TEXT — only rendered if it exists ══ */}
          {post.userContent && post.userContent.trim() !== "" && (
            <p className="text-[14px] text-[#9094a8] leading-relaxed
                          whitespace-pre-wrap break-words mb-3">
              {post.userContent}
            </p>
          )}

          {/* footer */}
          <div className="flex items-center gap-5 pt-3 border-t border-[#191b24]">
            <button onClick={handleLike}
              className={`flex items-center gap-1.5 text-[12px] transition-all
                ${liked ? "text-[#8ba4f5]" : "text-[#3a4470] hover:text-[#8ba4f5]"}`}>
              <svg width="14" height="14" viewBox="0 0 24 24"
                   fill={liked ? "currentColor" : "none"}
                   stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {post.likes}
            </button>

            <button
              onClick={() => setShowComments((v) => !v)}
              className={`flex items-center gap-1.5 text-[12px] transition-colors
                ${showComments ? "text-[#8ba4f5]" : "text-[#3a4470] hover:text-[#8ba4f5]"}`}>
              <Icon size={14}>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </Icon>
              {comments.length > 0 ? comments.length : "Reply"}
            </button>

            <button className="flex items-center gap-1.5 text-[12px] text-[#3a4470]
                               hover:text-[#8ba4f5] transition-colors ml-auto">
              <Icon size={14}>
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </Icon>
              Share
            </button>
          </div>

          {/* comments */}
          {showComments && (
            <div className="mt-4 pt-4 border-t border-[#191b24] space-y-3">
              {comments.length === 0 && (
                <p className="text-[11.5px] text-[#2e3244] text-center py-1">
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
                      <span className="text-[12px] font-semibold text-[#c8cad4] font-mono">
                        @{c.userName}
                      </span>
                      <span className="text-[10px] text-[#2e3244]">
                        <TimeAgo date={c.createdAt} />
                      </span>
                    </div>
                    <p className="text-[12.5px] text-[#7a7f96] leading-relaxed whitespace-pre-wrap">
                      {c.text}
                    </p>
                  </div>
                </div>
              ))}

              <div className="flex gap-2.5 items-start pt-1">
                <div className={`w-7 h-7 rounded-xl border flex items-center justify-center
                                 text-[11px] font-bold shrink-0 mt-0.5 ${getColor(userName || "")}`}>
                  {userName?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault(); handleComment();
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
                  {commentError && (
                    <p className="text-[11px] text-red-400 mt-1">{commentError}</p>
                  )}
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] text-[#2e3244]">{commentText.length}/300</span>
                    <button
                      onClick={handleComment}
                      disabled={commentPosting || !commentText.trim()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11.5px]
                                 font-medium bg-[#1d2b5c] border border-[#2a3a7a] text-[#8ba4f5]
                                 hover:bg-[#22336e] transition-colors
                                 disabled:opacity-40 disabled:cursor-not-allowed">
                      {commentPosting
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
            </div>
          )}
        </div>
      </div>

      {/* ══ LIGHTBOX ══ */}
      {lightbox && post.image && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm
                     flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10
                       border border-white/20 flex items-center justify-center
                       text-white hover:bg-white/20 transition-colors z-10">
            <Icon size={15}>
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </Icon>
          </button>
          <img
            src={post.image}
            alt={post.imageName || "post"}
            className="max-w-full max-h-[90vh] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

// ─── MAIN FEED ────────────────────────────────────────────────────────────────
const PAGE_SIZE = 10;

export default function Feed() {
  const { data: session }             = useSession();
  const [expanded, setExpanded]       = useState(true);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [allPosts, setAllPosts]       = useState([]);
  const [posts, setPosts]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage]               = useState(1);
  const [hasMore, setHasMore]         = useState(true);
  const [mounted, setMounted]         = useState(false);
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [content, setContent]         = useState("");
  const [posting, setPosting]         = useState(false);
  const [postError, setPostError]     = useState("");

  // ── image state
  const [imageData, setImageData]       = useState(null);
  const [imageName, setImageName]       = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef                    = useRef(null);
  const sentinelRef                     = useRef(null);

  const userEmail = session?.user?.email;
  const userName  = session?.user?.username || session?.user?.name;

  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  useEffect(() => {
    if (!userEmail) return;
    fetch("/api/community/post")
      .then((r) => r.json())
      .then((d) => {
        const all = d.posts || [];
        setAllPosts(all);
        setPosts(all.slice(0, PAGE_SIZE));
        setHasMore(all.length > PAGE_SIZE);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userEmail]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && hasMore && !loadingMore) loadMore();
    }, { threshold: 0.1 });
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [hasMore, loadingMore, allPosts, page]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      const next  = page + 1;
      const slice = allPosts.slice(0, next * PAGE_SIZE);
      setPosts(slice);
      setPage(next);
      setHasMore(slice.length < allPosts.length);
      setLoadingMore(false);
    }, 600);
  }, [page, allPosts, hasMore, loadingMore]);

  function handleImageSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) { setPostError("Image must be under 4 MB."); return; }
    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageData(ev.target.result);
      setImagePreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  }

  function removeImage() {
    setImageData(null); setImageName(""); setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function closeModal() {
    setNewPostOpen(false); setContent(""); setPostError(""); removeImage();
  }

  async function handlePost() {
    if (!content.trim() && !imageData) return setPostError("Write something or add an image.");
    setPosting(true); setPostError("");
    try {
      const res  = await fetch("/api/community/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userContent: content, image: imageData, imageName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setAllPosts((prev) => [data.post, ...prev]);
      setPosts((prev)    => [data.post, ...prev]);
      closeModal();
    } catch (e) { setPostError(e.message); }
    finally { setPosting(false); }
  }

  const fadeIn = `transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`;

  return (
    <div className="flex min-h-screen bg-[#0b0f1a] text-[#e2e4ec]">
      <Sidebar expanded={expanded} onToggle={() => setExpanded(v => !v)}
               active="feed" mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <div className="flex-1 min-w-0 overflow-y-auto relative">
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-500 opacity-[0.04] blur-[140px] rounded-full pointer-events-none" />
        <div className="fixed bottom-0 left-[30%] w-[400px] h-[400px] bg-purple-600 opacity-[0.04] blur-[120px] rounded-full pointer-events-none" />
        <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        <div className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3
                        bg-[#0b0f1a]/80 backdrop-blur border-b border-[#1e2029] md:hidden">
          <button onClick={() => setMobileOpen(true)}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-[#1e2029]
                       text-[#3a3d4a] hover:bg-[#161820] hover:text-[#8ba4f5] transition-colors">
            <Icon size={14}>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </Icon>
          </button>
          <span className="text-[13px] font-medium text-[#8ba4f5]">Feed</span>
        </div>

        <div className="sticky top-0 z-10 hidden md:flex items-center justify-between
                        px-6 py-3 bg-[#0b0f1a]/80 backdrop-blur border-b border-[#1e2029]">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-[#ebedf5]">Feed</span>
            {!loading && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#1d2b5c]/60
                               text-[#8ba4f5] border border-[#2a3a7a]/50">
                {allPosts.length} posts
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10
                             text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              Live
            </span>
          </div>
          <button onClick={() => setNewPostOpen(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[12px] font-medium
                       bg-[#1d2b5c] border border-[#2a3a7a] text-[#8ba4f5]
                       hover:bg-[#22336e] transition-colors">
            <Icon size={11}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Icon>
            New Post
          </button>
        </div>

        <div className={`relative z-10 max-w-[680px] mx-auto px-4 sm:px-6 py-8 ${fadeIn}`}>

          {session && (
            <div onClick={() => setNewPostOpen(true)}
              className="bg-[#13161f] border border-[#1e2029] rounded-2xl p-4 mb-6
                         hover:border-[#2a3060] transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                {session.user?.image
                  ? <img src={session.user.image} alt="av"
                         className="w-9 h-9 rounded-full border border-[#2a2e3e] object-cover shrink-0"/>
                  : <div className={`w-9 h-9 rounded-xl border flex items-center justify-center
                                     text-[13px] font-bold shrink-0 ${getColor(session.user?.username || session.user?.name || "")}`}>
                      {(session.user?.username || session.user?.name)?.charAt(0).toUpperCase()}
                    </div>
                }
                <p className="text-[13.5px] text-[#3f4357] group-hover:text-[#5a5f72] transition-colors flex-1">
                  What's on your mind, @{session.user?.username || session.user?.name?.split(" ")[0]}?
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-7 h-7 rounded-lg bg-[#13161f] border border-[#1e2029]
                                  flex items-center justify-center text-[#3a4470]">
                    <Icon size={12}>
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </Icon>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-[#1d2b5c] border border-[#2a3a7a]
                                  flex items-center justify-center text-[#8ba4f5]">
                    <Icon size={12}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Icon>
                  </div>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="space-y-4">{[1,2,3,4,5].map((n) => <SkeletonPost key={n} />)}</div>
          )}

          {!loading && allPosts.length === 0 && (
            <div className="text-center py-24">
              <div className="w-14 h-14 rounded-full bg-[#13161f] border border-[#1e2029]
                              flex items-center justify-center mx-auto mb-4 text-[#3a4470]">
                <Icon size={22}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></Icon>
              </div>
              <p className="text-[15px] font-medium text-[#4a4f62] mb-1">Nothing here yet</p>
              <p className="text-[12px] text-[#2e3244]">Be the first to post something.</p>
            </div>
          )}

          {!loading && (
            <div className="space-y-4">
              {posts.map((post, i) => (
                <PostCard
                  key={post._id}
                  post={post}
                  animate={i >= PAGE_SIZE}
                  userEmail={userEmail}
                  userName={userName}
                />
              ))}
            </div>
          )}

          <div ref={sentinelRef} className="h-8 mt-4" />

          {loadingMore && (
            <div className="flex justify-center py-6">
              <div className="flex items-center gap-2 text-[12px] text-[#3a4470]">
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24"
                     fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                Loading more posts…
              </div>
            </div>
          )}

          {!loading && !hasMore && allPosts.length > 0 && (
            <div className="text-center py-10">
              <div className="w-8 h-0.5 bg-[#1e2029] mx-auto mb-3 rounded" />
              <p className="text-[11px] text-[#2e3244]">You've reached the end of the feed</p>
            </div>
          )}
        </div>
      </div>

      {/* ══ CREATE POST MODAL ══ */}
      {newPostOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#13161f] border border-[#1e2029] rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[15px] font-semibold text-[#ebedf5]">New Post</p>
                <p className="text-[11px] text-[#3f4357] mt-0.5">Share something with the community</p>
              </div>
              <button onClick={closeModal}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-[#1e2029]
                           text-[#3a3d4a] hover:bg-[#161820] hover:text-[#e05a5a] transition-colors">
                <Icon size={12}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Icon>
              </button>
            </div>

            <div className="border-t border-[#1e2029] mb-4" />

            {session && (
              <div className="flex items-center gap-3 mb-4 px-3 py-2.5 rounded-xl bg-[#0d0f14] border border-[#1e2029]">
                {session.user?.image
                  ? <img src={session.user.image} alt="av"
                         className="w-8 h-8 rounded-full border border-[#2a2e3e] object-cover shrink-0"/>
                  : <div className={`w-8 h-8 rounded-xl border flex items-center justify-center
                                     text-[12px] font-bold shrink-0 ${getColor(session.user?.name || "")}`}>
                      {session.user?.name?.charAt(0).toUpperCase()}
                    </div>
                }
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[#c8cad4] truncate font-mono">
                    @{session.user?.username || session.user?.name}
                  </p>
                  <p className="text-[10px] text-[#2e3244] truncate">{session.user?.email}</p>
                </div>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Public
                </span>
              </div>
            )}

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind? (optional if adding image)"
              maxLength={500}
              rows={3}
              autoFocus
              className="w-full bg-[#0d0f14] border border-[#1e2029] rounded-xl px-4 py-3
                         text-[14px] text-[#c8cad4] placeholder-[#2e3244] resize-none
                         focus:outline-none focus:border-[#2a3a7a] transition-colors mb-3"
            />

            {/* hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/gif,image/webp"
              onChange={handleImageSelect}
              className="hidden"
            />

            {/* image preview or browse */}
            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-[#1e2029] mb-4">
                <img src={imagePreview} alt="preview"
                     className="w-full max-h-[220px] object-cover block" />
                <button onClick={removeImage}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70
                             border border-white/20 flex items-center justify-center
                             text-white hover:bg-red-500/80 transition-colors">
                  <Icon size={12}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Icon>
                </button>
                <div className="px-3 py-1.5 bg-[#0d0f14]/90 border-t border-[#1e2029]">
                  <p className="text-[10.5px] text-[#3f4357] truncate">{imageName}</p>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl mb-4
                           border border-dashed border-[#1e2029] text-[12.5px] text-[#3a4470]
                           hover:border-[#2a3a7a] hover:text-[#8ba4f5] hover:bg-[#0d0f14]
                           transition-all">
                <Icon size={15}>
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </Icon>
                Browse &amp; add image
                <span className="text-[10.5px] text-[#2e3244]">PNG, JPG, GIF, WebP · max 4 MB</span>
              </button>
            )}

            <div className="flex items-center justify-between mb-5">
              {postError
                ? <p className="text-[11px] text-red-400 bg-red-500/10 border border-red-500/20
                                rounded-xl px-3 py-1.5 flex-1 mr-3">{postError}</p>
                : <span />
              }
              <p className={`text-[10.5px] ml-auto ${content.length > 450 ? "text-amber-400" : "text-[#2e3244]"}`}>
                {content.length}/500
              </p>
            </div>

            <div className="flex gap-2">
              <button onClick={closeModal}
                className="flex-1 py-2.5 rounded-lg text-[13px] font-medium border border-[#1e2029]
                           text-[#4a4f62] hover:bg-[#161820] hover:text-[#8ba4f5] transition-colors">
                Cancel
              </button>
              <button
                onClick={handlePost}
                disabled={posting || (!content.trim() && !imageData)}
                className="flex-1 py-2.5 rounded-lg text-[13px] font-medium
                           bg-[#1d2b5c] border border-[#2a3a7a] text-[#8ba4f5]
                           hover:bg-[#22336e] transition-colors
                           disabled:opacity-40 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2">
                {posting
                  ? <><svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>Posting…</>
                  : <><Icon size={13}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></Icon>Post</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}