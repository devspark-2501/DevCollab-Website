'use client'

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

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

export default function NotificationBell({ expanded }) {
  const { data: session }                   = useSession();
  const [unread, setUnread]                 = useState(0);
  const [open, setOpen]                     = useState(false);
  const [notifications, setNotifications]   = useState([]);
  const [loading, setLoading]               = useState(false);
  const dropdownRef                         = useRef(null);

  // poll every 30s for new notifications
  useEffect(() => {
    if (!session?.user) return;

    function fetchNotifs() {
      fetch("/api/notifications")
        .then((r) => r.json())
        .then((d) => {
          setUnread(d.unreadCount || 0);
          setNotifications(d.notifications || []);
        })
        .catch(() => {});
    }

    fetchNotifs();
    const id = setInterval(fetchNotifs, 30000);
    return () => clearInterval(id);
  }, [session]);

  // close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleOpen() {
    setOpen((v) => !v);
    // mark as read when opening
    if (unread > 0) {
      setUnread(0);
      fetch("/api/notifications", { method: "PATCH" }).catch(() => {});
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  }

  async function handleClearAll() {
    setLoading(true);
    try {
      await fetch("/api/notifications", { method: "DELETE" });
      setNotifications([]);
      setUnread(0);
    } catch {}
    finally { setLoading(false); }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={handleOpen}
        className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px]
                    border transition-all w-full cursor-pointer
                    ${open
                      ? "bg-[#161c2e] text-[#8ba4f5] border-[#1e2a4a]"
                      : "text-[#5a5f72] border-transparent hover:bg-[#161820] hover:text-[#c8cad4]"}
                    ${expanded ? "" : "justify-center"}`}
      >
        <div className="relative shrink-0">
          <Icon size={17}>
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </Icon>
          {unread > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-0.5
                             rounded-full bg-[#8ba4f5] text-[#0d0f14]
                             text-[9px] font-bold flex items-center justify-center leading-none">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </div>
        {expanded && <span>Alerts</span>}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute bottom-full left-0 mb-2 w-[310px] z-50
                        bg-[#13161f] border border-[#1e2029] rounded-xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e2029]">
            <div className="flex items-center gap-2">
              <p className="text-[12.5px] font-semibold text-[#ebedf5]">Notifications</p>
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
                disabled={loading}
                className="text-[10.5px] text-[#3a4470] hover:text-[#e05a5a] transition-colors">
                {loading ? "Clearing…" : "Clear all"}
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[340px] overflow-y-auto">
            {notifications.length === 0 && (
              <div className="text-center py-10">
                <div className="w-10 h-10 rounded-full bg-[#161820] border border-[#1e2029]
                                flex items-center justify-center mx-auto mb-3 text-[#3a4470]">
                  <Icon size={18}>
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </Icon>
                </div>
                <p className="text-[12px] text-[#3a4470]">No notifications yet</p>
              </div>
            )}

            {notifications.map((n) => (
              <div key={n._id}
                className={`flex items-start gap-3 px-4 py-3
                            border-b border-[#1e2029] last:border-0
                            transition-colors
                            ${!n.read ? "bg-[#161c2e]/60" : "hover:bg-[#161820]"}`}>

                {/* Avatar initial */}
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center
                                 text-[11px] font-bold shrink-0 mt-0.5 ${getColor(n.fromName || "")}`}>
                  {n.fromName?.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-[#c8cad4] leading-snug">
                    <span className="font-semibold text-[#ebedf5]">{n.fromName}</span>
                    {" "}
                    {n.type === "like"
                      ? <span>❤️ liked your post</span>
                      : <span>💬 replied to your post</span>
                    }
                  </p>
                  {n.postSnippet && (
                    <p className="text-[10.5px] text-[#3f4357] mt-0.5 truncate">
                      "{n.postSnippet}{n.postSnippet.length >= 60 ? "…" : ""}"
                    </p>
                  )}
                  <p className="text-[10px] text-[#2e3244] mt-1">
                    <TimeAgo date={n.createdAt} />
                  </p>
                </div>

                {/* unread dot */}
                {!n.read && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#8ba4f5] shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}