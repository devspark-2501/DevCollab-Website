'use client'

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

export default function SignUp() {

    const router = useRouter();

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSignup = async (e) => {
        e.preventDefault();

        setError("")
        setLoading(true)

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setLoading(false)
                setError(data.message || "Something went wrong")
                return;
            }

            // Auto login + redirect to Profile
            await signIn("credentials", {
                email,
                password,
                redirect: true,
                callbackUrl: "/Profile"
            });

        } catch (err) {
            setLoading(false)
            setError("Something went wrong. Try again.")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a] relative overflow-hidden">

            {/* Background Glow */}
            <div className="absolute w-[400px] h-[400px] bg-purple-600 opacity-20 blur-[120px] rounded-full top-[-100px] left-[-100px]" />
            <div className="absolute w-[400px] h-[400px] bg-blue-500 opacity-20 blur-[120px] rounded-full bottom-[-100px] right-[-100px]" />

            {/* Card */}
            <div className="relative z-10 w-[90%] max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">

                <h1 className="text-2xl font-semibold text-white mb-2">
                    Create Account
                </h1>

                <p className="text-gray-400 text-sm mb-6">
                    Join the dev community and start sharing your work
                </p>

                {/* Form */}
                <form onSubmit={handleSignup} className="flex flex-col gap-4">

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

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-[#111827] border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                        required
                    />

                    {error && (
                        <p className="text-red-400 text-sm">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
                    >
                        {loading ? "Creating account..." : "Sign Up"}
                    </button>

                </form>

                {/* Redirect Link */}
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