'use client'

import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ProfilePage({ name, email, image, createdAt, provider }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const joined = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric"
  });

  const providerClean = provider
    ? provider.charAt(0).toUpperCase() + provider.slice(1)
    : "Credentials";

  return (
    <div style={{ minHeight: "100vh", background: "#0b0f1a", fontFamily: "'Inter', sans-serif" }}>

      {/* ── ambient glows ── */}
      <div style={{ position: "fixed", top: -200, left: -200, width: 500, height: 500, background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: -200, right: -100, width: 500, height: 500, background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* ── cover banner ── */}
      <div style={{
        position: "relative", width: "100%", height: 260, overflow: "hidden",
        background: "linear-gradient(135deg, #1a0533 0%, #0f172a 40%, #0c1a3a 100%)",
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.7s ease",
      }}>
        {/* animated grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(139,92,246,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.07) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
        {/* glowing orbs in banner */}
        <div style={{ position: "absolute", top: -60, left: "20%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 65%)" }} />
        <div style={{ position: "absolute", top: -40, right: "15%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 65%)" }} />
        {/* banner bottom fade */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "linear-gradient(to bottom, transparent, #0b0f1a)" }} />
      </div>

      {/* ── main content ── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>

        {/* ── profile header ── */}
        <div style={{
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
          marginTop: -56, marginBottom: 32,
          flexWrap: "wrap", gap: 16,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
        }}>
          {/* avatar */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 20 }}>
            <div style={{ position: "relative" }}>
              {image ? (
                <img src={image} alt="avatar" style={{
                  width: 112, height: 112, borderRadius: "50%",
                  border: "4px solid #0b0f1a",
                  outline: "2px solid rgba(139,92,246,0.5)",
                  objectFit: "cover", display: "block",
                  boxShadow: "0 0 32px rgba(139,92,246,0.3)",
                }} />
              ) : (
                <div style={{
                  width: 112, height: 112, borderRadius: "50%",
                  border: "4px solid #0b0f1a",
                  outline: "2px solid rgba(139,92,246,0.5)",
                  background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 40, fontWeight: 700, color: "#fff",
                  boxShadow: "0 0 32px rgba(139,92,246,0.3)",
                }}>
                  {name?.charAt(0).toUpperCase()}
                </div>
              )}
              {/* online badge */}
              <div style={{
                position: "absolute", bottom: 6, right: 6,
                width: 18, height: 18, borderRadius: "50%",
                background: "#22c55e", border: "3px solid #0b0f1a",
              }} />
            </div>

            <div style={{ paddingBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px" }}>{name}</h1>
                {/* verified-style badge */}
                <div style={{
                  width: 22, height: 22, borderRadius: "50%",
                  background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                    <path d="M1 4.5L4 7.5L10 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.4)" }}>{email}</p>
            </div>
          </div>

          {/* action buttons */}
          <div style={{ display: "flex", gap: 10, paddingBottom: 8 }}>
            <button style={{
              padding: "9px 22px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer",
              background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
              border: "none", color: "#fff",
              boxShadow: "0 4px 20px rgba(124,58,237,0.35)",
              transition: "opacity 0.2s",
            }}
              onMouseEnter={e => e.target.style.opacity = 0.85}
              onMouseLeave={e => e.target.style.opacity = 1}
            >
              Edit Profile
            </button>
            <button style={{
              padding: "9px 22px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)",
              transition: "background 0.2s",
            }}
              onMouseEnter={e => e.target.style.background = "rgba(255,255,255,0.1)"}
              onMouseLeave={e => e.target.style.background = "rgba(255,255,255,0.05)"}
            >
              Share
            </button>
          </div>
        </div>

        {/* ── stats row ── */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12,
          marginBottom: 28,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
        }}>
          {[
            { num: "0",  label: "Projects" },
            { num: "0",  label: "Followers" },
            { num: "0",  label: "Following" },
          ].map((s) => (
            <div key={s.label} style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16, padding: "20px 24px", textAlign: "center",
              transition: "border-color 0.2s, background 0.2s",
              cursor: "default",
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(139,92,246,0.35)";
                e.currentTarget.style.background = "rgba(139,92,246,0.06)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              }}
            >
              <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#fff", letterSpacing: "-1px" }}>{s.num}</p>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── two column layout ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20, alignItems: "start",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
        }}>

          {/* ── left col: about ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* about card */}
            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16, padding: "20px",
            }}>
              <p style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase" }}>About</p>
              {[
                {
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  ),
                  label: "Name", value: name,
                },
                {
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  ),
                  label: "Email", value: email,
                },
                {
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>
                    </svg>
                  ),
                  label: "Joined", value: joined,
                },
                {
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  ),
                  label: "Auth", value: providerClean,
                },
              ].map((row, i) => (
                <div key={row.label} style={{
                  display: "flex", alignItems: "flex-start", gap: 10,
                  paddingBottom: i < 3 ? 12 : 0,
                  marginBottom: i < 3 ? 12 : 0,
                  borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none",
                }}>
                  <div style={{ color: "rgba(139,92,246,0.8)", marginTop: 2, flexShrink: 0 }}>{row.icon}</div>
                  <div>
                    <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 2 }}>{row.label}</p>
                    <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.8)", wordBreak: "break-all" }}>{row.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* skills placeholder */}
            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16, padding: "20px",
            }}>
              <p style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Skills</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["React", "Next.js", "MongoDB", "Node.js"].map(skill => (
                  <span key={skill} style={{
                    padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500,
                    background: "rgba(139,92,246,0.12)", color: "rgba(167,139,250,0.9)",
                    border: "1px solid rgba(139,92,246,0.2)",
                  }}>{skill}</span>
                ))}
              </div>
            </div>

          </div>

          {/* ── right col: activity / projects ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* activity header */}
            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16, padding: "20px",
            }}>
              <p style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Recent Activity</p>

              {/* empty state */}
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 14px",
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(139,92,246,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="12" y1="13" x2="12" y2="17"/>
                    <line x1="10" y1="15" x2="14" y2="15"/>
                  </svg>
                </div>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>No projects yet</p>
                <p style={{ margin: "6px 0 20px", fontSize: 13, color: "rgba(255,255,255,0.3)" }}>Share your first project with the community</p>
                <button style={{
                  padding: "9px 22px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer",
                  background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
                  border: "none", color: "#fff",
                  boxShadow: "0 4px 16px rgba(124,58,237,0.3)",
                }}>
                  + New Project
                </button>
              </div>
            </div>

            {/* contributions heatmap placeholder */}
            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16, padding: "20px",
            }}>
              <p style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Contributions</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(26, 1fr)", gap: 3 }}>
                {Array.from({ length: 182 }).map((_, i) => {
                  const intensity = Math.random();
                  const alpha = intensity < 0.7 ? 0.07 : intensity < 0.85 ? 0.3 : intensity < 0.95 ? 0.6 : 0.9;
                  return (
                    <div key={i} style={{
                      aspectRatio: "1", borderRadius: 2,
                      background: `rgba(139,92,246,${alpha})`,
                    }} />
                  );
                })}
              </div>
              <p style={{ margin: "12px 0 0", fontSize: 12, color: "rgba(255,255,255,0.25)" }}>0 contributions in the last 6 months</p>
            </div>

          </div>
        </div>

        {/* bottom spacing */}
        <div style={{ height: 60 }} />
      </div>
    </div>
  );
}