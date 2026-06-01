"use client";

import { Badge } from "@/components/ui/badge";
import { STATUS_COLORS, STATUS_LABELS } from "@/constants";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colorClass = STATUS_COLORS[status as keyof typeof STATUS_COLORS] || "bg-gray-100 text-gray-800";
  const label = STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status;

  return (
    <Badge variant="outline" className={`${colorClass} ${className || ""}`}>
      {label}
    </Badge>
  );
}