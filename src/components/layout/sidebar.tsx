"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_LINKS, APP_NAME } from "@/constants";
import {
  LayoutDashboard,
  FileText,
  FileCheck,
  Bell,
  Calendar,
  Search,
  Users,
  UserCog,
  Briefcase,
  BarChart3,
  ClipboardList,
  Settings,
  Shield,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  FileText,
  FileCheck,
  Bell,
  Calendar,
  Search,
  Users,
  UserCog,
  Briefcase,
  BarChart3,
  ClipboardList,
  Settings,
};

interface SidebarProps {
  role: "CITIZEN" | "STAFF" | "ADMIN";
}

type PortalRoleKey = "citizen" | "staff" | "admin";

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const links = NAV_LINKS[role.toLowerCase() as PortalRoleKey] || [];

  return (
    <div className="hidden lg:flex flex-col w-64 border-r bg-background h-screen sticky top-0">
      <div className="flex h-16 items-center gap-2 px-6 border-b">
        <Shield className="h-6 w-6 text-primary" />
        <span className="text-lg font-bold">{APP_NAME}</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1">
        {links.map((link) => {
          const Icon = iconMap[link.icon] || LayoutDashboard;
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
