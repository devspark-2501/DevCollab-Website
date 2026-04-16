'use client'

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

const NAV = [
  { id: "home",   label: "Home",   icon: <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/>, extra: <path d="M9 21V12h6v9"/> },
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
        {NAV.map(({ id, label, icon }) => (
          <div key={id} onClick={() => onNav(id)}
            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-[13.5px] font-normal border transition-all
              ${expanded ? "" : "justify-center"}
              ${active === id ? "bg-[#161c2e] text-[#8ba4f5] border-[#1e2a4a] font-medium" : "text-[#5a5f72] border-transparent hover:bg-[#161820] hover:text-[#c8cad4]"}`}>
            <Icon>{icon}</Icon>
            {expanded && <span>{label}</span>}
          </div>
        ))}
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

export default function ProfileLayout({
  name = "Alex Johnson",
  email = "alex@devspace.io",
  image = null,
  createdAt = new Date().toISOString(),
  provider = "github",
}) {
  const [mounted, setMounted] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [activeNav, setActiveNav] = useState("home");

  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  const joined = new Date(createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const providerClean = provider ? provider.charAt(0).toUpperCase() + provider.slice(1) : "Credentials";

  const fadeUp = `transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`;

  return (
    <div className="flex min-h-screen bg-[#111318] text-[#e2e4ec] font-[DM_Sans,system-ui,sans-serif]">
      <Sidebar expanded={sidebarExpanded} onToggle={() => setSidebarExpanded(v => !v)} active={activeNav} onNav={setActiveNav} />

      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* Cover */}
        <div className="h-[180px] shrink-0 bg-[#13161f] border-b border-[#1e2029] relative overflow-hidden">
          <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "linear-gradient(#1e2029 1px,transparent 1px),linear-gradient(90deg,#1e2029 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-[#111318]" />
        </div>

        <div className="max-w-[820px] w-full mx-auto px-8 pb-16">
          {/* Header */}
          <div className={`flex items-end justify-between -mt-12 mb-8 flex-wrap gap-4 ${fadeUp}`} style={{ transitionDelay: "0.05s" }}>
            <div className="flex items-end gap-4">
              <div className="relative">
                {image
                  ? <img src={image} alt="avatar" className="w-24 h-24 rounded-full border-[3px] border-[#111318] outline outline-[1.5px] outline-[#2a2e3e] object-cover" />
                  : <div className="w-24 h-24 rounded-full border-[3px] border-[#111318] outline outline-[1.5px] outline-[#2a2e3e] bg-[#1a1d28] flex items-center justify-center text-4xl font-semibold text-[#8ba4f5] font-mono">{name?.charAt(0).toUpperCase()}</div>
                }
                <div className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-green-500 border-[2.5px] border-[#111318]" />
              </div>
              <div className="pb-1.5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[22px] font-semibold text-[#ebedf5] tracking-tight">{name}</span>
                  <div className="w-[18px] h-[18px] rounded-full bg-[#1d2b5c] border border-[#2a3a7a] flex items-center justify-center">
                    <svg width="9" height="8" viewBox="0 0 11 9" fill="none"><path d="M1 4.5L4 7.5L10 1.5" stroke="#8ba4f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
                <p className="text-[13px] text-[#3f4357]">{email}</p>
              </div>
            </div>
            <div className="flex gap-2 pb-1.5">
              <button className="px-4 py-2 rounded-lg text-[13px] font-medium bg-[#1d2b5c] border border-[#2a3a7a] text-[#8ba4f5] hover:bg-[#22336e] transition-colors">Edit Profile</button>
              <button className="px-4 py-2 rounded-lg text-[13px] font-medium bg-transparent border border-[#1e2029] text-[#4a4f62] hover:bg-[#161820] hover:text-[#8ba4f5] transition-colors">Share</button>
            </div>
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-3 gap-2 mb-6 ${fadeUp}`} style={{ transitionDelay: "0.12s" }}>
            {[{ num: "0", label: "Projects" }, { num: "0", label: "Followers" }, { num: "0", label: "Following" }].map(s => (
              <div key={s.label} className="bg-[#13161f] border border-[#1e2029] rounded-xl p-4 text-center hover:border-[#2a3060] transition-colors cursor-default">
                <div className="text-2xl font-semibold text-[#ebedf5] tracking-tight font-mono">{s.num}</div>
                <div className="text-[11px] text-[#2e3244] font-medium mt-0.5 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Two col */}
          <div className={`grid grid-cols-[260px_1fr] gap-4 items-start ${fadeUp}`} style={{ transitionDelay: "0.2s" }}>
            {/* About */}
            <div className="bg-[#13161f] border border-[#1e2029] rounded-xl p-5">
              <p className="text-[10px] font-semibold tracking-widest uppercase text-[#2e3244] mb-4">About</p>
              {[
                { icon: <><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></>, key: "Email", val: email },
                { icon: <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>, key: "Joined", val: joined },
                { icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>, key: "Auth via", val: providerClean },
              ].map((row, i, arr) => (
                <div key={row.key} className={`flex items-start gap-2.5 ${i < arr.length - 1 ? "pb-3 mb-3 border-b border-[#191b24]" : ""}`}>
                  <div className="text-[#3a4470] mt-0.5 shrink-0"><Icon size={13}>{row.icon}</Icon></div>
                  <div>
                    <p className="text-[10.5px] text-[#2e3244] mb-0.5">{row.key}</p>
                    <p className="text-[13px] text-[#b0b4c8] break-all">{row.val}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Activity */}
            <div className="bg-[#13161f] border border-[#1e2029] rounded-xl p-5">
              <p className="text-[10px] font-semibold tracking-widest uppercase text-[#2e3244] mb-4">Recent Activity</p>
              <div className="text-center py-9">
                <div className="w-12 h-12 rounded-full bg-[#161820] border border-[#1e2029] flex items-center justify-center mx-auto mb-3.5 text-[#3a4470]">
                  <Icon size={20}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="13" x2="12" y2="17"/><line x1="10" y1="15" x2="14" y2="15"/></Icon>
                </div>
                <p className="text-[14px] font-medium text-[#4a4f62] mb-1">No projects yet</p>
                <p className="text-[12px] text-[#2e3244] mb-4">Share your first project with the community</p>
                <button className="px-5 py-2 rounded-lg text-[13px] font-medium bg-[#1d2b5c] border border-[#2a3a7a] text-[#8ba4f5] hover:bg-[#22336e] transition-colors">+ New Project</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}