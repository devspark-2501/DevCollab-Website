"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import AccountSwitcher from "@/app/Components/ui/AccountSwitcher";

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

const COLORS = [
  "bg-[#1d2b5c] text-[#8ba4f5] border-[#2a3a7a]",
  "bg-[#1a2e1a] text-[#4ade80] border-[#2a4a2a]",
  "bg-[#2e1a2e] text-[#c084fc] border-[#4a2a4a]",
  "bg-[#2e1a1a] text-[#f87171] border-[#4a2a2a]",
  "bg-[#1a2a2e] text-[#38bdf8] border-[#2a3a4a]",
  "bg-[#2e2a1a] text-[#fbbf24] border-[#4a3a2a]",
];
function getColor(name = "") { return COLORS[name.charCodeAt(0) % COLORS.length]; }

// ── Notification Bell ─────────────────────────────────────────────────────────
function NotificationBell() {
  const { data: session }               = useSession();
  const [unread, setUnread]             = useState(0);
  const [open, setOpen]                 = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [clearing, setClearing]         = useState(false);
  const dropdownRef                     = useRef(null);

  // poll every 30s
  useEffect(() => {
    if (!session?.user) return;

    function fetch_notifs() {
      fetch("/api/notifications")
        .then((r) => r.json())
        .then((d) => {
          setUnread(d.unreadCount || 0);
          setNotifications(d.notifications || []);
        })
        .catch(() => {});
    }

    fetch_notifs();
    const id = setInterval(fetch_notifs, 30000);
    return () => clearInterval(id);
  }, [session]);

  // close on outside click
  useEffect(() => {
    function handle(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  function handleOpen() {
    setOpen((v) => !v);
    if (unread > 0) {
      setUnread(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      fetch("/api/notifications", { method: "PATCH" }).catch(() => {});
    }
  }

  async function handleClearAll() {
    setClearing(true);
    try {
      await fetch("/api/notifications", { method: "DELETE" });
      setNotifications([]);
      setUnread(0);
      setOpen(false);
    } catch {}
    finally { setClearing(false); }
  }

  function handleDismissOne(id) {
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  }

  if (!session?.user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* bell button */}
      <button
        onClick={handleOpen}
        className={`relative w-9 h-9 flex items-center justify-center rounded-lg border
                    transition-all
                    ${open
                      ? "bg-[#1d2b5c]/60 border-[#2a3a7a] text-[#8ba4f5]"
                      : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"}`}
      >
        <Icon size={16}>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </Icon>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-0.5
                           rounded-full bg-[#8ba4f5] text-[#0d0f14]
                           text-[9px] font-bold flex items-center justify-center leading-none">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* dropdown */}
      {open && (
        <div className="absolute top-full right-0 mt-3 w-[320px] z-[999]
                        bg-[#13161f] border border-[#1e2029] rounded-2xl shadow-2xl
                        overflow-hidden">

          {/* header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e2029]">
            <div className="flex items-center gap-2">
              <p className="text-[13px] font-semibold text-[#ebedf5]">Notifications</p>
              {notifications.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[9px]
                                 bg-[#1d2b5c]/60 text-[#8ba4f5] border border-[#2a3a7a]/50">
                  {notifications.length}
                </span>
              )}
            </div>
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                disabled={clearing}
                className="text-[11px] text-[#3a4470] hover:text-[#e05a5a] transition-colors">
                {clearing ? "Clearing…" : "Clear all"}
              </button>
            )}
          </div>

          {/* list */}
          <div className="max-h-[380px] overflow-y-auto">

            {/* empty */}
            {notifications.length === 0 && (
              <div className="text-center py-10">
                <div className="w-10 h-10 rounded-full bg-[#161820] border border-[#1e2029]
                                flex items-center justify-center mx-auto mb-3 text-[#3a4470]">
                  <Icon size={17}>
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </Icon>
                </div>
                <p className="text-[12px] text-[#3a4470]">All caught up!</p>
                <p className="text-[10.5px] text-[#2e3244] mt-0.5">No notifications yet</p>
              </div>
            )}

            {notifications.map((n) => (
              <div
                key={n._id}
                className={`flex items-start gap-3 px-4 py-3 border-b border-[#1e2029]
                            last:border-0 transition-colors group
                            ${!n.read ? "bg-[#161c2e]/50" : "hover:bg-[#161820]"}`}
              >
                {/* avatar */}
                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center
                                 text-[12px] font-bold shrink-0 mt-0.5 ${getColor(n.fromName || "")}`}>
                  {n.fromName?.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-[#c8cad4] leading-snug">
                    <span className="font-semibold text-[#ebedf5]">{n.fromName}</span>
                    {" "}
                    {n.type === "like"
                      ? "❤️ liked your post"
                      : n.type === "comment"
                      ? "💬 replied to your post"
                      : "👤 started following you"
                    }
                  </p>
                  {n.postSnippet && n.type !== "follow" && (
                    <p className="text-[10.5px] text-[#3f4357] mt-0.5 truncate">
                      "{n.postSnippet}"
                    </p>
                  )}
                  <p className="text-[10px] text-[#2e3244] mt-1">
                    <TimeAgo date={n.createdAt} />
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                  {/* unread dot */}
                  {!n.read && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8ba4f5]" />
                  )}
                  {/* dismiss single */}
                  <button
                    onClick={() => handleDismissOne(n._id)}
                    className="opacity-0 group-hover:opacity-100 text-[#2e3244]
                               hover:text-[#e05a5a] transition-all">
                    <Icon size={11}>
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </Icon>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* footer link */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-[#1e2029] text-center">
              <p className="text-[10.5px] text-[#2e3244]">
                Showing last {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── NavBar ────────────────────────────────────────────────────────────────────
export const NavBar = () => {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [mounted, setMounted]     = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full flex justify-center z-50">
      <div className="w-[90%] max-w-6xl px-6 py-2 rounded-xl bg-[#0b0f1a]/80 backdrop-blur-xl
                      border border-white/10 shadow-lg flex flex-col md:flex-row md:items-center justify-between">

        {/* top row */}
        <div className="flex items-center justify-between w-full">

          {/* logo */}
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="DevCollab Logo" className="h-12 w-auto" />
          </Link>

          {/* desktop links */}
          <div className="hidden md:flex gap-8 text-gray-300 text-sm">
            <Link href="/Explore" className="hover:text-white transition-colors">Explore</Link>
            <Link href="/Feed"    className="hover:text-white transition-colors">Posts</Link>
            <Link href="/Community" className="hover:text-white transition-colors">Community</Link>
            <Link href="/Profile" className="hover:text-white transition-colors">Profile</Link>
          </div>

          {/* right side */}
          <div className="flex items-center gap-2.5">

            {status === "loading" ? (
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            ) : session ? (
              <>
                {/* ── bell only when logged in ── */}
                <NotificationBell />
                <AccountSwitcher />
              </>
            ) : (
              <Link href="/sign-up">
                <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500
                                   to-blue-500 text-white text-sm hover:opacity-90 transition-opacity">
                  Sign Up
                </button>
              </Link>
            )}

            {/* hamburger */}
            <button
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className={`block w-5 h-0.5 bg-gray-300 transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-0.5 bg-gray-300 transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-gray-300 transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>

        {/* mobile menu */}
        {menuOpen && (
          <div className="md:hidden flex flex-col gap-4 text-gray-300 text-sm
                          pt-4 pb-2 border-t border-white/10 mt-3">
            <Link href="/Explore"   onClick={() => setMenuOpen(false)}>Explore</Link>
            <Link href="/Feed"      onClick={() => setMenuOpen(false)}>Posts</Link>
            <Link href="/Community" onClick={() => setMenuOpen(false)}>Community</Link>
            <Link href="/Profile"   onClick={() => setMenuOpen(false)}>Profile</Link>

            {/* mobile notifications — only when logged in */}
            {session && (
              <div className="pt-2 border-t border-white/10">
                <p className="text-[11px] text-[#3a4470] uppercase tracking-widest mb-3">
                  Notifications
                </p>
                <NotificationBell />
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};