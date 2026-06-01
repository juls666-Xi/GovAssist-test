"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { formatDateTime } from "@/lib/utils";
import { getAuditLogs } from "@/services/admin-actions";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [offset, setOffset] = useState(0);

  useEffect(() => { loadLogs(); }, [offset]);

  async function loadLogs() {
    const result = await getAuditLogs(50, offset);
    if (result.logs) {
      setLogs(result.logs);
      setTotal(result.total || 0);
    }
    setIsLoading(false);
  }

  const columns = [
    {
      key: "user",
      header: "User",
      cell: (item: any) => (
        <div>
          <p className="font-medium">{item.user?.fullName || "System"}</p>
          <p className="text-xs text-muted-foreground">{item.user?.email}</p>
        </div>
      ),
    },
    {
      key: "action",
      header: "Action",
      cell: (item: any) => (
        <span className="font-mono text-sm">{item.action}</span>
      ),
    },
    {
      key: "target",
      header: "Target",
      cell: (item: any) => (
        <div>
          <p className="text-sm">{item.targetTable}</p>
          {item.targetId && (
            <p className="text-xs text-muted-foreground">ID: {item.targetId.slice(0, 8)}...</p>
          )}
        </div>
      ),
    },
    {
      key: "ip",
      header: "IP Address",
      cell: (item: any) => item.ipAddress || "N/A",
    },
    {
      key: "time",
      header: "Timestamp",
      cell: (item: any) => formatDateTime(item.createdAt),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description={`Total ${total} audit log entries`}
      />

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <>
              <DataTable
                columns={columns}
                data={logs}
                searchKey="action"
                searchPlaceholder="Search by action..."
                emptyTitle="No Audit Logs"
                emptyDescription="No audit logs found."
              />
              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={offset === 0}
                  onClick={() => setOffset(Math.max(0, offset - 50))}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Showing {offset + 1} - {Math.min(offset + 50, total)} of {total}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={offset + 50 >= total}
                  onClick={() => setOffset(offset + 50)}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}