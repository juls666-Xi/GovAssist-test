import { requireStaff } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { DataTable } from "@/components/ui/data-table";
import { formatDate } from "@/lib/utils";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  ArrowRight,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function StaffDashboardPage() {
  const session = await requireStaff();

  const [totalApplications, pendingCount, reviewingCount, approvedCount, rejectedCount, recentApplications] =
    await Promise.all([
      prisma.application.count(),
      prisma.application.count({ where: { status: "PENDING" } }),
      prisma.application.count({ where: { status: "REVIEWING" } }),
      prisma.application.count({ where: { status: "APPROVED" } }),
      prisma.application.count({ where: { status: "REJECTED" } }),
      prisma.application.findMany({
        take: 10,
        orderBy: { submittedAt: "desc" },
        include: {
          user: { select: { fullName: true, email: true } },
          program: { select: { title: true } },
        },
      }),
    ]);

  const columns = [
    {
      key: "applicant",
      header: "Applicant",
      cell: (item: any) => (
        <div>
          <p className="font-medium">{item.user?.fullName}</p>
          <p className="text-xs text-muted-foreground">{item.user?.email}</p>
        </div>
      ),
    },
    {
      key: "program",
      header: "Program",
      cell: (item: any) => item.program?.title || "N/A",
    },
    {
      key: "status",
      header: "Status",
      cell: (item: any) => <StatusBadge status={item.status} />,
    },
    {
      key: "submittedAt",
      header: "Submitted",
      cell: (item: any) => formatDate(item.submittedAt),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (item: any) => (
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/staff/applications/${item.id}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Staff Dashboard"
        description={`Welcome back, ${session.user.name}`}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard title="Total" value={totalApplications} icon={FileText} />
        <StatsCard title="Pending" value={pendingCount} icon={Clock} />
        <StatsCard title="Reviewing" value={reviewingCount} icon={Users} />
        <StatsCard title="Approved" value={approvedCount} icon={CheckCircle} />
        <StatsCard title="Rejected" value={rejectedCount} icon={XCircle} />
      </div>

      {/* Recent Applications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Applications</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/staff/applications">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={recentApplications}
            searchKey="program"
            searchPlaceholder="Search applications..."
            emptyTitle="No Applications"
            emptyDescription="No applications have been submitted yet."
          />
        </CardContent>
      </Card>
    </div>
  );
}