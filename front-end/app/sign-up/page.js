'use client'

// export const metadata = {
//   title: "Dev Collab | Sign in"
// };

import { signIn, signOut, useSession } from "next-auth/react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Sign() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

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
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (status === "authenticated") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a] relative overflow-hidden">

                <div className="absolute w-[400px] h-[400px] bg-purple-600 opacity-20 blur-[120px] rounded-full top-[-100px] left-[-100px]" />
                <div className="absolute w-[400px] h-[400px] bg-blue-500 opacity-20 blur-[120px] rounded-full bottom-[-100px] right-[-100px]" />

                <div className="relative z-10 w-[90%] max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl text-center">
                    <p className="text-white text-lg font-medium mb-2">Signed in as</p>
                    <p className="text-gray-400 text-sm mb-6">{session.user.email}</p>
                    <button
                        onClick={() => signOut()}
                        className="w-full py-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 font-medium hover:bg-red-500/30 transition"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a] relative overflow-hidden">

            <div className="absolute w-[400px] h-[400px] bg-purple-600 opacity-20 blur-[120px] rounded-full top-[-100px] left-[-100px]" />
            <div className="absolute w-[400px] h-[400px] bg-blue-500 opacity-20 blur-[120px] rounded-full bottom-[-100px] right-[-100px]" />

            <div className="relative z-10 w-[90%] max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">

                <h1 className="text-2xl font-semibold text-white mb-2">
                    Welcome Back
                </h1>

                <p className="text-gray-400 text-sm mb-6">
                    Join the dev community and start sharing your work
                </p>

                {/* Email + Password Login */}
                <form onSubmit={handleLogin} className="flex flex-col gap-4 mb-6">

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
                        {loading ? "Signing in..." : "Sign In"}
                    </button>

                </form>

                {/* OAuth Buttons */}
                <div className="flex gap-3">

                    <button
                        onClick={() => signIn("github")}
                        className="flex-1 py-2.5 rounded-lg bg-[#0f172a] border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition"
                    >
                        GitHub
                    </button>

                    <button
                        onClick={() => signIn("google")}
                        className="flex-1 py-2.5 rounded-lg bg-[#111827] border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition"
                    >
                        Google
                    </button>

                </div>

                {/* Sign Up Link */}
                <p className="text-gray-400 text-sm mt-6 text-center">
                    Don’t have an account?{" "}
                    <Link href="/create-auth" className="text-purple-400 hover:underline">
                        Sign up
                    </Link>
                </p>

            </div>
        </div>
    )
}