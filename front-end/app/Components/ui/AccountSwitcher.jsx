"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";

// ─── tiny helpers ────────────────────────────────────────────────────────────

const STORAGE_KEY = "dc_saved_accounts";

function getSavedAccounts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveAccount(account) {
  const list = getSavedAccounts();
  const already = list.find((a) => a.email === account.email);
  if (already) return;                          // already stored
  list.push(account);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function removeAccount(email) {
  const list = getSavedAccounts().filter((a) => a.email !== email);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// ─── Avatar fallback ─────────────────────────────────────────────────────────

function Avatar({ src, username, size = 36 }) {
  const letter = (username || "?")[0].toUpperCase();
  return src ? (
    <img
      src={src}
      alt={username}
      width={size}
      height={size}
      className="rounded-full object-cover border border-white/10"
      style={{ width: size, height: size }}
    />
  ) : (
    <div
      className="rounded-full flex items-center justify-center border border-[#2a3a7a] bg-[#1a1d28] text-[#8ba4f5] font-semibold font-mono select-none"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {letter}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AccountSwitcher() {
  const { data: session } = useSession();
  const [open, setOpen]   = useState(false);
  const [accounts, setAccounts] = useState([]);
  const ref = useRef(null);

  // ── persist current user to localStorage on session load
  useEffect(() => {
    if (!session?.user) return;
    saveAccount({
      email:    session.user.email,
      username: session.user.username || session.user.name || "dev",
      image:    session.user.image || null,
    });
    setAccounts(getSavedAccounts());
  }, [session?.user?.email]);

  // ── close on outside click
  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!session) return null;

  const currentEmail = session.user.email;
  const otherAccounts = accounts.filter((a) => a.email !== currentEmail);

  // ── switch: sign out current user, browser goes to login
  //    (fill in the href/route you want below)
  function handleSwitch(acc) {
    // TODO: you can pass ?hint=acc.email to pre-fill the login form
    signOut({ callbackUrl: "/sign" /* ← change to your login route */ });
  }

  function handleAddAccount() {
    // TODO: change the URL below to your sign-in / sign-up route
    signOut({ callbackUrl: "/sign" /* ← change to your login/signup route */ });
  }

  function handleRemove(e, email) {
    e.stopPropagation();
    removeAccount(email);
    setAccounts(getSavedAccounts());
  }

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>

      {/* ── trigger: avatar ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center justify-center focus:outline-none group"
        aria-label="Account menu"
      >
        <Avatar
          src={session.user.image}
          username={session.user.username || session.user.name}
          size={36}
        />
        {/* green online dot */}
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0b0f1a]" />
      </button>

      {/* ── dropdown ── */}
      <div className={`
        absolute right-0 top-[calc(100%+10px)] w-[260px] z-[999]
        bg-[#0d0f1a] border border-[#1e2240] rounded-2xl shadow-2xl shadow-black/60
        overflow-hidden
        transition-all duration-200 origin-top-right
        ${open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}
      `}>

        {/* header */}
        <div className="px-4 pt-4 pb-3 border-b border-[#1a1c2e]">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-[#3a3d55] mb-3">
            Accounts
          </p>

          {/* current account */}
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <Avatar
                src={session.user.image}
                username={session.user.username || session.user.name}
                size={40}
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0d0f1a]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-[#ebedf5] truncate">
                @{session.user.username || session.user.name || "dev"}
              </p>
              <p className="text-[11px] text-[#3f4460] truncate">{session.user.email}</p>
            </div>
            {/* active badge */}
            <span className="shrink-0 px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-wider
                             bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
              Active
            </span>
          </div>
        </div>

        {/* other saved accounts */}
        {otherAccounts.length > 0 && (
          <div className="px-2 py-2 border-b border-[#1a1c2e]">
            <p className="text-[9.5px] font-semibold tracking-widest uppercase text-[#2e3050] px-2 mb-1.5">
              Saved accounts
            </p>
            {otherAccounts.map((acc) => (
              <button
                key={acc.email}
                onClick={() => handleSwitch(acc)}
                className="w-full flex items-center gap-3 px-2 py-2 rounded-xl
                           hover:bg-[#161a2e] transition-colors group text-left"
              >
                <Avatar src={acc.image} username={acc.username} size={34} />
                <div className="flex-1 min-w-0">
                  <p className="text-[12.5px] font-medium text-[#c8cae0] truncate">
                    @{acc.username}
                  </p>
                  <p className="text-[10.5px] text-[#3a3d55] truncate">{acc.email}</p>
                </div>
                {/* remove from list */}
                <span
                  role="button"
                  onClick={(e) => handleRemove(e, acc.email)}
                  className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center
                             opacity-0 group-hover:opacity-100 transition-opacity
                             text-[#3a3d55] hover:text-[#e05a5a] hover:bg-[#1c1414]"
                  title="Remove account"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </span>
              </button>
            ))}
          </div>
        )}

        {/* actions */}
        <div className="px-2 py-2">
          {/* Add / switch account */}
          <button
            onClick={handleAddAccount}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                       text-[12.5px] font-medium text-[#8ba4f5]
                       hover:bg-[#161c2e] border border-transparent hover:border-[#1e2a4a]
                       transition-all group"
          >
            <span className="w-[34px] h-[34px] rounded-full bg-[#1d2b5c]/60 border border-[#2a3a7a]/50
                             flex items-center justify-center shrink-0 group-hover:bg-[#1d2b5c]
                             transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </span>
            Add another account
          </button>

          {/* Go to profile — fill href */}
          <a
            href="/create-auth" /* ← your profile route */
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                       text-[12.5px] font-medium text-[#5a5f80]
                       hover:bg-[#161820] hover:text-[#c8cad4]
                       transition-all"
          >
            <span className="w-[34px] h-[34px] rounded-full bg-[#13161f] border border-[#1e2029]
                             flex items-center justify-center shrink-0">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </span>
            View profile
          </a>

          {/* Sign out */}
          <button
            onClick={() => signOut({ callbackUrl: "/sign" /* ← your login route */ })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                       text-[12.5px] font-medium text-[#5a3a3a]
                       hover:bg-[#1c1414] hover:text-[#e05a5a]
                       transition-all mt-0.5"
          >
            <span className="w-[34px] h-[34px] rounded-full bg-[#13161f] border border-[#1e2029]
                             flex items-center justify-center shrink-0">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </span>
            Sign out
          </button>
        </div>

      </div>
    </div>
  );
}