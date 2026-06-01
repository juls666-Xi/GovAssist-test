"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/utils";
import { getApplications } from "@/services/application-actions";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Calendar, MapPin, Clock } from "lucide-react";

export default function CitizenSchedulesPage() {
  const { data: session } = useSession();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSchedules();
  }, [session?.user?.id]);

  async function loadSchedules() {
    if (!session?.user?.id) return;
    const result = await getApplications(session.user.id);
    if (result.applications) {
      const allSchedules = result.applications.flatMap((app: any) =>
        (app.schedules || []).map((schedule: any) => ({
          ...schedule,
          programTitle: app.program?.title,
        }))
      ).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setSchedules(allSchedules);
    }
    setIsLoading(false);
  }

  const columns = [
    {
      key: "program",
      header: "Program",
      cell: (item: any) => item.programTitle || "N/A",
    },
    {
      key: "date",
      header: "Date",
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          {formatDate(item.date)}
        </div>
      ),
    },
    {
      key: "time",
      header: "Time",
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          {item.time}
        </div>
      ),
    },
    {
      key: "location",
      header: "Location",
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          {item.location}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (item: any) => <StatusBadge status={item.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Schedules"
        description="View your claim schedules and appointments"
      />

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={schedules}
              searchKey="programTitle"
              searchPlaceholder="Search schedules..."
              emptyTitle="No Schedules"
              emptyDescription="You don't have any scheduled appointments yet."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}