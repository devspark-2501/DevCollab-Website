'use client'

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

const NAV = [
  { id: "home",   label: "Home",   href: "/",         icon: <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/> },
  { id: "post",   label: "Post",   href: null,        icon: <><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></> },
  { id: "people", label: "People", href: null,        icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></> },
  { id: "code",   label: "Code",   href: null,        icon: <><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></> },
];

const SEED_REVIEWS = [
  {
    id: 1,
    name: "Tanush Mathur",
    role: "Full Stack Developer",
    avatar: "PS",
    color: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    rating: 5,
    text: "DevCollab changed how I build side projects. Found my co-founder here after just two weeks of posting. The community is genuinely supportive — no ego, just builders helping builders.",
    tag: "Collaboration",
    date: "Apr 12, 2025",
    likes: 34,
  },
  {
    id: 2,
    name: "Marcus Webb",
    role: "Systems Engineer",
    avatar: "MW",
    color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    rating: 5,
    text: "I shipped my first open-source tool thanks to feedback I got here. People actually read your code and give real suggestions, not just copy-paste Stack Overflow answers.",
    tag: "Open Source",
    date: "Apr 8, 2025",
    likes: 28,
  },
  {
    id: 3,
    name: "Aiko Tanaka",
    role: "ML Engineer",
    avatar: "AT",
    color: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    rating: 4,
    text: "The ML discussions here are miles ahead of Reddit. Found a collaborator for my computer vision project within 48 hours. Would love more structured channels but overall incredible.",
    tag: "Machine Learning",
    date: "Mar 30, 2025",
    likes: 19,
  },
  {
    id: 4,
    name: "Devon Okafor",
    role: "Frontend Developer",
    avatar: "DO",
    color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    rating: 5,
    text: "Joined during a hackathon and stayed forever. The talent density is insane — I've learned more in 3 months here than in a year of solo grinding.",
    tag: "Frontend",
    date: "Mar 22, 2025",
    likes: 41,
  },
//   {
//     id: 5,
//     name: "Lena Kovač",
//     role: "DevOps & Cloud",
//     avatar: "LK",
//     color: "bg-amber-500/20 text-amber-300 border-amber-500/30",
//     rating: 4,
//     text: "Finally a place where infra talks are welcomed. Got help debugging a Kubernetes networking issue in under an hour. Solid community, very low noise-to-signal ratio.",
//     tag: "DevOps",
//     date: "Mar 15, 2025",
//     likes: 22,
//   },
//   {
//     id: 6,
//     name: "Rajan Mehta",
//     role: "Backend Engineer",
//     avatar: "RM",
//     color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
//     rating: 5,
//     text: "Been part of online dev communities since 2015 and this one genuinely feels different. Less gatekeeping, more mentorship. The async culture is perfect for timezone-distributed teams.",
//     tag: "Backend",
//     date: "Mar 10, 2025",
//     likes: 37,
//   },
];

const TAGS = ["General", "Frontend", "Backend", "ML", "DevOps", "Open Source", "Collaboration", "Systems", "Other"];
const AVATAR_COLORS = [
  "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  "bg-rose-500/20 text-rose-300 border-rose-500/30",
  "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
];

