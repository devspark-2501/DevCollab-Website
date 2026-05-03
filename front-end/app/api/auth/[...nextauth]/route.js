import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };


{/* Unused Code!! */}

// import NextAuth from "next-auth";
// import GitHubProvider from "next-auth/providers/github";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcryptjs";

// import { connectDB } from "@/database/db";
// import User from "@/database/models/user";

// const handler = NextAuth({
//   providers: [

//     // Credentials Auth (Email + Password)
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },

//       async authorize(credentials) {
//         await connectDB();

//         const user = await User.findOne({ email: credentials.email });

//         if (!user) {
//           throw new Error("No user found");
//         }

//         // NEW FIX: block OAuth users from credentials login
//         if (user.password.startsWith("oauth_")) {
//           throw new Error("This account was created using Google/GitHub. Please login with OAuth.");
//         }

//         // compare hashed password
//         const isValid = await bcrypt.compare(
//           credentials.password,
//           user.password
//         );

//         if (!isValid) {
//           throw new Error("Invalid password");
//         }

//         return {
//           id: user._id.toString(),
//           email: user.email,
//           name: user.name,
//         };
//       },
//     }),

//     // Google
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),

//     // GitHub
//     GitHubProvider({
//       clientId: process.env.GITHUB_ID,
//       clientSecret: process.env.GITHUB_SECRET,
//     }),
//   ],

//   session: {
//     strategy: "jwt",
//   },

//   pages: {
//     signIn: "/sign", // fixed (your actual login page)
//   },

//   callbacks: {

//     // Runs on OAuth login
//     async signIn({ user, account }) {
//       try {
//         await connectDB();

//         // only run this for OAuth
//         if (account.provider !== "credentials") {

//           const existingUser = await User.findOne({ email: user.email });

//           if (!existingUser) {
//             await User.create({
//               name: user.name,
//               email: user.email,

//               // keep your logic but mark clearly as oauth
//               password: "oauth_" + account.provider,
//             });

//             console.log("New OAuth user saved:", user.email);
//           }
//         }

//         return true;

//       } catch (error) {
//         console.error("Error in signIn callback:", error);
//         return false;
//       }
//     },

//     async redirect({ baseUrl }) {
//       return baseUrl + "/Profile";
//     },

//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//       }
//       return token;
//     },

//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id;
//       }
//       return session;
//     },
//   },
// });

// export { handler as GET, handler as POST };