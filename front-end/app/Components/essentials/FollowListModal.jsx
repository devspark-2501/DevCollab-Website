'use client'

import { useState, useEffect } from "react";
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

// type: "followers" | "following"
// apiBase: "/api/user/me" for own profile
//          "/api/user/EMAIL" for other profiles
export default function FollowListModal({ type, apiBase, onClose, title }) {
  const [list, setList]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");

  useEffect(() => {
    fetch(`${apiBase}/${type}`)
      .then((r) => r.json())
      .then((d) => setList(d[type] || []))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, [apiBase, type]);

  const filtered = list.filter((u) =>
    !search || u.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm bg-[#13161f] border border-[#1e2029] rounded-2xl shadow-2xl
                      flex flex-col max-h-[75vh]">

        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2029]">
          <div>
            <p className="text-[14px] font-semibold text-[#ebedf5]">{title}</p>
            <p className="text-[11px] text-[#2e3244] mt-0.5">
              {loading ? "Loading…" : `${list.length} ${type === "followers" ? "follower" : "following"}${list.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md border border-[#1e2029]
                       text-[#3a3d4a] hover:bg-[#161820] hover:text-[#e05a5a] transition-colors">
            <Icon size={12}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Icon>
          </button>
        </div>

        {/* search */}
        {list.length > 5 && (
          <div className="px-4 py-3 border-b border-[#1e2029]">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a4470]">
                <Icon size={13}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></Icon>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0d0f14] border border-[#1e2029]
                           text-[12.5px] text-[#c8cad4] placeholder-[#2e3244]
                           focus:outline-none focus:border-[#2a3a7a] transition-colors"
              />
            </div>
          </div>
        )}

        {/* list */}
        <div className="flex-1 overflow-y-auto">

          {/* skeleton */}
          {loading && (
            <div className="space-y-1 p-3">
              {[1,2,3,4].map((n) => (
                <div key={n} className="flex items-center gap-3 px-3 py-2.5 rounded-xl animate-pulse">
                  <div className="w-9 h-9 rounded-full bg-[#1e2029] shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-2.5 bg-[#1e2029] rounded w-1/3" />
                    <div className="h-2 bg-[#1e2029] rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* empty */}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full bg-[#161820] border border-[#1e2029]
                              flex items-center justify-center mx-auto mb-3 text-[#3a4470]">
                <Icon size={18}>
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </Icon>
              </div>
              <p className="text-[13px] font-medium text-[#4a4f62] mb-1">
                {search ? "No results" : type === "followers" ? "No followers yet" : "Not following anyone yet"}
              </p>
              <p className="text-[11px] text-[#2e3244]">
                {search ? "Try a different username" : type === "followers" ? "Share your profile to get followers" : "Go explore and follow people"}
              </p>
            </div>
          )}

          {/* user rows */}
          {!loading && filtered.length > 0 && (
            <div className="p-3 space-y-1">
              {filtered.map((u, i) => (
                <Link
                  key={u.email}
                  href={`/user/${encodeURIComponent(u.email)}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                             hover:bg-[#161820] transition-colors group"
                >
                  {/* avatar */}
                  <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center
                                   text-[13px] font-bold shrink-0 ${getColor(u.username || "")}`}>
                    {u.username?.charAt(0).toUpperCase()}
                  </div>

                  {/* info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#c8cad4] group-hover:text-[#ebedf5]
                                  transition-colors font-mono truncate">
                      @{u.username}
                    </p>
                    <p className="text-[10.5px] text-[#2e3244] truncate">{u.email}</p>
                  </div>

                  {/* arrow */}
                  <div className="text-[#2e3244] group-hover:text-[#8ba4f5] transition-colors shrink-0">
                    <Icon size={13}>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </Icon>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    
  );
}