const Icon = ({ size = 17, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

function Sidebar({ expanded, onToggle, active, onNav, mobileOpen, onMobileClose }) {
  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={onMobileClose} />
      )}
      <aside className={`
        flex flex-col bg-[#0d0f14] border-r border-[#1e2029] p-3 transition-all duration-300
        fixed inset-y-0 left-0 z-30 md:relative md:z-auto
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${expanded ? "w-[220px]" : "w-[60px]"}
      `}>
        <div className={`flex items-center mb-5 ${expanded ? "justify-between" : "justify-center"}`}>
          {expanded && <span className="text-[10px] font-semibold tracking-widest uppercase text-[#3a3d4a] px-2">Menu</span>}
          <button onClick={onToggle} className="w-7 h-7 flex items-center justify-center rounded-md border border-[#1e2029] text-[#3a3d4a] hover:bg-[#161820] hover:text-[#8ba4f5] transition-colors">
            <Icon size={11}>{expanded ? <polyline points="15 18 9 12 15 6"/> : <polyline points="9 18 15 12 9 6"/>}</Icon>
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-0.5">
          {NAV.map(({ id, label, href, icon }) => {
            const cls = `flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-[13.5px] font-normal border transition-all no-underline
              ${expanded ? "" : "justify-center"}
              ${active === id ? "bg-[#161c2e] text-[#8ba4f5] border-[#1e2a4a] font-medium" : "text-[#5a5f72] border-transparent hover:bg-[#161820] hover:text-[#c8cad4]"}`;
            const content = (
              <>
                <Icon>{icon}</Icon>
                {expanded && <span>{label}</span>}
              </>
            );
            return href
              ? <Link key={id} href={href} className={cls} onClick={() => { onNav(id); onMobileClose(); }}>{content}</Link>
              : <div key={id} className={cls} onClick={() => { onNav(id); onMobileClose(); }}>{content}</div>;
          })}
        </nav>

        <hr className="border-[#1a1c23] my-3" />
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] text-[#5a3a3a] border border-transparent hover:bg-[#1c1414] hover:text-[#e05a5a] hover:border-[#2a1818] transition-all ${expanded ? "" : "justify-center"}`}
        >
          <Icon size={16}>
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

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={star <= (hovered || value) ? "#f59e0b" : "none"} stroke={star <= (hovered || value) ? "#f59e0b" : "#3a3d4a"} strokeWidth="1.8">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review, onLike }) {
  return (
    <div className="bg-[#13161f] border border-[#1e2029] rounded-xl p-5 flex flex-col gap-3 hover:border-[#2a3060] transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[13px] font-semibold border shrink-0 ${review.color}`}>
            {review.avatar}
          </div>
          <div>
            <p className="text-[13.5px] font-semibold text-[#ebedf5]">{review.name}</p>
            <p className="text-[11px] text-[#3f4357]">{review.role}</p>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1d2b5c]/60 text-[#8ba4f5] border border-[#2a3a7a]/50 shrink-0">
          {review.tag}
        </span>
      </div>

      {/* Stars */}
      <div className="flex gap-0.5">
        {[1,2,3,4,5].map(s => (
          <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill={s <= review.rating ? "#f59e0b" : "none"} stroke={s <= review.rating ? "#f59e0b" : "#2e3244"} strokeWidth="1.8">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        ))}
      </div>

      {/* Text */}
      <p className="text-[13px] text-[#8a8fa8] leading-relaxed flex-1">"{review.text}"</p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-[#191b24]">
        <span className="text-[11px] text-[#2e3244]">{review.date}</span>
        <button
          onClick={() => onLike(review.id)}
          className="flex items-center gap-1.5 text-[11px] text-[#3a4470] hover:text-[#8ba4f5] transition-colors group/like"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/like:scale-110 transition-transform">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          {review.likes}
        </button>
      </div>
    </div>
  );
}

const EMPTY_FORM = { name: "", role: "", text: "", rating: 0, tag: "General" };

export default function CommunityPage() {
  const [expanded, setExpanded]               = useState(true);
  const [activeNav, setActiveNav]             = useState("people");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [reviews, setReviews]                 = useState(SEED_REVIEWS);
  const [form, setForm]                       = useState(EMPTY_FORM);
  const [formError, setFormError]             = useState("");
  const [submitted, setSubmitted]             = useState(false);
  const [mounted, setMounted]                 = useState(false);
  const formRef = useRef(null);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  const handleLike = (id) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, likes: r.likes + 1 } : r));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setFormError("Please enter your name.");
    if (!form.role.trim()) return setFormError("Please enter your role.");
    if (form.rating === 0)  return setFormError("Please give a star rating.");
    if (form.text.trim().length < 20) return setFormError("Review must be at least 20 characters.");

    setFormError("");
    const initials = form.name.trim().split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    const color = AVATAR_COLORS[form.name.charCodeAt(0) % AVATAR_COLORS.length];
    const newReview = {
      id: Date.now(),
      name: form.name.trim(),
      role: form.role.trim(),
      avatar: initials,
      color,
      rating: form.rating,
      text: form.text.trim(),
      tag: form.tag,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      likes: 0,
    };
    setReviews(prev => [newReview, ...prev]);
    setForm(EMPTY_FORM);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  const fadeUp = (delay = 0) =>
    `transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`;

  return (
    <div className="min-h-screen bg-[#0b0f1a] flex text-[#e2e4ec] font-[DM_Sans,system-ui,sans-serif]">

      <Sidebar
        expanded={expanded}
        onToggle={() => setExpanded(v => !v)}
        active={activeNav}
        onNav={setActiveNav}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex-1 overflow-y-auto min-w-0 relative">

        {/* Background glows */}
        <div className="absolute top-[-80px] right-[-80px] w-[420px] h-[420px] bg-blue-500 opacity-[0.07] blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-[-80px] w-[400px] h-[400px] bg-purple-600 opacity-[0.07] blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        {/* Mobile top bar */}
        <div className="relative z-10 flex items-center gap-3 px-4 py-3 bg-[#0b0f1a]/80 border-b border-white/[0.06] md:hidden">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-white/10 text-gray-500 hover:bg-white/5 hover:text-[#8ba4f5] transition-colors"
          >
            <Icon size={14}>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </Icon>
          </button>
          <span className="text-[13px] font-medium text-[#8ba4f5]">Community</span>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 py-10 sm:py-14">

          {/* ── HERO ── */}
          <div className={`mb-12 ${fadeUp()} transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-block px-3 py-1 text-[11px] rounded-full bg-[#1d2b5c]/60 text-[#8ba4f5] border border-[#2a3a7a]/50 tracking-wide">
                DevCollab Community
              </span>
              <span className="inline-block px-3 py-1 text-[11px] rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ● Live
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-[#ebedf5] tracking-tight mb-4 leading-tight">
              Where developers come together,<br className="hidden sm:block" />
              <span className="text-[#8ba4f5]"> build together.</span>
            </h1>

            <p className="text-[14px] sm:text-[15px] text-[#5a5f72] leading-relaxed max-w-2xl mb-6">
              DevCollab is a space for developers to find collaborators, share projects, give honest feedback,
              and grow alongside a community that actually cares about the craft. No noise, no gatekeeping —
              just builders who show up and make things.
            </p>

            {/* Stats strip */}
            <div className="flex flex-wrap gap-3">
              {[
                { val: reviews.length.toString(), label: "Reviews" },
                { val: avgRating + " ★", label: "Avg rating" },
                { val: "2.4k+", label: "Members" },
                { val: "180+", label: "Projects built" },
              ].map(s => (
                <div key={s.label} className="px-4 py-2.5 rounded-xl bg-[#13161f] border border-[#1e2029] text-center min-w-[90px]">
                  <div className="text-[16px] font-semibold text-[#ebedf5] font-mono">{s.val}</div>
                  <div className="text-[10px] text-[#2e3244] uppercase tracking-wider mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── DIVIDER ── */}
          <div className="border-t border-[#1e2029] mb-10" />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">

            {/* ── LEFT: Reviews list ── */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[15px] font-semibold text-[#ebedf5]">Community Reviews</h2>
                <span className="text-[11px] text-[#3a4470]">{reviews.length} total</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reviews.map(r => (
                  <ReviewCard key={r.id} review={r} onLike={handleLike} />
                ))}
              </div>
            </div>

            {/* ── RIGHT: Add review form ── */}
            <div className="lg:sticky lg:top-6">
              <div className="bg-[#13161f] border border-[#1e2029] rounded-xl p-5">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-[#2e3244] mb-1">Share your experience</p>
                <h3 className="text-[15px] font-semibold text-[#ebedf5] mb-5">Leave a review</h3>

                {submitted ? (
                  <div className="py-10 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <p className="text-[14px] font-medium text-emerald-400 mb-1">Review posted!</p>
                    <p className="text-[12px] text-[#3f4357]">Thanks for sharing your experience.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} ref={formRef} className="flex flex-col gap-4">

                    <div>
                      <label className="block text-[11px] text-[#3a4470] mb-1.5">Your name</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="e.g. Jamie Lee"
                        className="w-full px-3 py-2.5 rounded-lg bg-[#0d0f14] border border-[#1e2029] text-[13px] text-[#c8cad4] placeholder-[#2e3244] outline-none focus:border-[#2a3a7a] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#3a4470] mb-1.5">Your role</label>
                      <input
                        type="text"
                        value={form.role}
                        onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                        placeholder="e.g. Frontend Developer"
                        className="w-full px-3 py-2.5 rounded-lg bg-[#0d0f14] border border-[#1e2029] text-[13px] text-[#c8cad4] placeholder-[#2e3244] outline-none focus:border-[#2a3a7a] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#3a4470] mb-1.5">Category</label>
                      <select
                        value={form.tag}
                        onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-lg bg-[#0d0f14] border border-[#1e2029] text-[13px] text-[#c8cad4] outline-none focus:border-[#2a3a7a] transition-colors appearance-none"
                      >
                        {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#3a4470] mb-1.5">Rating</label>
                      <StarRating value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#3a4470] mb-1.5">Your review</label>
                      <textarea
                        value={form.text}
                        onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                        placeholder="Tell the community about your experience…"
                        rows={4}
                        className="w-full px-3 py-2.5 rounded-lg bg-[#0d0f14] border border-[#1e2029] text-[13px] text-[#c8cad4] placeholder-[#2e3244] outline-none focus:border-[#2a3a7a] transition-colors resize-none"
                      />
                      <p className="text-[10px] text-[#2e3244] mt-1 text-right">{form.text.length} / 20 min</p>
                    </div>

                    {formError && (
                      <p className="text-[12px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                        {formError}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-lg text-[13px] font-medium bg-[#1d2b5c] border border-[#2a3a7a] text-[#8ba4f5] hover:bg-[#22336e] transition-colors flex items-center justify-center gap-2"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                      Post Review
                    </button>

                  </form>
                )}
              </div>

              {/* Small community note */}
              <div className="mt-4 px-4 py-3.5 rounded-xl bg-[#13161f] border border-[#1e2029]">
                <p className="text-[11px] text-[#3a4470] leading-relaxed">
                  All reviews are from real community members. We believe in honest, constructive feedback that helps everyone grow.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}