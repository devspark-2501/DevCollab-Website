"use client";

import { useSession, signOut, getSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// ─── Storage helpers ──────────────────────────────────────────────────────────

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
  const idx = list.findIndex((a) => a.email === account.email);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...account };
  } else {
    list.push(account);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function removeAccount(email) {
  const list = getSavedAccounts().filter((a) => a.email !== email);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function updateAccountToken(email, token) {
  const list = getSavedAccounts();
  const idx = list.findIndex((a) => a.email === email);
  if (idx !== -1) {
    list[idx].savedToken = token;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

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
  const [open, setOpen] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [switching, setSwitching] = useState(null);
  const ref = useRef(null);
  const router = useRouter();

  // ── On session load: persist account info + JWT token
  useEffect(() => {
    if (!session?.user) return;

    saveAccount({
      email:    session.user.email,
      username: session.user.username || session.user.name || "dev",
      image:    session.user.image || null,
      provider: session.user.provider || null,
    });

    // Requires exposing token in next-auth callbacks — see README below
    if (session.user.token) {
      updateAccountToken(session.user.email, session.user.token);
    }

    setAccounts(getSavedAccounts());
  }, [session?.user?.email]);

  // ── Close on outside click
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

  async function handleSwitch(acc) {
    setSwitching(acc.email);

    // Has a saved JWT → instant switch via API, no re-login
    if (acc.savedToken) {
      try {
        const res = await fetch("/api/auth/switch-account", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: acc.savedToken }),
        });
        if (res.ok) {
          await getSession();
          router.refresh();
          setOpen(false);
          setSwitching(null);
          return;
        }
      } catch (err) {
        console.error("Instant switch failed:", err);
      }
    }

    // OAuth account or no token — redirect to login with email hint
    signOut({ callbackUrl: `/create-auth?hint=${encodeURIComponent(acc.email)}` });
  }

  function handleAddAccount() {
    signOut({ callbackUrl: "/create-auth" });
  }

  function handleRemove(e, email) {
    e.stopPropagation();
    removeAccount(email);
    setAccounts(getSavedAccounts());
  }

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>

      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center justify-center focus:outline-none"
        aria-label="Account menu"
      >
        <Avatar
          src={session.user.image}
          username={session.user.username || session.user.name}
          size={36}
        />
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0b0f1a]" />
      </button>

      {/* Dropdown */}
      <div className={`
        absolute right-0 top-[calc(100%+10px)] w-[260px] z-[999]
        bg-[#0d0f1a] border border-[#1e2240] rounded-2xl shadow-2xl shadow-black/60
        overflow-hidden transition-all duration-200 origin-top-right
        ${open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}
      `}>

        {/* Active account */}
        <div className="px-4 pt-4 pb-3 border-b border-[#1a1c2e]">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-[#3a3d55] mb-3">
            Accounts
          </p>
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
            <span className="shrink-0 px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-wider
                             bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
              Active
            </span>
          </div>
        </div>

        {/* Saved accounts — shown even without token, blue dot = instant switch */}
        {otherAccounts.length > 0 && (
          <div className="px-2 py-2 border-b border-[#1a1c2e]">
            <p className="text-[9.5px] font-semibold tracking-widest uppercase text-[#2e3050] px-2 mb-1.5">
              Saved accounts
            </p>
            {otherAccounts.map((acc) => {
              const isSwitching = switching === acc.email;
              const instant = !!acc.savedToken;
              return (
                <button
                  key={acc.email}
                  onClick={() => handleSwitch(acc)}
                  disabled={isSwitching}
                  className="w-full flex items-center gap-3 px-2 py-2 rounded-xl
                             hover:bg-[#161a2e] transition-colors group text-left
                             disabled:opacity-60 disabled:cursor-wait"
                >
                  <div className="relative shrink-0">
                    <Avatar src={acc.image} username={acc.username} size={34} />
                    {instant && (
                      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full
                                       bg-[#8ba4f5]/80 border border-[#0d0f1a]"
                            title="Instant switch" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[12.5px] font-medium text-[#c8cae0] truncate">
                      @{acc.username}
                    </p>
                    <p className="text-[10.5px] text-[#3a3d55] truncate flex items-center gap-1">
                      {acc.email}
                      {instant
                        ? <span className="text-[#4a5a8a] font-semibold text-[9px]">· saved</span>
                        : <span className="text-[#2e2e45] text-[9px]">· re-login</span>
                      }
                    </p>
                  </div>

                  {isSwitching ? (
                    <span className="shrink-0 w-5 h-5 flex items-center justify-center">
                      <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24"
                           fill="none" stroke="#8ba4f5" strokeWidth="2.5">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83
                                 M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                      </svg>
                    </span>
                  ) : (
                    <span
                      role="button"
                      onClick={(e) => handleRemove(e, acc.email)}
                      className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center
                                 opacity-0 group-hover:opacity-100 transition-opacity
                                 text-[#3a3d55] hover:text-[#e05a5a] hover:bg-[#1c1414]"
                      title="Remove"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Actions */}
        <div className="px-2 py-2">
          <button
            onClick={handleAddAccount}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                       text-[12.5px] font-medium text-[#8ba4f5]
                       hover:bg-[#161c2e] border border-transparent hover:border-[#1e2a4a]
                       transition-all group"
          >
            <span className="w-[34px] h-[34px] rounded-full bg-[#1d2b5c]/60 border border-[#2a3a7a]/50
                             flex items-center justify-center shrink-0 group-hover:bg-[#1d2b5c] transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </span>
            Add another account
          </button>

          <a
            href="/Profile"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                       text-[12.5px] font-medium text-[#5a5f80]
                       hover:bg-[#161820] hover:text-[#c8cad4] transition-all"
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

          <button
            onClick={() => signOut({ callbackUrl: "/create-auth" })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                       text-[12.5px] font-medium text-[#5a3a3a]
                       hover:bg-[#1c1414] hover:text-[#e05a5a] transition-all mt-0.5"
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