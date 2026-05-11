'use client'

import { signIn, signOut, useSession } from "next-auth/react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const Icon = ({ size = 18, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export default function Sign() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("")
        setLoading(true)

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setLoading(false)

        if (res?.error) {
            setError("Invalid email or password")
        } else {
            router.push("/Profile")
        }
    }

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a]">
                <svg className="animate-spin" width="28" height="28" viewBox="0 0 24 24"
                     fill="none" stroke="#8ba4f5" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
            </div>
        );
    }

    if (status === "authenticated") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a] relative overflow-hidden px-4">

                <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-purple-600
                                opacity-[0.15] blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-blue-500
                                opacity-[0.12] blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

                <div className="relative z-10 w-full max-w-md">
                    <div className="bg-[#13161f] border border-[#1e2029] rounded-2xl p-7 shadow-2xl text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl
                                        bg-[#1d2b5c] border border-[#2a3a7a] mb-4">
                            <Icon size={20}>
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </Icon>
                        </div>
                        <p className="text-[13.5px] text-[#3a4470] uppercase tracking-wider mb-1">Signed in as</p>
                        <p className="text-[#c8cad4] text-[14px] mb-6">{session.user.email}</p>
                        <button
                            onClick={() => signOut()}
                            className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/20
                                       text-red-400 text-[13.5px] font-medium hover:bg-red-500/20 transition-all"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a]
                        relative overflow-hidden px-4 py-10">

            {/* glows */}
            <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-purple-600
                            opacity-[0.15] blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-blue-500
                            opacity-[0.12] blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md">

                {/* logo / brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl
                                    bg-[#1d2b5c] border border-[#2a3a7a] mb-4">
                        <Icon size={22}>
                            <polyline points="16 18 22 12 16 6"/>
                            <polyline points="8 6 2 12 8 18"/>
                        </Icon>
                    </div>
                    <h1 className="text-[22px] font-bold text-[#ebedf5] tracking-tight">DevCollab</h1>
                    <p className="text-[12.5px] text-[#3f4357] mt-1">The developer community</p>
                </div>

                {/* card */}
                <div className="bg-[#13161f] border border-[#1e2029] rounded-2xl p-7 shadow-2xl">

                    <h2 className="text-[18px] font-semibold text-[#ebedf5] mb-1">
                        Welcome Back
                    </h2>
                    <p className="text-[12.5px] text-[#3f4357] mb-6">
                        Sign in to continue to your dev community
                    </p>

                    <form onSubmit={handleLogin} className="flex flex-col gap-4 mb-5">

                        {/* email */}
                        <div>
                            <label className="text-[11px] text-[#3a4470] uppercase tracking-wider mb-1.5 block">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3a4470]">
                                    <Icon size={14}>
                                        <rect x="2" y="4" width="20" height="16" rx="2"/>
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                                    </Icon>
                                </div>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 py-3 rounded-xl bg-[#0d0f14] border border-[#1e2029]
                                               text-[13.5px] text-[#c8cad4] placeholder-[#2e3244]
                                               focus:outline-none focus:border-[#2a3a7a] transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        {/* password */}
                        <div>
                            <label className="text-[11px] text-[#3a4470] uppercase tracking-wider mb-1.5 block">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3a4470]">
                                    <Icon size={14}>
                                        <rect x="3" y="11" width="18" height="11" rx="2"/>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                    </Icon>
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#0d0f14] border border-[#1e2029]
                                               text-[13.5px] text-[#c8cad4] placeholder-[#2e3244]
                                               focus:outline-none focus:border-[#2a3a7a] transition-colors"
                                    required
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#3a4470]
                                               hover:text-[#8ba4f5] transition-colors">
                                    <Icon size={15}>
                                        {showPassword
                                            ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                                            : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                                        }
                                    </Icon>
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className="text-[12px] text-red-400 bg-red-500/10 border border-red-500/20
                                          rounded-xl px-3.5 py-2.5">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                                       text-[13.5px] font-medium bg-[#1d2b5c] border border-[#2a3a7a]
                                       text-[#8ba4f5] hover:bg-[#22336e] transition-all
                                       disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {loading
                                ? <><svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24"
                                          fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                                  </svg>Signing in…</>
                                : <>Sign In<Icon size={14}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></Icon></>
                            }
                        </button>

                    </form>

                    {/* OAuth */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1 border-t border-[#1e2029]" />
                        <span className="text-[11px] text-[#2e3244]">or continue with</span>
                        <div className="flex-1 border-t border-[#1e2029]" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button type="button" onClick={() => signIn("google")}
                            className="flex items-center justify-center gap-2 py-2.5 rounded-xl
                                       bg-[#0d0f14] border border-[#1e2029] text-[12.5px] text-[#c8cad4]
                                       hover:border-[#2a3a7a] hover:text-[#8ba4f5] transition-all">
                            <svg width="15" height="15" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Google
                        </button>
                        <button type="button" onClick={() => signIn("github")}
                            className="flex items-center justify-center gap-2 py-2.5 rounded-xl
                                       bg-[#0d0f14] border border-[#1e2029] text-[12.5px] text-[#c8cad4]
                                       hover:border-[#2a3a7a] hover:text-[#8ba4f5] transition-all">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                            </svg>
                            GitHub
                        </button>
                    </div>

                    <p className="text-[12px] text-[#3f4357] mt-6 text-center">
                        Don't have an account?{" "}
                        <Link href="/create-auth" className="text-[#8ba4f5] hover:underline">
                            Sign up
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    )
}