import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const publicRoutes = ["/", "/about", "/contact", "/programs", "/login", "/register", "/unauthorized"];
const citizenRoutes = ["/citizen"];
const staffRoutes = ["/staff"];
const adminRoutes = ["/admin"];

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;
  const pathname = nextUrl.pathname;

  if (publicRoutes.some((route) => pathname === route || pathname.startsWith("/api/auth"))) {
    return NextResponse.next();
  }
  if (pathname.startsWith("/api/")) return NextResponse.next();
  if (!isLoggedIn) return NextResponse.redirect(new URL("/login", nextUrl));

  if (citizenRoutes.some((route) => pathname.startsWith(route)) && userRole !== "CITIZEN") {
    return NextResponse.redirect(new URL("/unauthorized", nextUrl));
  }
  if (staffRoutes.some((route) => pathname.startsWith(route)) && userRole !== "STAFF" && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", nextUrl));
  }
  if (adminRoutes.some((route) => pathname.startsWith(route)) && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
