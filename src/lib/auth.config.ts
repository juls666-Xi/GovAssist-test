import type { NextAuthConfig } from "next-auth";

const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
if (!authSecret) {
  throw new Error("AUTH_SECRET or NEXTAUTH_SECRET must be set for NextAuth.");
}

const authUrl = process.env.NEXTAUTH_URL || process.env.AUTH_URL;
if (!authUrl) {
  throw new Error("NEXTAUTH_URL or AUTH_URL must be set for NextAuth.");
}

export const authConfig = {
  secret: authSecret,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
        token.picture = (user as any).image ?? token.picture;
      }
      if (trigger === "update" && session?.image !== undefined) {
        token.picture = session.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.role = token.role as string;
        session.user.image = (token.picture as string) ?? session.user.image;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;