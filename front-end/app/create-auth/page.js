'use client'

import { useState } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"

export default function SignUp() {
    const [step, setStep] = useState("details")

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [otp, setOtp] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const [error, setError] = useState("")
    const [info, setInfo] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSendOtp = async (e) => {
        e.preventDefault()
        setError("")
        setInfo("")
        setLoading(true)

        try {
            const res = await fetch("/api/otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.message || "Failed to send OTP")
                setLoading(false)
                return
            }

            setInfo(`OTP sent to ${email}. Check your inbox.`)
            setStep("otp")
        } catch {
            setError("Something went wrong. Try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, otp }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.message || "Something went wrong")
                setLoading(false)
                return
            }

            await signIn("credentials", {
                email,
                password,
                redirect: true,
                callbackUrl: "/Profile",
            })

        } catch {
            setError("Something went wrong. Try again.")
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a] relative overflow-hidden">

            {/* Background Glows */}
            <div className="absolute w-[400px] h-[400px] bg-purple-600 opacity-20 blur-[120px] rounded-full top-[-100px] left-[-100px]" />
            <div className="absolute w-[400px] h-[400px] bg-blue-500 opacity-20 blur-[120px] rounded-full bottom-[-100px] right-[-100px]" />

            {/* Card */}
            <div className="relative z-10 w-[90%] max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">

                {/* Step Indicator */}
                <div className="flex items-center gap-2 mb-6">
                    <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border ${
                        step === "details"
                            ? "bg-purple-500 border-purple-500 text-white"
                            : "bg-purple-500/20 border-purple-500 text-purple-400"
                    }`}>1</div>
                    <div className={`flex-1 h-px ${step === "otp" ? "bg-purple-500" : "bg-white/10"}`} />
                    <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border ${
                        step === "otp"
                            ? "bg-purple-500 border-purple-500 text-white"
                            : "bg-white/5 border-white/10 text-gray-500"
                    }`}>2</div>
                </div>

                <h1 className="text-2xl font-semibold text-white mb-1">
                    {step === "details" ? "Create Account" : "Verify Email"}
                </h1>
                <p className="text-gray-400 text-sm mb-6">
                    {step === "details"
                        ? "Join the dev community and start sharing your work"
                        : `Enter the 6-digit code sent to ${email}`}
                </p>

                {/* ── STEP 1: Details ── */}
                {step === "details" && (
                    <form onSubmit={handleSendOtp} className="flex flex-col gap-4">

                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-[#111827] border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                            required
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-[#111827] border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                            required
                        />

                        {/* Password with show/hide toggle */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 pr-12 rounded-lg bg-[#111827] border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400 transition"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                                        <line x1="1" y1="1" x2="23" y2="23"/>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                        <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                )}
                            </button>
                        </div>

                        {error && <p className="text-red-400 text-sm">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
                        >
                            {loading ? "Sending OTP..." : "Continue →"}
                        </button>

                    </form>
                )}

                {/* ── STEP 2: OTP ── */}
                {step === "otp" && (
                    <form onSubmit={handleRegister} className="flex flex-col gap-4">

                        {info && (
                            <div className="px-4 py-3 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 text-sm">
                                {info}
                            </div>
                        )}

                        <input
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                            className="w-full px-4 py-3 rounded-lg bg-[#111827] border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-center text-2xl tracking-[0.5em] font-mono"
                            maxLength={6}
                            required
                        />

                        {error && <p className="text-red-400 text-sm">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading || otp.length !== 6}
                            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
                        >
                            {loading ? "Creating account..." : "Verify & Sign Up"}
                        </button>

                        <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={loading}
                            className="text-sm text-gray-400 hover:text-purple-400 transition text-center"
                        >
                            Didn't receive it?{" "}
                            <span className="text-purple-400 underline">Resend OTP</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => { setStep("details"); setError(""); setOtp("") }}
                            className="text-sm text-gray-500 hover:text-gray-300 transition text-center"
                        >
                            ← Change email
                        </button>

                    </form>
                )}

                <p className="text-gray-400 text-sm mt-6 text-center">
                    Already have an account?{" "}
                    <Link href="/sign-in" className="text-purple-400 hover:underline">
                        Sign in
                    </Link>
                </p>

            </div>
        </div>
    )
}