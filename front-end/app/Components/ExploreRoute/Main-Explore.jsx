'use client'

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

const MOCK_USERS = [
];

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

function Sidebar({ expanded, onToggle, active, onNav }) {
  return (
    <aside className={`flex flex-col bg-[#0d0f14] border-r border-[#1e2029] p-3 transition-all duration-300 ${expanded ? "w-[220px]" : "w-[60px]"}`}>
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
            ? <Link key={id} href={href} className={cls} onClick={() => onNav(id)}>{content}</Link>
            : <div key={id} className={cls} onClick={() => onNav(id)}>{content}</div>;
        })}
      </nav>

      <hr className="border-[#1a1c23] my-3" />
      <button onClick={() => signOut({ callbackUrl: "/login" })}
        className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] text-[#5a3a3a] border border-transparent hover:bg-[#1c1414] hover:text-[#e05a5a] hover:border-[#2a1818] transition-all ${expanded ? "" : "justify-center"}`}>
        <Icon size={16}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></Icon>
        {expanded && <span>Sign out</span>}
      </button>
    </aside>
  );
}

export default function Main_Explore() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [expanded, setExpanded] = useState(true);
  const [activeNav, setActiveNav] = useState("home");

  const filtered = MOCK_USERS.filter(u => {
    const q = query.toLowerCase();
    const matchQ = !q || [u.name, u.username, u.role, ...u.tags].some(v => v.toLowerCase().includes(q));
    const matchF = activeFilter === "All" || u.role.toLowerCase().includes(activeFilter.toLowerCase()) || u.tags.some(t => t.toLowerCase().includes(activeFilter.toLowerCase()));
    return matchQ && matchF;
  });

  return (
    <div className="min-h-screen bg-[#0b0f1a] relative overflow-hidden flex">

      <Sidebar
        expanded={expanded}
        onToggle={() => setExpanded(prev => !prev)}
        active={activeNav}
        onNav={setActiveNav}
      />

      <div className="flex-1">

        <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-blue-500 opacity-10 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-purple-600 opacity-10 blur-[140px] rounded-full pointer-events-none" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-14">

          <div className="mb-10 text-center">
            <span className="inline-block px-4 py-1 text-[12px] rounded-full bg-white/5 text-gray-400 border border-white/10 mb-4">Explore Developers</span>
            <h1 className="text-3xl font-bold text-white tracking-tight">Find your people</h1>
            <p className="mt-2 text-gray-500 text-[14px]">Search across the community and connect with developers</p>
          </div>

          <div className="relative mb-6 max-w-xl mx-auto">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by name, username, role, or stack…"
              className="w-full pl-11 pr-10 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-gray-600 text-[14px] outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all"
            />
          </div>

        </div>
      </div>
    </div>
  );
}