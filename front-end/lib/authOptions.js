import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/database/db";
import User from "@/database/models/user";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No account found with that email.");
        }

        if (user.password.startsWith("oauth_")) {
          throw new Error(
            "This account was created with Google/GitHub. Please sign in with OAuth."
          );
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Incorrect password.");
        }

        // ✅ return username as name so next-auth stores it in the token
        return {
          id:       user._id.toString(),
          email:    user.email,
          name:     user.username,   // username, not display name
          username: user.username,
        };
      },
    }),

    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    GitHubProvider({
      clientId:     process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  session: { strategy: "jwt" },

  pages: { signIn: "/sign" },

  callbacks: {
    async signIn({ user, account }) {
      try {
        await connectDB();

        // only handle OAuth providers here
        if (account.provider !== "credentials") {
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            // ── auto-generate a unique username from their OAuth display name
            const base = (user.name || "user")
              .toLowerCase()
              .replace(/\s+/g, "_")           // spaces → underscore
              .replace(/[^a-zA-Z0-9._-]/g, "") // strip invalid chars
              .slice(0, 20)                    // max 20 chars
              || "user";

            let username = base;
            let attempts = 0;

            // keep trying until we find a free username
            while (await User.findOne({ username })) {
              username = `${base}_${Math.floor(Math.random() * 9000) + 1000}`;
              if (++attempts > 15) {
                username = `user_${Date.now()}`;
                break;
              }
            }

            await User.create({
              username,
              email:    user.email,
              password: "oauth_" + account.provider,
            });
          }
        }

        return true;
      } catch (error) {
        console.error("signIn callback error:", error);
        return false;
      }
    },

    async redirect({ baseUrl }) {
      return baseUrl + "/Profile";
    },

    async jwt({ token, user }) {
      if (user) {
        token.id       = user.id;
        token.username = user.username || user.name; // store username in token
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id       = token.id;
        session.user.username = token.username; // expose to client via useSession()
        session.user.name     = token.username; // keep name = username everywhere
      }
      return session;
    },
  },
};