'use client'

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

const FILTERS = ["All", "Frontend", "Backend", "ML", "DevOps", "Systems"];

const NAV = [
  { id: "home",   label: "Home",   href: "/", icon: <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/>, extra: <path d="M9 21V12h6v9"/> },
  { id: "post",   label: "Post",   icon: <><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></> },
  { id: "people", label: "People", icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></> },
  { id: "code",   label: "Code",   icon: <><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></> },
];

const Icon = ({ d, size = 17, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {children ?? <path d={d} />}
  </svg>
);

function Sidebar({ expanded, onToggle, active, onNav, mobileOpen, onMobileClose }) {
  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={onMobileClose}
        />
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
            const content = <><Icon>{icon}</Icon>{expanded && <span>{label}</span>}</>;
            return href
              ? <Link key={id} href={href} className={cls} onClick={() => { onNav(id); onMobileClose(); }}>{content}</Link>
              : <div key={id} className={cls} onClick={() => { onNav(id); onMobileClose(); }}>{content}</div>;
          })}
        </nav>

        <hr className="border-[#1a1c23] my-3" />
        <button onClick={() => signOut({ callbackUrl: "/login" })}
          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] text-[#5a3a3a] border border-transparent hover:bg-[#1c1414] hover:text-[#e05a5a] hover:border-[#2a1818] transition-all ${expanded ? "" : "justify-center"}`}>
          <Icon size={16}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></Icon>
          {expanded && <span>Sign out</span>}
        </button>
      </aside>
    </>
  );
}

function Avatar({ name }) {
  const initials = name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";
  const colors = [
    "bg-blue-500/20 text-blue-300 border-blue-500/30",
    "bg-purple-500/20 text-purple-300 border-purple-500/30",
    "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    "bg-rose-500/20 text-rose-300 border-rose-500/30",
    "bg-amber-500/20 text-amber-300 border-amber-500/30",
    "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  ];
  const color = colors[name?.charCodeAt(0) % colors.length] ?? colors[0];
  return (
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-[15px] font-semibold border ${color} shrink-0`}>
      {initials}
    </div>
  );
}

function Highlight({ text = "", query = "" }) {
  if (!query) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <mark className="bg-blue-500/30 text-blue-200 rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </span>
  );
}

export default function Main_Explore() {
  const [query, setQuery]               = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [expanded, setExpanded]         = useState(true);
  const [activeNav, setActiveNav]       = useState("home");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [allUsers, setAllUsers]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [searched, setSearched]   = useState(false);

  const inputRef = useRef(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const res = await fetch("/api/explore");
      const data = await res.json();
      if (data.success) {
        setAllUsers(data.users);
      } else {
        setError(data.message || "Failed to fetch users");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query && !searched) fetchUsers();
  }, [query]);

  const filtered = allUsers.filter(u => {
    const q = query.toLowerCase();
    return !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  const handleKeyDown = (e) => {
    if (e.key === "Enter") fetchUsers();
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] relative overflow-hidden flex">

      <Sidebar
        expanded={expanded}
        onToggle={() => setExpanded(prev => !prev)}
        active={activeNav}
        onNav={setActiveNav}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex-1 overflow-y-auto min-w-0">

        {/* Background glows */}
        <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-blue-500 opacity-10 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-purple-600 opacity-10 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        {/* Mobile top bar */}
        <div className="relative z-10 flex items-center gap-3 px-4 py-3 bg-[#0b0f1a]/80 border-b border-white/[0.06] md:hidden">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-white/10 text-gray-500 hover:bg-white/5 hover:text-blue-400 transition-colors"
          >
            <Icon size={14}>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </Icon>
          </button>
          <span className="text-[13px] font-medium text-gray-400">Explore</span>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-14">

          {/* Header */}
          <div className="mb-8 sm:mb-10 text-center">
            <span className="inline-block px-4 py-1 text-[12px] rounded-full bg-white/5 text-gray-400 border border-white/10 mb-4">
              Explore Developers
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Find your people</h1>
            <p className="mt-2 text-gray-500 text-[13px] sm:text-[14px]">Search across the community and connect with developers</p>
          </div>

          {/* Search bar */}
          <div className="relative mb-6 max-w-xl mx-auto">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search by name or email…"
              className="w-full pl-10 pr-24 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-gray-600 text-[14px] outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all"
            />

            <button
              onClick={fetchUsers}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-lg bg-blue-600/80 hover:bg-blue-500 text-white text-[12px] font-medium transition-colors flex items-center gap-1.5"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <span className="hidden xs:inline">Search</span>
            </button>
          </div>

          {/* Results area */}
          {loading && (
            <div className="flex items-center justify-center py-16 gap-3 text-gray-500 text-[14px]">
              <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              Searching users…
            </div>
          )}

          {error && (
            <div className="max-w-xl mx-auto mt-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] text-center">
              {error}
            </div>
          )}

          {!loading && searched && !error && (
            <>
              <p className="text-[12px] text-gray-600 mb-4 text-center">
                {filtered.length === 0
                  ? "No users found"
                  : `${filtered.length} user${filtered.length > 1 ? "s" : ""} found`}
              </p>

              {/* User cards — 1 col on mobile, 2 on sm, 3 on lg */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filtered.map(user => (
                  <div
                    key={user._id}
                    className="flex items-start gap-3.5 p-4 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.06] hover:border-blue-500/20 transition-all group"
                  >
                    <Avatar name={user.name} />

                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-white truncate group-hover:text-blue-300 transition-colors">
                        <Highlight text={user.name} query={query} />
                      </p>
                      <p className="text-[12px] text-gray-500 truncate mt-0.5">
                        <Highlight text={user.email} query={query} />
                      </p>

                      <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-medium border
                        ${user.password === "oauth_google"
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : user.password === "oauth_github"
                          ? "bg-gray-500/10 text-gray-400 border-gray-500/20"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/20"}`}>
                        {user.password === "oauth_google" ? "Google" : user.password === "oauth_github" ? "GitHub" : "Email"}
                      </span>
                    </div>

                    <div className="text-gray-700 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all mt-0.5 shrink-0">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-16 text-gray-600">
                  <svg className="mx-auto mb-3 opacity-40" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <p className="text-[14px]">No users match <span className="text-gray-400">"{query}"</span></p>
                  <p className="text-[12px] mt-1">Try a different name or email</p>
                </div>
              )}
            </>
          )}

          {!searched && !loading && (
            <div className="text-center py-16 text-gray-700">
              <svg className="mx-auto mb-3 opacity-30" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <p className="text-[13px]">Type a name or email and press <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[11px] text-gray-500">Enter</kbd></p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}