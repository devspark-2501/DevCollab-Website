'use client'

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

/* ─── Icons ─────────────────────────────────────────── */
const Icons = {
  Home: () => (
    <Link href="/">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9"/>
      </svg>
    </Link>
  ),
  Post: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  ),
  People: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Code: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  LogOut: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Email: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
  ),
  Shield: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
};

const NAV = [
  { id: "home",    label: "Home",    Icon: Icons.Home   },
  { id: "post",    label: "Post",    Icon: Icons.Post   },
  { id: "people",  label: "People",  Icon: Icons.People },
  { id: "code",    label: "Code",    Icon: Icons.Code   },
];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .profile-root {
    min-height: 100vh;
    display: flex;
    background: #111318;
    font-family: 'DM Sans', system-ui, sans-serif;
    color: #e2e4ec;
  }

  /* ─── Sidebar ─── */
  .sidebar {
    width: 220px;
    min-width: 220px;
    display: flex;
    flex-direction: column;
    background: #0d0f14;
    border-right: 1px solid #1e2029;
    padding: 24px 12px;
    transition: width 0.25s ease, min-width 0.25s ease;
    overflow: hidden;
  }
  .sidebar.collapsed {
    width: 60px;
    min-width: 60px;
  }

  .nav-section-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #3a3d4a;
    padding: 0 10px 8px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 9px 10px;
    border-radius: 8px;
    cursor: pointer;
    color: #5a5f72;
    font-size: 13.5px;
    font-weight: 400;
    transition: background 0.15s, color 0.15s;
    white-space: nowrap;
    overflow: hidden;
    border: 1px solid transparent;
    text-decoration: none;
  }
  .nav-item:hover {
    background: #161820;
    color: #c8cad4;
  }
  .nav-item.active {
    background: #161c2e;
    color: #8ba4f5;
    border-color: #1e2a4a;
    font-weight: 500;
  }

  .nav-item-icon { flex-shrink: 0; }

  .sidebar-divider {
    border: none;
    border-top: 1px solid #1a1c23;
    margin: 12px 0;
  }

  .signout-btn {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 9px 10px;
    border-radius: 8px;
    cursor: pointer;
    color: #5a3a3a;
    font-size: 13.5px;
    font-weight: 400;
    transition: background 0.15s, color 0.15s;
    white-space: nowrap;
    overflow: hidden;
    border: 1px solid transparent;
    background: transparent;
    width: 100%;
    text-align: left;
    font-family: inherit;
  }
  .signout-btn:hover {
    background: #1c1414;
    color: #e05a5a;
    border-color: #2a1818;
  }

  .toggle-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    border: 1px solid #1e2029;
    background: transparent;
    cursor: pointer;
    color: #3a3d4a;
    transition: background 0.15s, color 0.15s;
    flex-shrink: 0;
  }
  .toggle-btn:hover { background: #161820; color: #8ba4f5; }

  /* ─── Main ─── */
  .main {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  /* ─── Cover ─── */
  .cover {
    height: 180px;
    flex-shrink: 0;
    background: #13161f;
    border-bottom: 1px solid #1e2029;
    position: relative;
    overflow: hidden;
  }
  .cover-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(#1e2029 1px, transparent 1px),
      linear-gradient(90deg, #1e2029 1px, transparent 1px);
    background-size: 32px 32px;
    opacity: 0.5;
  }
  .cover-fade {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 80px;
    background: linear-gradient(to bottom, transparent, #111318);
  }

  /* ─── Content ─── */
  .content {
    max-width: 820px;
    width: 100%;
    margin: 0 auto;
    padding: 0 32px 60px;
  }

  /* ─── Profile Header ─── */
  .profile-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-top: -48px;
    margin-bottom: 32px;
    flex-wrap: wrap;
    gap: 16px;
  }

  .avatar-wrap { position: relative; }

  .avatar {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    border: 3px solid #111318;
    outline: 1.5px solid #2a2e3e;
    object-fit: cover;
    display: block;
  }
  .avatar-fallback {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    border: 3px solid #111318;
    outline: 1.5px solid #2a2e3e;
    background: #1a1d28;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 34px;
    font-weight: 600;
    color: #8ba4f5;
    font-family: 'DM Mono', monospace;
  }
  .avatar-status {
    position: absolute;
    bottom: 4px;
    right: 4px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #22c55e;
    border: 2.5px solid #111318;
  }

  .profile-name-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
    padding-bottom: 6px;
  }
  .profile-name {
    font-size: 22px;
    font-weight: 600;
    color: #ebedf5;
    letter-spacing: -0.4px;
  }
  .verified-badge {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #1d2b5c;
    border: 1px solid #2a3a7a;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .profile-email {
    font-size: 13px;
    color: #3f4357;
  }

  .header-actions {
    display: flex;
    gap: 8px;
    padding-bottom: 6px;
  }
  .btn-primary {
    padding: 8px 18px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    font-family: 'DM Sans', inherit;
    cursor: pointer;
    background: #1d2b5c;
    border: 1px solid #2a3a7a;
    color: #8ba4f5;
    transition: background 0.15s, border-color 0.15s;
  }
  .btn-primary:hover { background: #22336e; border-color: #3a4e9a; }
  .btn-ghost {
    padding: 8px 18px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    font-family: 'DM Sans', inherit;
    cursor: pointer;
    background: transparent;
    border: 1px solid #1e2029;
    color: #4a4f62;
    transition: background 0.15s, color 0.15s;
  }
  .btn-ghost:hover { background: #161820; color: #8ba4f5; }

  /* ─── Stats ─── */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-bottom: 24px;
  }
  .stat-card {
    background: #13161f;
    border: 1px solid #1e2029;
    border-radius: 10px;
    padding: 16px;
    text-align: center;
    transition: border-color 0.15s;
    cursor: default;
  }
  .stat-card:hover { border-color: #2a3060; }
  .stat-num {
    font-size: 24px;
    font-weight: 600;
    color: #ebedf5;
    letter-spacing: -0.8px;
    font-family: 'DM Mono', monospace;
  }
  .stat-label {
    font-size: 11px;
    color: #2e3244;
    font-weight: 500;
    margin-top: 3px;
    text-transform: uppercase;
    letter-spacing: 0.07em;
  }

  /* ─── Two-col ─── */
  .two-col {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 16px;
    align-items: start;
  }

  /* ─── Card ─── */
  .card {
    background: #13161f;
    border: 1px solid #1e2029;
    border-radius: 12px;
    padding: 20px;
  }
  .card-title {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #2e3244;
    margin-bottom: 16px;
  }

  /* Info rows */
  .info-row {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding-bottom: 12px;
    margin-bottom: 12px;
    border-bottom: 1px solid #191b24;
  }
  .info-row:last-child { border-bottom: none; padding-bottom: 0; margin-bottom: 0; }
  .info-icon { color: #3a4470; margin-top: 1px; flex-shrink: 0; }
  .info-key { font-size: 10.5px; color: #2e3244; margin-bottom: 2px; }
  .info-val { font-size: 13px; color: #b0b4c8; word-break: break-all; }

  /* Activity empty */
  .empty-state {
    text-align: center;
    padding: 36px 0;
  }
  .empty-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #161820;
    border: 1px solid #1e2029;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 14px;
    color: #3a4470;
  }
  .empty-title { font-size: 14px; font-weight: 500; color: #4a4f62; margin-bottom: 4px; }
  .empty-sub { font-size: 12px; color: #2e3244; margin-bottom: 16px; }
  .btn-new {
    padding: 8px 20px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    font-family: 'DM Sans', inherit;
    cursor: pointer;
    background: #1d2b5c;
    border: 1px solid #2a3a7a;
    color: #8ba4f5;
    transition: background 0.15s;
  }
  .btn-new:hover { background: #22336e; }

  /* Anim */
  .fade-up {
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  .fade-up.in {
    opacity: 1;
    transform: translateY(0);
  }
`;

/* ─── Sidebar ─── */
function Sidebar({ expanded, onToggle, active, onNav }) {
  return (
    <aside className={`sidebar${expanded ? "" : " collapsed"}`}>
      {/* Toggle + section label row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: expanded ? "space-between" : "center", marginBottom: 20 }}>
        {expanded && <span className="nav-section-label" style={{ marginBottom: 0 }}>Menu</span>}
        <button className="toggle-btn" onClick={onToggle} aria-label="Toggle sidebar">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            {expanded
              ? <polyline points="15 18 9 12 15 6"/>
              : <polyline points="9 18 15 12 9 6"/>}
          </svg>
        </button>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV.map(({ id, label, Icon }) => (
          <div
            key={id}
            className={`nav-item${active === id ? " active" : ""}`}
            onClick={() => onNav(id)}
            style={{ justifyContent: expanded ? "flex-start" : "center" }}
          >
            <span className="nav-item-icon"><Icon /></span>
            {expanded && <span>{label}</span>}
          </div>
        ))}
      </nav>

      {/* Sign out */}
      <div>
        <hr className="sidebar-divider" />
        <button
          className="signout-btn"
          onClick={() => signOut({ callbackUrl: "/login" })}
          style={{ justifyContent: expanded ? "flex-start" : "center" }}
        >
          <span style={{ flexShrink: 0 }}><Icons.LogOut /></span>
          {expanded && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
}

/* ─── Main Component ─── */
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

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const joined = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
  const providerClean = provider
    ? provider.charAt(0).toUpperCase() + provider.slice(1)
    : "Credentials";

  return (
    <>
      <style>{CSS}</style>
      <div className="profile-root">
        <Sidebar
          expanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded(v => !v)}
          active={activeNav}
          onNav={setActiveNav}
        />

        <div className="main">
          {/* Cover */}
          <div className="cover">
            <div className="cover-grid" />
            <div className="cover-fade" />
          </div>

          {/* Content */}
          <div className="content">

            {/* Profile Header */}
            <div className={`profile-header fade-up${mounted ? " in" : ""}`} style={{ transitionDelay: "0.05s" }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
                <div className="avatar-wrap">
                  {image
                    ? <img src={image} alt="avatar" className="avatar" />
                    : (
                      <div className="avatar-fallback">
                        {name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  <div className="avatar-status" />
                </div>
                <div style={{ paddingBottom: 6 }}>
                  <div className="profile-name-row">
                    <span className="profile-name">{name}</span>
                    <div className="verified-badge">
                      <svg width="9" height="8" viewBox="0 0 11 9" fill="none">
                        <path d="M1 4.5L4 7.5L10 1.5" stroke="#8ba4f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <p className="profile-email">{email}</p>
                </div>
              </div>
              <div className="header-actions">
                <button className="btn-primary">Edit Profile</button>
                <button className="btn-ghost">Share</button>
              </div>
            </div>

            {/* Stats */}
            <div className={`stats-row fade-up${mounted ? " in" : ""}`} style={{ transitionDelay: "0.12s" }}>
              {[
                { num: "0", label: "Projects" },
                { num: "0", label: "Followers" },
                { num: "0", label: "Following" },
              ].map(s => (
                <div className="stat-card" key={s.label}>
                  <div className="stat-num">{s.num}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Two column */}
            <div className={`two-col fade-up${mounted ? " in" : ""}`} style={{ transitionDelay: "0.2s" }}>

              {/* Left: About */}
              <div className="card">
                <p className="card-title">About</p>
                {[
                  { icon: <Icons.Email />, key: "Email",    val: email        },
                  { icon: <Icons.Calendar />, key: "Joined", val: joined      },
                  { icon: <Icons.Shield />, key: "Auth via", val: providerClean },
                ].map(row => (
                  <div className="info-row" key={row.key}>
                    <div className="info-icon">{row.icon}</div>
                    <div>
                      <p className="info-key">{row.key}</p>
                      <p className="info-val">{row.val}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right: Activity */}
              <div className="card">
                <p className="card-title">Recent Activity</p>
                <div className="empty-state">
                  <div className="empty-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="12" y1="13" x2="12" y2="17"/>
                      <line x1="10" y1="15" x2="14" y2="15"/>
                    </svg>
                  </div>
                  <p className="empty-title">No projects yet</p>
                  <p className="empty-sub">Share your first project with the community</p>
                  <button className="btn-new">+ New Project</button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}