"use client";

import { Badge } from "@/components/ui/badge";
import { ROLE_COLORS, ROLE_LABELS } from "@/constants";

interface RoleBadgeProps {
  role: string;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const colorClass = ROLE_COLORS[role as keyof typeof ROLE_COLORS] || "bg-gray-100 text-gray-800";
  const label = ROLE_LABELS[role as keyof typeof ROLE_LABELS] || role;

  return (
    <Badge className={`${colorClass} ${className || ""}`}>
      {label}
    </Badge>
  );
}