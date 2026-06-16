import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/", "/about", "/contact", "/programs", "/login", "/register", "/unauthorized"];
const citizenRoutes = ["/citizen"];
const staffRoutes = ["/staff"];
const adminRoutes = ["/admin"];

export function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;
  const pathname = nextUrl.pathname;

  // Allow public routes
  if (publicRoutes.some((route) => pathname === route || pathname.startsWith("/api/auth"))) {
    return NextResponse.next();
  }

  // Allow all API routes for now (auth will be handled by server)
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Check for session cookie
  const sessionCookie = cookies.get("authjs.session-token")?.value || 
                        cookies.get("__Secure-authjs.session-token")?.value;

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // For protected routes, you can add additional checks here
  // Role-based restrictions are better handled server-side with proper auth

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
