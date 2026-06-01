import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getSession = cache(async () => {
  const session = await auth();
  return session;
});

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}

export async function requireRole(allowedRoles: string[]) {
  const session = await requireAuth();
  if (!allowedRoles.includes(session.user.role)) {
    redirect("/unauthorized");
  }
  return session;
}

export async function requireCitizen() {
  return requireRole(["CITIZEN"]);
}

export async function requireStaff() {
  return requireRole(["STAFF", "ADMIN"]);
}

export async function requireAdmin() {
  return requireRole(["ADMIN"]);
}