'use client'

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

function TimeAgo({ date }) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60)    return <span>{diff}s ago</span>;
  if (diff < 3600)  return <span>{Math.floor(diff / 60)}m ago</span>;
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
function getColor(name = "") { return COLORS[name.charCodeAt(0) % COLORS.length]; }

const Icon = ({ size = 14, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export default function PostFeed({ triggerModal, onModalTriggered }) {
  const { data: session }               = useSession();
  const [posts, setPosts]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [modalOpen, setModalOpen]       = useState(false);
  const [content, setContent]           = useState("");
  const [posting, setPosting]           = useState(false);
  const [postError, setPostError]       = useState("");

  // per-post state
  const [likedPosts, setLikedPosts]         = useState(new Set());
  const [openComments, setOpenComments]     = useState({});  // postId → bool
  const [commentText, setCommentText]       = useState({});  // postId → string
  const [commentPosting, setCommentPosting] = useState({});  // postId → bool
  const [commentError, setCommentError]     = useState({});  // postId → string

  const userEmail = session?.user?.email;
  const userName  = session?.user?.name;
  const userImage = session?.user?.image;

  // load posts + seed liked state
  useEffect(() => {
    if (!userEmail) return;
    fetch("/api/community/post")
      .then((r) => r.json())
      .then((d) => {
        const all = d.posts || [];
        setPosts(all);
        setLikedPosts(new Set(
          all.filter((p) => p.likedBy?.includes(userEmail)).map((p) => p._id)
        ));
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [userEmail]);

  // allow ProfileLayout's "Add Post" button to open modal
  useEffect(() => {
    if (triggerModal) {
      setModalOpen(true);
      onModalTriggered?.();
    }
  }, [triggerModal]);

  // ── New post
  async function handleSubmit() {
    if (!content.trim()) return setPostError("Write something first.");
    setPosting(true); setPostError("");
    try {
      const res  = await fetch("/api/community/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userContent: content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setPosts((prev) => [data.post, ...prev]);
      setContent(""); setModalOpen(false);
    } catch (e) { setPostError(e.message); }
    finally { setPosting(false); }
  }

  // ── Like (persisted to DB)
  async function handleLike(postId) {
    const wasLiked = likedPosts.has(postId);
    // optimistic
    setLikedPosts((prev) => {
      const next = new Set(prev);
      wasLiked ? next.delete(postId) : next.add(postId);
      return next;
    });
    setPosts((prev) =>
      prev.map((p) => p._id === postId
        ? { ...p, likes: wasLiked ? p.likes - 1 : p.likes + 1 }
        : p)
    );
    try {
      const res  = await fetch("/api/community/post/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, userEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      // sync real DB count
      setPosts((prev) =>
        prev.map((p) => p._id === postId
          ? { ...p, likes: data.likes, likedBy: data.likedBy }
          : p)
      );
      setLikedPosts((prev) => {
        const next = new Set(prev);
        data.likedBy.includes(userEmail) ? next.add(postId) : next.delete(postId);
        return next;
      });
    } catch {
      // revert
      setLikedPosts((prev) => {
        const next = new Set(prev);
        wasLiked ? next.add(postId) : next.delete(postId);
        return next;
      });
      setPosts((prev) =>
        prev.map((p) => p._id === postId
          ? { ...p, likes: wasLiked ? p.likes + 1 : p.likes - 1 }
          : p)
      );
    }
  }

  // ── Comment (persisted to DB)
  async function handleComment(postId) {
    const text = (commentText[postId] || "").trim();
    if (!text) return;
    setCommentPosting((p) => ({ ...p, [postId]: true }));
    setCommentError((p)   => ({ ...p, [postId]: "" }));
    try {
      const res  = await fetch("/api/community/post/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, userEmail, userName, text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setPosts((prev) =>
        prev.map((p) => p._id === postId
          ? { ...p, comments: [...(p.comments || []), data.comment] }
          : p)
      );
      setCommentText((p) => ({ ...p, [postId]: "" }));
    } catch (e) {
      setCommentError((p) => ({ ...p, [postId]: e.message }));
    } finally {
      setCommentPosting((p) => ({ ...p, [postId]: false }));
    }
  }

  const Avatar = ({ size = "w-8 h-8", textSize = "text-[12px]", image = userImage, name = userName }) =>
    image ? (
      <img src={image} alt="avatar"
           className={`${size} rounded-full border border-[#2a2e3e] object-cover shrink-0`} />
    ) : (
      <div className={`${size} rounded-full border flex items-center justify-center ${textSize}
                       font-semibold font-mono shrink-0 ${getColor(name || "")}`}>
        {name?.charAt(0).toUpperCase()}
      </div>
    );

  return (
    <div className="mt-6">

      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h2 className="text-[15px] font-semibold text-[#ebedf5]">Posts</h2>
          {!loading && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#1d2b5c]/60
                             text-[#8ba4f5] border border-[#2a3a7a]/50">
              {posts.length} total
            </span>
          )}
        </div>
        <button onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-medium
                     bg-[#1d2b5c] border border-[#2a3a7a] text-[#8ba4f5]
                     hover:bg-[#22336e] transition-colors">
          <Icon size={12}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Icon>
          New Post
        </button>
      </div>

      {/* Logged-in pill */}
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl
                      bg-[#13161f] border border-[#1e2029] mb-5">
        <Avatar size="w-7 h-7" textSize="text-[11px]" />
        <div className="flex-1 min-w-0">
          <p className="text-[12.5px] font-medium text-[#c8cad4] leading-none truncate">{userName}</p>
          <p className="text-[10.5px] text-[#3f4357] mt-0.5 truncate">{userEmail}</p>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
          Active
        </span>
      </div>

      {/* Skeleton */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-[#13161f] border border-[#1e2029] rounded-xl p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#1e2029] shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-2.5 bg-[#1e2029] rounded w-1/3" />
                  <div className="h-2 bg-[#1e2029] rounded w-1/5" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2.5 bg-[#1e2029] rounded w-full" />
                <div className="h-2.5 bg-[#1e2029] rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && posts.length === 0 && (
        <div className="bg-[#13161f] border border-[#1e2029] rounded-xl py-14 text-center">
          <div className="w-12 h-12 rounded-full bg-[#161820] border border-[#1e2029]
                          flex items-center justify-center mx-auto mb-4 text-[#3a4470]">
            <Icon size={20}>
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </Icon>
          </div>
          <p className="text-[14px] font-medium text-[#4a4f62] mb-1">No posts yet</p>
          <p className="text-[11.5px] text-[#2e3244]">Hit New Post to share something.</p>
        </div>
      )}

      {/* Post cards */}
      {!loading && posts.length > 0 && (
        <div className="space-y-3">
          {posts.map((post) => {
            const isLiked      = likedPosts.has(post._id);
            const showComments = openComments[post._id];
            const comments     = post.comments || [];

            return (
              <article key={post._id}
                className="bg-[#13161f] border border-[#1e2029] rounded-xl p-5
                           hover:border-[#2a3060] transition-all">

                {/* Post header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl border flex items-center justify-center
                                     text-[12px] font-bold shrink-0 ${getColor(post.userName || "")}`}>
                      {post.userName?.charAt(0).toUpperCase()}
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

                <div className="border-t border-[#191b24] mb-3" />

                {/* Post body */}
                <p className="text-[13.5px] text-[#8a8fa8] leading-relaxed whitespace-pre-wrap">
                  {post.userContent}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#191b24]">
                  <div className="flex items-center gap-4">
                    {/* Like */}
                    <button onClick={() => handleLike(post._id)}
                      className={`flex items-center gap-1.5 text-[11.5px] transition-all
                        ${isLiked ? "text-[#8ba4f5]" : "text-[#3a4470] hover:text-[#8ba4f5]"}`}>
                      <svg width="13" height="13" viewBox="0 0 24 24"
                           fill={isLiked ? "currentColor" : "none"}
                           stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                      {post.likes}
                    </button>

                    {/* Reply toggle */}
                    <button
                      onClick={() => setOpenComments((p) => ({ ...p, [post._id]: !p[post._id] }))}
                      className={`flex items-center gap-1.5 text-[11.5px] transition-colors
                        ${showComments ? "text-[#8ba4f5]" : "text-[#3a4470] hover:text-[#8ba4f5]"}`}>
                      <Icon size={13}>
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </Icon>
                      {comments.length > 0 ? comments.length : "Reply"}
                    </button>
                  </div>

                  <span className="text-[10px] text-[#2e3244]">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric"
                    })}
                  </span>
                </div>

                {/* Comments */}
                {showComments && (
                  <div className="mt-4 pt-4 border-t border-[#191b24] space-y-3">
                    {comments.length === 0 && (
                      <p className="text-[11.5px] text-[#2e3244] text-center py-2">
                        No replies yet. Be the first!
                      </p>
                    )}
                    {comments.map((c) => (
                      <div key={c._id} className="flex gap-2.5">
                        <div className={`w-6 h-6 rounded-lg border flex items-center justify-center
                                         text-[10px] font-bold shrink-0 mt-0.5 ${getColor(c.userName || "")}`}>
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

                    {/* Comment input */}
                    <div className="flex gap-2.5 items-start pt-1">
                      <Avatar size="w-6 h-6" textSize="text-[10px]" />
                      <div className="flex-1">
                        <textarea
                          value={commentText[post._id] || ""}
                          onChange={(e) =>
                            setCommentText((p) => ({ ...p, [post._id]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleComment(post._id);
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
                        {commentError[post._id] && (
                          <p className="text-[11px] text-red-400 mt-1">{commentError[post._id]}</p>
                        )}
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-[10px] text-[#2e3244]">
                            {(commentText[post._id] || "").length}/300
                          </span>
                          <button
                            onClick={() => handleComment(post._id)}
                            disabled={commentPosting[post._id] || !(commentText[post._id] || "").trim()}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11.5px]
                                       font-medium bg-[#1d2b5c] border border-[#2a3a7a] text-[#8ba4f5]
                                       hover:bg-[#22336e] transition-colors
                                       disabled:opacity-40 disabled:cursor-not-allowed">
                            {commentPosting[post._id]
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
              </article>
            );
          })}
        </div>
      )}

      {/* New post modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#13161f] border border-[#1e2029] rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[15px] font-semibold text-[#ebedf5]">New Post</p>
                <p className="text-[11px] text-[#3f4357] mt-0.5">Share something with the community</p>
              </div>
              <button onClick={() => { setModalOpen(false); setContent(""); setPostError(""); }}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-[#1e2029]
                           text-[#3a3d4a] hover:bg-[#161820] hover:text-[#e05a5a] transition-colors">
                <Icon size={12}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Icon>
              </button>
            </div>
            <div className="border-t border-[#1e2029] mb-5" />
            <div className="flex items-center gap-3 mb-4 px-3 py-2.5 rounded-xl bg-[#0d0f14] border border-[#1e2029]">
              <Avatar size="w-8 h-8" textSize="text-[12px]" />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[#c8cad4] truncate">{userName}</p>
                <p className="text-[10px] text-[#2e3244] truncate">{userEmail}</p>
              </div>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Public
              </span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              maxLength={500}
              rows={5}
              autoFocus
              className="w-full bg-[#0d0f14] border border-[#1e2029] rounded-xl px-4 py-3
                         text-[13.5px] text-[#c8cad4] placeholder-[#2e3244] resize-none
                         focus:outline-none focus:border-[#2a3a7a] transition-colors"
            />
            <div className="flex items-center justify-between mt-2 mb-5">
              {postError
                ? <p className="text-[11px] text-red-400">{postError}</p>
                : <span />}
              <p className={`text-[10.5px] ml-auto ${content.length > 450 ? "text-amber-400" : "text-[#2e3244]"}`}>
                {content.length}/500
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setModalOpen(false); setContent(""); setPostError(""); }}
                className="flex-1 py-2.5 rounded-lg text-[13px] font-medium border border-[#1e2029]
                           text-[#4a4f62] hover:bg-[#161820] hover:text-[#8ba4f5] transition-colors">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={posting || !content.trim()}
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