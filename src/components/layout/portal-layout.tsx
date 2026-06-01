"use client";

import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { Navbar } from "./navbar";
import { useSession } from "next-auth/react";

interface PortalLayoutProps {
  children: React.ReactNode;
}

export function PortalLayout({ children }: PortalLayoutProps) {
  const { data: session } = useSession();
  const role = (session?.user?.role as "CITIZEN" | "STAFF" | "ADMIN") || "CITIZEN";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar role={role} />
        <main className="flex-1 p-6 lg:p-8 pb-24 lg:pb-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
      <MobileNav role={role} />
    </div>
  );
}