"use client";

import { StatsCard } from "./stats-card";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface DashboardStatsProps {
  totalApplications: number;
  totalPending: number;
  totalApproved: number;
  totalRejected: number;
}

export function DashboardStats({
  totalApplications,
  totalPending,
  totalApproved,
  totalRejected,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total Applications"
        value={totalApplications}
        icon={FileText}
      />
      <StatsCard
        title="Pending"
        value={totalPending}
        icon={Clock}
      />
      <StatsCard
        title="Approved"
        value={totalApproved}
        icon={CheckCircle}
      />
      <StatsCard
        title="Rejected"
        value={totalRejected}
        icon={XCircle}
      />
    </div>
  );
}
