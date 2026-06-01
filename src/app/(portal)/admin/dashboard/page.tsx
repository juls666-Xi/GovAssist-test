import { requireAdmin } from "@/lib/auth-helpers";
import { getDashboardStats, getApplicationStats } from "@/services/admin-actions";
import { PageHeader } from "@/components/layout/page-header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/utils";
import {
  Users,
  FileText,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  UserCog,
  ArrowRight,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const session = await requireAdmin();
  const { stats } = await getDashboardStats();
  const { statusCounts, programStats } = await getApplicationStats();

  const recentAppColumns = [
    { key: "applicant", header: "Applicant", cell: (item: any) => item.user?.fullName || "N/A" },
    { key: "program", header: "Program", cell: (item: any) => item.program?.title || "N/A" },
    { key: "status", header: "Status", cell: (item: any) => <StatusBadge status={item.status} /> },
    { key: "submitted", header: "Submitted", cell: (item: any) => formatDate(item.submittedAt) },
    { key: "actions", header: "Actions", cell: (item: any) => (
      <Button variant="ghost" size="sm" asChild><Link href={`/staff/applications/${item.id}`}><Eye className="h-4 w-4" /></Link></Button>
    )},
  ];

  const auditColumns = [
    { key: "user", header: "User", cell: (item: any) => item.user?.fullName || "N/A" },
    { key: "action", header: "Action", cell: (item: any) => item.action },
    { key: "target", header: "Target", cell: (item: any) => `${item.targetTable}${item.targetId ? ` (${item.targetId.slice(0, 8)}...)` : ""}` },
    { key: "time", header: "Time", cell: (item: any) => formatDate(item.createdAt) },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title="Admin Dashboard" description={`Welcome back, ${session.user.name}`} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Users" value={stats?.totalUsers || 0} icon={Users} />
        <StatsCard title="Total Applications" value={stats?.totalApplications || 0} icon={FileText} />
        <StatsCard title="Active Programs" value={stats?.totalPrograms || 0} icon={Briefcase} />
        <StatsCard title="Pending Apps" value={stats?.pendingApplications || 0} icon={Clock} />
        <StatsCard title="Approved" value={stats?.approvedApplications || 0} icon={CheckCircle} />
        <StatsCard title="Rejected" value={stats?.rejectedApplications || 0} icon={XCircle} />
        <StatsCard title="Citizens" value={stats?.totalCitizens || 0} icon={Users} />
        <StatsCard title="Staff" value={stats?.totalStaff || 0} icon={UserCog} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Applications</CardTitle>
            <Button variant="ghost" size="sm" asChild><Link href="/staff/applications">View All <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={recentAppColumns}
              data={stats?.recentApplications || []}
              emptyTitle="No Applications"
              emptyDescription="No applications have been submitted yet."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Audit Logs</CardTitle>
            <Button variant="ghost" size="sm" asChild><Link href="/admin/audit-logs">View All <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={auditColumns}
              data={stats?.recentAuditLogs || []}
              emptyTitle="No Audit Logs"
              emptyDescription="No audit logs available."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}