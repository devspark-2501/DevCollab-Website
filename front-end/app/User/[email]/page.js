'use client'

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const COLORS = [
  "bg-[#1d2b5c] text-[#8ba4f5] border-[#2a3a7a]",
  "bg-[#1a2e1a] text-[#4ade80] border-[#2a4a2a]",
  "bg-[#2e1a2e] text-[#c084fc] border-[#4a2a4a]",
  "bg-[#2e1a1a] text-[#f87171] border-[#4a2a2a]",
  "bg-[#1a2a2e] text-[#38bdf8] border-[#2a3a4a]",
  "bg-[#2e2a1a] text-[#fbbf24] border-[#4a3a2a]",
];
function getColor(name = "") { return COLORS[name.charCodeAt(0) % COLORS.length]; }

const Icon = ({ size = 16, children }) => (
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

function SkeletonPost() {
  return (
    <div className="bg-[#13161f] border border-[#1e2029] rounded-xl p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-xl bg-[#1e2029] shrink-0" />
        <div className="space-y-1.5 flex-1">
          <div className="h-2.5 bg-[#1e2029] rounded w-1/3" />
          <div className="h-2 bg-[#1e2029] rounded w-1/5" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-2.5 bg-[#1e2029] rounded w-full" />
        <div className="h-2.5 bg-[#1e2029] rounded w-5/6" />
        <div className="h-2.5 bg-[#1e2029] rounded w-3/4" />
      </div>
    </div>
  );
}

export default function PublicProfilePage() {
  const { data: session }                   = useSession();
  const params                              = useParams();
  const router                              = useRouter();
  const [user, setUser]                     = useState(null);
  const [posts, setPosts]                   = useState([]);
  const [loading, setLoading]               = useState(true);
  const [notFound, setNotFound]             = useState(false);
  const [mounted, setMounted]               = useState(false);
  const [isFollowing, setIsFollowing]       = useState(false);
  const [followerCount, setFollowerCount]   = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followLoading, setFollowLoading]   = useState(false);

  const email = decodeURIComponent(params.email);

  // redirect to own profile if viewing yourself
  useEffect(() => {
    if (session?.user?.email === email) router.replace("/Profile");
  }, [session, email]);

  useEffect(() => {
    setTimeout(() => setMounted(true), 60);
    fetch(`/api/user/${encodeURIComponent(email)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setNotFound(true); return; }
        setUser(d.user);
        setPosts(d.posts || []);
        setFollowerCount(d.user.followerCount   || 0);
        setFollowingCount(d.user.followingCount || 0);
        // seed whether current user already follows this person
        if (session?.user?.email) {
          setIsFollowing(d.user.followers?.includes(session.user.email) ?? false);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [email, session]);

  async function handleFollow() {
    if (!session?.user) { router.push("/login"); return; }
    setFollowLoading(true);
    try {
      const res  = await fetch("/api/user/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetEmail: email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setIsFollowing(data.following);
      setFollowerCount(data.followerCount);
    } catch (e) {
      console.error(e);
    } finally {
      setFollowLoading(false);
    }
  }

  const fadeUp = `transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`;

  if (!loading && notFound) {
    return (
      <div className="min-h-screen bg-[#111318] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-[#13161f] border border-[#1e2029]
                          flex items-center justify-center mx-auto mb-5 text-[#3a4470]">
            <Icon size={26}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </Icon>
          </div>
          <p className="text-[18px] font-semibold text-[#ebedf5] mb-2">User not found</p>
          <p className="text-[13px] text-[#3f4357] mb-6">
            No profile exists for <span className="text-[#8ba4f5]">{email}</span>
          </p>
          <Link href="/Explore"
            className="px-5 py-2.5 rounded-lg text-[13px] font-medium
                       bg-[#1d2b5c] border border-[#2a3a7a] text-[#8ba4f5]
                       hover:bg-[#22336e] transition-colors">
            ← Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111318] text-[#e2e4ec]">

      {/* top nav */}
      <div className="sticky top-0 z-20 flex items-center justify-between
                      px-4 sm:px-8 py-3 bg-[#0d0f14]/90 backdrop-blur border-b border-[#1e2029]">
        <div className="flex items-center gap-2.5 text-[12px]">
          <Link href="/" className="text-[#3a4470] hover:text-[#8ba4f5] transition-colors">Home</Link>
          <span className="text-[#1e2029]">/</span>
          <Link href="/Explore" className="text-[#3a4470] hover:text-[#8ba4f5] transition-colors">Explore</Link>
          <span className="text-[#1e2029]">/</span>
          <span className="text-[#5a5f72] truncate max-w-[120px] sm:max-w-[200px]">
            {loading ? "Loading…" : user?.name}
          </span>
        </div>
        <Link href="/Profile"
          className="text-[11.5px] text-[#3a4470] hover:text-[#8ba4f5] transition-colors">
          My Profile →
        </Link>
      </div>

      {/* cover */}
      <div className="h-[120px] sm:h-[180px] bg-[#13161f] border-b border-[#1e2029] relative overflow-hidden">
        <div className="absolute inset-0 opacity-50"
             style={{ backgroundImage: "linear-gradient(#1e2029 1px,transparent 1px),linear-gradient(90deg,#1e2029 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="absolute top-[-60px] right-[-60px] w-[260px] h-[260px] bg-blue-500 opacity-[0.07] blur-[90px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-40px] left-[-40px] w-[200px] h-[200px] bg-purple-600 opacity-[0.07] blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-[#111318]" />
      </div>

      <div className="max-w-[820px] mx-auto px-4 sm:px-8 pb-16">

        {/* profile header */}
        <div className={`flex items-end justify-between -mt-10 sm:-mt-12 mb-8 flex-wrap gap-4 ${fadeUp}`}
             style={{ transitionDelay: "0.05s" }}>
          <div className="flex items-end gap-3 sm:gap-4">
            {/* avatar */}
            <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full
                             border-[3px] border-[#111318] outline outline-[1.5px] outline-[#2a2e3e]
                             flex items-center justify-center
                             text-3xl sm:text-4xl font-semibold font-mono
                             ${loading ? "bg-[#1a1d28] text-[#2e3244] animate-pulse" : getColor(user?.name || "")}`}>
              {loading ? "?" : user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="pb-1.5">
              <div className="flex items-center gap-2 mb-1">
                {loading
                  ? <div className="h-6 w-36 bg-[#1e2029] rounded animate-pulse" />
                  : <span className="text-[18px] sm:text-[22px] font-semibold text-[#ebedf5] tracking-tight">
                      {user?.name}
                    </span>
                }
              </div>
              {loading
                ? <div className="h-3.5 w-44 bg-[#1e2029] rounded animate-pulse mt-1" />
                : <p className="text-[12px] sm:text-[13px] text-[#3f4357]">{email}</p>
              }
            </div>
          </div>

          {/* follow button */}
          <div className="pb-1.5">
            <button
              onClick={handleFollow}
              disabled={followLoading || loading}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[13px] font-medium
                          border transition-all disabled:opacity-50 disabled:cursor-not-allowed
                          ${isFollowing
                            ? "bg-transparent border-[#1e2029] text-[#5a5f72] hover:border-red-500/40 hover:text-[#e05a5a]"
                            : "bg-[#1d2b5c] border-[#2a3a7a] text-[#8ba4f5] hover:bg-[#22336e]"}`}
            >
              {followLoading
                ? <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24"
                       fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                : <Icon size={13}>
                    {isFollowing
                      ? <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/></>
                      : <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></>
                    }
                  </Icon>
              }
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>
        </div>

        {/* stats — real data */}
        <div className={`grid grid-cols-3 gap-2 mb-6 ${fadeUp}`} style={{ transitionDelay: "0.12s" }}>
          {[
            { num: loading ? "—" : posts.length,    label: "Posts" },
            { num: loading ? "—" : followerCount,   label: "Followers" },
            { num: loading ? "—" : followingCount,  label: "Following" },
          ].map((s) => (
            <div key={s.label}
              className="bg-[#13161f] border border-[#1e2029] rounded-xl p-3 sm:p-4 text-center
                         hover:border-[#2a3060] transition-colors">
              <div className="text-xl sm:text-2xl font-semibold text-[#ebedf5] tracking-tight font-mono">
                {s.num}
              </div>
              <div className="text-[10px] sm:text-[11px] text-[#2e3244] font-medium mt-0.5 uppercase tracking-wider">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* about */}
        <div className={`mb-10 ${fadeUp}`} style={{ transitionDelay: "0.18s" }}>
          <div className="bg-[#13161f] border border-[#1e2029] rounded-xl p-5">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-[#2e3244] mb-4">About</p>
            <div className="flex items-start gap-2.5">
              <div className="text-[#3a4470] mt-0.5 shrink-0">
                <Icon size={13}>
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </Icon>
              </div>
              <div>
                <p className="text-[10.5px] text-[#2e3244] mb-0.5">Email</p>
                <p className="text-[13px] text-[#b0b4c8] break-all">{email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 border-t border-[#1e2029]" />
          <span className="text-[10.5px] text-[#2e3244] uppercase tracking-widest">Posts</span>
          <div className="flex-1 border-t border-[#1e2029]" />
        </div>

        {/* posts label */}
        <div className={`flex items-center gap-2 mb-6 ${fadeUp}`} style={{ transitionDelay: "0.22s" }}>
          <span className="inline-block px-3 py-1 text-[11px] rounded-full
                           bg-[#1d2b5c]/60 text-[#8ba4f5] border border-[#2a3a7a]/50 tracking-wide">
            {loading ? "Posts" : `${user?.name?.split(" ")[0]}'s Posts`}
          </span>
          {!loading && (
            <span className="inline-block px-3 py-1 text-[11px] rounded-full
                             bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ● {posts.length} total
            </span>
          )}
        </div>

        {/* skeletons */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => <SkeletonPost key={n} />)}
          </div>
        )}

        {/* empty */}
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
            <p className="text-[11.5px] text-[#2e3244]">{user?.name} hasn't posted anything yet.</p>
          </div>
        )}

        {/* post cards */}
        {!loading && posts.length > 0 && (
          <div className="space-y-3">
            {posts.map((post) => (
              <article key={post._id}
                className="bg-[#13161f] border border-[#1e2029] rounded-xl p-5
                           hover:border-[#2a3060] transition-all">
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

                <p className="text-[13.5px] text-[#8a8fa8] leading-relaxed whitespace-pre-wrap">
                  {post.userContent}
                </p>

                {/* read-only footer */}
                <div className="flex items-center gap-5 mt-4 pt-3 border-t border-[#191b24]">
                  <span className="flex items-center gap-1.5 text-[11.5px] text-[#3a4470]">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    {post.likes || 0} likes
                  </span>
                  <span className="flex items-center gap-1.5 text-[11.5px] text-[#3a4470]">
                    <Icon size={13}>
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </Icon>
                    {(post.comments || []).length} replies
                  </span>
                  <span className="text-[10px] text-[#2e3244] ml-auto">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric"
                    })}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}