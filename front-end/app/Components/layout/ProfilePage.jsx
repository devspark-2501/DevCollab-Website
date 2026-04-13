'use client'

import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

/* ─── Icons ─────────────────────────────────────────── */
const Icon = {
  Home: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  User: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Folder: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Bell: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  Settings: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  LogOut: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  Grid: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
};

const NAV = [
  { id: "home",     label: "Dashboard",     Icon: Icon.Home    },
  { id: "profile",  label: "Profile",        Icon: Icon.User    },
  { id: "projects", label: "Projects",       Icon: Icon.Folder  },
  { id: "activity", label: "Activity",       Icon: Icon.Grid    },
  { id: "settings", label: "Settings",       Icon: Icon.Settings},
];

/* ─── Sidebar ────────────────────────────────────────── */
function Sidebar({ expanded, onToggle, active, onNav }) {
  const W = expanded ? 240 : 68;

  const itemStyle = (isActive) => ({
    display: "flex", alignItems: "center", gap: 12,
    padding: expanded ? "10px 14px" : "10px 0",
    justifyContent: expanded ? "flex-start" : "center",
    borderRadius: 10, cursor: "pointer",
    transition: "background 0.2s, color 0.2s",
    color: isActive ? "#fff" : "rgba(255,255,255,0.45)",
    background: isActive ? "rgba(124,58,237,0.18)" : "transparent",
    border: isActive ? "1px solid rgba(124,58,237,0.3)" : "1px solid transparent",
    position: "relative", whiteSpace: "nowrap", overflow: "hidden",
    textDecoration: "none",
  });

  return (
    <aside style={{
      width: W, minWidth: W, maxWidth: W,
      background: "rgba(255,255,255,0.02)",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      display: "flex", flexDirection: "column",
      transition: "width 0.3s cubic-bezier(0.4,0,0.2,1), min-width 0.3s cubic-bezier(0.4,0,0.2,1)",
      overflow: "hidden", position: "relative", zIndex: 10,
    }}>

      {/* Logo area */}
      <div style={{
        padding: expanded ? "20px 16px 16px" : "20px 0 16px",
        display: "flex", alignItems: "center",
        justifyContent: expanded ? "space-between" : "center",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        minHeight: 64,
      }}>
        {expanded && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8, flexShrink: 0,
              background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 14px rgba(124,58,237,0.5)",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: "-0.3px", whiteSpace: "nowrap" }}>
              DevSpace
            </span>
          </div>
        )}
        {!expanded && (
          <div style={{
            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
            background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 14px rgba(124,58,237,0.5)",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
        )}

        {expanded && (
          <button onClick={onToggle} style={{
            width: 28, height: 28, borderRadius: 7, border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.04)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "rgba(255,255,255,0.5)", flexShrink: 0,
            transition: "background 0.2s",
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {!expanded && (
        <div style={{ padding: "12px 0", display: "flex", justifyContent: "center" }}>
          <button onClick={onToggle} style={{
            width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.04)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "rgba(255,255,255,0.5)",
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: expanded ? "12px 10px" : "12px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
        {expanded && (
          <p style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 6px 8px", margin: 0 }}>
            Navigation
          </p>
        )}
        {NAV.map(({ id, label, Icon: NavIcon }) => (
          <div
            key={id}
            onClick={() => onNav(id)}
            style={itemStyle(active === id)}
            onMouseEnter={e => { if (active !== id) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.75)"; }}}
            onMouseLeave={e => { if (active !== id) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}}
          >
            <span style={{ flexShrink: 0 }}><NavIcon /></span>
            {expanded && (
              <span style={{ fontSize: 14, fontWeight: active === id ? 600 : 400, transition: "opacity 0.2s" }}>
                {label}
              </span>
            )}
            {expanded && active === id && (
              <span style={{ marginLeft: "auto" }}><Icon.ChevronRight /></span>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom: Sign Out */}
      <div style={{ padding: expanded ? "12px 10px 20px" : "12px 8px 20px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        {expanded && (
          <p style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0 6px 8px", margin: 0 }}>
            Account
          </p>
        )}
        <div
          onClick={() => signOut({ callbackUrl: "/login" })}
          style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: expanded ? "10px 14px" : "10px 0",
            justifyContent: expanded ? "flex-start" : "center",
            borderRadius: 10, cursor: "pointer",
            color: "rgba(239,68,68,0.7)",
            border: "1px solid transparent",
            transition: "background 0.2s, color 0.2s, border-color 0.2s",
            whiteSpace: "nowrap", overflow: "hidden",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(239,68,68,0.1)";
            e.currentTarget.style.color = "rgba(239,68,68,1)";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "rgba(239,68,68,0.7)";
            e.currentTarget.style.borderColor = "transparent";
          }}
        >
          <span style={{ flexShrink: 0 }}><Icon.LogOut /></span>
          {expanded && <span style={{ fontSize: 14, fontWeight: 500 }}>Sign Out</span>}
        </div>
      </div>
    </aside>
  );
}

/* ─── Profile Page ───────────────────────────────────── */
export default function ProfileLayout({ name = "Alex Johnson", email = "alex@devspace.io", image = null, createdAt = new Date().toISOString(), provider = "github" }) {
  const [mounted, setMounted] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [activeNav, setActiveNav] = useState("profile");

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const joined = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
  const providerClean = provider
    ? provider.charAt(0).toUpperCase() + provider.slice(1)
    : "Credentials";

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      background: "#0b0f1a",
      fontFamily: "'Inter', system-ui, sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      {/* Ambient glows */}
      <div style={{ position: "fixed", top: -200, left: 60, width: 500, height: 500, background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: -200, right: -100, width: 500, height: 500, background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Sidebar */}
      <Sidebar
        expanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(v => !v)}
        active={activeNav}
        onNav={setActiveNav}
      />

      {/* Main area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto", position: "relative", zIndex: 1 }}>

        {/* Cover banner */}
        <div style={{
          position: "relative", width: "100%", height: 220, overflow: "hidden", flexShrink: 0,
          background: "linear-gradient(135deg, #1a0533 0%, #0f172a 40%, #0c1a3a 100%)",
          opacity: mounted ? 1 : 0, transition: "opacity 0.7s ease",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(139,92,246,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.07) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }} />
          <div style={{ position: "absolute", top: -60, left: "20%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.22) 0%, transparent 65%)" }} />
          <div style={{ position: "absolute", top: -40, right: "15%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 65%)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "linear-gradient(to bottom, transparent, #0b0f1a)" }} />
        </div>

        {/* Content */}
        <div style={{ maxWidth: 860, width: "100%", margin: "0 auto", padding: "0 28px 60px", flex: 1 }}>

          {/* Profile header */}
          <div style={{
            display: "flex", alignItems: "flex-end", justifyContent: "space-between",
            marginTop: -52, marginBottom: 28, flexWrap: "wrap", gap: 16,
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
          }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 18 }}>
              <div style={{ position: "relative" }}>
                {image ? (
                  <img src={image} alt="avatar" style={{
                    width: 104, height: 104, borderRadius: "50%",
                    border: "4px solid #0b0f1a",
                    outline: "2px solid rgba(139,92,246,0.5)",
                    objectFit: "cover", display: "block",
                    boxShadow: "0 0 28px rgba(139,92,246,0.3)",
                  }} />
                ) : (
                  <div style={{
                    width: 104, height: 104, borderRadius: "50%",
                    border: "4px solid #0b0f1a",
                    outline: "2px solid rgba(139,92,246,0.5)",
                    background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 38, fontWeight: 700, color: "#fff",
                    boxShadow: "0 0 28px rgba(139,92,246,0.3)",
                  }}>
                    {name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div style={{
                  position: "absolute", bottom: 5, right: 5,
                  width: 16, height: 16, borderRadius: "50%",
                  background: "#22c55e", border: "3px solid #0b0f1a",
                }} />
              </div>
              <div style={{ paddingBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px" }}>{name}</h1>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="10" height="8" viewBox="0 0 11 9" fill="none"><path d="M1 4.5L4 7.5L10 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.38)" }}>{email}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, paddingBottom: 6 }}>
              <button style={{
                padding: "8px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer",
                background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
                border: "none", color: "#fff",
                boxShadow: "0 4px 18px rgba(124,58,237,0.35)",
              }}>Edit Profile</button>
              <button style={{
                padding: "8px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.65)",
              }}>Share</button>
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 24,
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
          }}>
            {[{ num: "0", label: "Projects" }, { num: "0", label: "Followers" }, { num: "0", label: "Following" }].map(s => (
              <div key={s.label} style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14, padding: "18px 20px", textAlign: "center",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.35)"; e.currentTarget.style.background = "rgba(139,92,246,0.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
              >
                <p style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#fff", letterSpacing: "-1px" }}>{s.num}</p>
                <p style={{ margin: "3px 0 0", fontSize: 12, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Two-col layout */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 2fr", gap: 18, alignItems: "start",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
          }}>

            {/* Left col */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

              {/* About */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 18 }}>
                <p style={{ margin: "0 0 14px", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.09em", textTransform: "uppercase" }}>About</p>
                {[
                  { icon: <Icon.User />, label: "Name", value: name },
                  { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>, label: "Email", value: email },
                  { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>, label: "Joined", value: joined },
                  { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, label: "Auth", value: providerClean },
                ].map((row, i) => (
                  <div key={row.label} style={{
                    display: "flex", alignItems: "flex-start", gap: 10,
                    paddingBottom: i < 3 ? 11 : 0, marginBottom: i < 3 ? 11 : 0,
                    borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  }}>
                    <div style={{ color: "rgba(139,92,246,0.8)", marginTop: 2, flexShrink: 0 }}>{row.icon}</div>
                    <div>
                      <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.28)", marginBottom: 2 }}>{row.label}</p>
                      <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.8)", wordBreak: "break-all" }}>{row.value}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Right col */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

              {/* Activity */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 18 }}>
                <p style={{ margin: "0 0 14px", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.09em", textTransform: "uppercase" }}>Recent Activity</p>
                <div style={{ textAlign: "center", padding: "28px 0" }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(139,92,246,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="13" x2="12" y2="17"/><line x1="10" y1="15" x2="14" y2="15"/>
                    </svg>
                  </div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>No projects yet</p>
                  <p style={{ margin: "5px 0 18px", fontSize: 12, color: "rgba(255,255,255,0.28)" }}>Share your first project with the community</p>
                  <button style={{ padding: "8px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", background: "linear-gradient(135deg, #7c3aed, #3b82f6)", border: "none", color: "#fff", boxShadow: "0 4px 14px rgba(124,58,237,0.3)" }}>+ New Project</button>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
}