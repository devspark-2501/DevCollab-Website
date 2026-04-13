import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/database/db";
import User from "@/database/models/user";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-up",
  },
  callbacks: {
    // This runs every time a user signs in
    async signIn({ user, account }) {
      try {
        await connectDB();

        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          // Save new user to MongoDB
          await User.create({
            name: user.name,
            email: user.email,
            // password is required:true in your schema — handle it for OAuth users
            password: "oauth_" + account.provider, // placeholder
          });
          console.log("New user saved to DB:", user.email);
        } else {
          console.log("User already exists:", user.email);
        }

        return true; // allow sign in
      } catch (error) {
        console.error("Error saving user to DB:", error);
        return false; // block sign in on error
      }
    },

    // redirect to /profile after login
    async redirect({ url, baseUrl }) {
      return baseUrl + "/Profile";
    },

    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.accessToken = token.accessToken;
      return session;
    },
  },
});

export { handler as GET, handler as POST };