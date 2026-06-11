"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/constants";
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
} from "lucide-react";

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

interface MobileNavProps {
  role: "CITIZEN" | "STAFF" | "ADMIN";
}

type PortalRoleKey = "citizen" | "staff" | "admin";

export function MobileNav({ role }: MobileNavProps) {
  const pathname = usePathname();
  const links = NAV_LINKS[role.toLowerCase() as PortalRoleKey] || [];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background">
      <nav className="flex items-center justify-around py-2">
        {links.slice(0, 5).map((link) => {
          const Icon = iconMap[link.icon] || LayoutDashboard;
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="hidden sm:inline">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
