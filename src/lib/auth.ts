import type { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { loginSchema } from "@/validators/auth";
import { authConfig } from "./auth.config";

const fullAuthConfig = {
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);
        if (!validatedFields.success) return null;

        const { email, password } = validatedFields.data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) return null;

        const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordsMatch) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          username: user.username,
          role: user.role,
        };
      },
    }),
  ],
  events: {
    async signIn({ user }) {
      if (user.id) {
        await prisma.auditLog.create({
          data: { userId: user.id, action: "USER_LOGIN", targetTable: "users", targetId: user.id },
        });
      }
    },
    async signOut(message) {
      const token = "token" in message ? message.token : null;

      if (token?.sub) {
        await prisma.auditLog.create({
          data: { userId: token.sub, action: "USER_LOGOUT", targetTable: "users", targetId: token.sub },
        });
      }
    },
  },
} satisfies NextAuthConfig;

import NextAuth from "next-auth";
export const { handlers, auth, signIn, signOut } = NextAuth(fullAuthConfig);

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username: string;
      role: string;
    };
  }
  interface User {
    username?: string;
    role?: string;
  }
  interface JWT {
    id?: string;
    username?: string;
    role?: string;
  }
}
