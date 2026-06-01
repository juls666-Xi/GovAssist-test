"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { getApplications } from "@/services/application-actions";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Eye, Filter } from "lucide-react";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function StaffApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    const result = await getApplications();
    if (result.applications) setApplications(result.applications);
    setIsLoading(false);
  }

  const filteredApplications = statusFilter === "ALL"
    ? applications
    : applications.filter((app) => app.status === statusFilter);

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
      key: "documents",
      header: "Documents",
      cell: (item: any) => (
        <Badge variant="outline">
          {item.documents?.length || 0} uploaded
        </Badge>
      ),
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
    <div className="space-y-6">
      <PageHeader
        title="Applications"
        description="Review and manage citizen applications"
      />

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="REVIEWING">Reviewing</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="CLAIMED">Claimed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredApplications}
              searchKey="program"
              searchPlaceholder="Search by program or applicant..."
              emptyTitle="No Applications"
              emptyDescription="No applications match your criteria."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}