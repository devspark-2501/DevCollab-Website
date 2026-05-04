'use client'

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const COLORS = [
  "bg-[#1d2b5c] text-[#8ba4f5] border-[#2a3a7a]",
  "bg-[#1a2e1a] text-[#4ade80] border-[#2a4a2a]",
  "bg-[#2e1a2e] text-[#c084fc] border-[#4a2a4a]",
  "bg-[#2e1a1a] text-[#f87171] border-[#4a2a2a]",
  "bg-[#1a2a2e] text-[#38bdf8] border-[#2a3a4a]",
  "bg-[#2e2a1a] text-[#fbbf24] border-[#4a3a2a]",
];
function getColor(name = "") { return COLORS[name.charCodeAt(0) % COLORS.length]; }

const Icon = ({ size = 14, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export default function NotificationToast() {
  const { data: session }     = useSession();
  const [toasts, setToasts]   = useState([]);
  const [lastCount, setLastCount] = useState(null);

  useEffect(() => {
    if (!session?.user) return;

    function poll() {
      fetch("/api/notifications")
        .then((r) => r.json())
        .then((d) => {
          const notifs = d.notifications || [];
          const unread = d.unreadCount || 0;

          // on first load just store the count, don't toast
          if (lastCount === null) {
            setLastCount(unread);
            return;
          }

          // if new unread notifications appeared since last poll
          if (unread > lastCount) {
            const newOnes = notifs.slice(0, unread - lastCount);
            newOnes.forEach((n) => {
              const id = n._id + Date.now();
              setToasts((prev) => [...prev, { ...n, toastId: id }]);
              // auto-dismiss after 5s
              setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.toastId !== id));
              }, 5000);
            });
          }

          setLastCount(unread);
        })
        .catch(() => {});
    }

    const id = setInterval(poll, 30000);
    // run once after a short delay so lastCount is set first
    const init = setTimeout(poll, 500);
    return () => { clearInterval(id); clearTimeout(init); };
  }, [session, lastCount]);

  function dismiss(toastId) {
    setToasts((prev) => prev.filter((t) => t.toastId !== toastId));
  }

  if (toasts.length === 0) return null;

  return (
    // fixed bottom-right on desktop, bottom-center on mobile
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2.5
                    max-w-[320px] w-full sm:w-auto">
      {toasts.map((toast) => (
        <div
          key={toast.toastId}
          style={{ animation: "slideUp 0.3s ease" }}
          className="flex items-start gap-3 px-4 py-3.5
                     bg-[#13161f] border border-[#2a3060]
                     rounded-xl shadow-2xl"
        >
          {/* avatar */}
          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center
                           text-[12px] font-bold shrink-0 ${getColor(toast.fromName || "")}`}>
            {toast.fromName?.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[12.5px] text-[#c8cad4] leading-snug">
              <span className="font-semibold text-[#ebedf5]">{toast.fromName}</span>
              {" "}
              {toast.type === "like" ? "liked your post" : "replied to your post"}
            </p>
            {toast.postSnippet && (
              <p className="text-[10.5px] text-[#3f4357] mt-0.5 truncate">
                "{toast.postSnippet}"
              </p>
            )}
          </div>

          {/* dismiss */}
          <button
            onClick={() => dismiss(toast.toastId)}
            className="text-[#3a3d4a] hover:text-[#e05a5a] transition-colors shrink-0 mt-0.5">
            <Icon size={12}>
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </Icon>
          </button>
        </div>
      ))}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}