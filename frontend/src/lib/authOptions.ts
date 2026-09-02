import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        isRegister: { label: "IsRegister", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        try {
          const isRegister = credentials.isRegister === "true";
          const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
          const body = isRegister 
            ? { name: credentials.name, email: credentials.email, password: credentials.password }
            : { email: credentials.email, password: credentials.password };

          const res = await fetch(`${API_URL}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.error || "Authentication failed");
          }

          // Return object containing both user and token
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            backendToken: data.token,
            userObj: data.user,
          };
        } catch (e: any) {
          throw new Error(e.message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // 1. Initial sign in via Credentials
      if (user && account?.provider === "credentials") {
        token.backendToken = (user as any).backendToken;
        token.userObj = (user as any).userObj;
      }
      
      // 2. Initial sign in via Google
      if (account?.provider === "google") {
        try {
          // Call backend to sync Google user
          const res = await fetch(`${API_URL}/api/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user?.email,
              name: user?.name || "Student",
            }),
          });
          
          const data = await res.json();
          if (res.ok) {
            token.backendToken = data.token;
            token.userObj = data.user;
          }
        } catch (e) {
          console.error("Failed to sync Google user with backend:", e);
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Expose the custom user object and backend token to the client session
      if (token.userObj) {
        session.user = token.userObj as any;
        (session as any).backendToken = token.backendToken;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/", // We use the modal, so just redirect to home on error
  },
  secret: process.env.NEXTAUTH_SECRET,
};
