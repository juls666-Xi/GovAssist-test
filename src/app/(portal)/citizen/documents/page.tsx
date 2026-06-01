"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { formatDate } from "@/lib/utils";
import { getApplications } from "@/services/application-actions";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FileText, Download, CheckCircle, XCircle } from "lucide-react";

export default function CitizenDocumentsPage() {
  const { data: session } = useSession();
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, [session?.user?.id]);

  async function loadDocuments() {
    if (!session?.user?.id) return;
    const result = await getApplications(session.user.id);
    if (result.applications) {
      const allDocs = result.applications.flatMap((app: any) =>
        (app.documents || []).map((doc: any) => ({
          ...doc,
          programTitle: app.program?.title,
          applicationStatus: app.status,
        }))
      );
      setDocuments(allDocs);
    }
    setIsLoading(false);
  }

  const columns = [
    {
      key: "fileName",
      header: "File Name",
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <span className="font-medium">{item.fileName}</span>
        </div>
      ),
    },
    {
      key: "program",
      header: "Program",
      cell: (item: any) => item.programTitle || "N/A",
    },
    {
      key: "status",
      header: "Verification",
      cell: (item: any) => (
        <Badge variant={item.verified ? "default" : "secondary"}>
          {item.verified ? (
            <><CheckCircle className="h-3 w-3 mr-1" /> Verified</>
          ) : (
            <><XCircle className="h-3 w-3 mr-1" /> Pending</>
          )}
        </Badge>
      ),
    },
    {
      key: "uploadedAt",
      header: "Uploaded",
      cell: (item: any) => formatDate(item.uploadedAt),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (item: any) => (
        <Button variant="ghost" size="sm" asChild>
          <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">
            <Download className="h-4 w-4" />
          </a>
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Documents"
        description="View and manage your uploaded documents"
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
              data={documents}
              searchKey="fileName"
              searchPlaceholder="Search documents..."
              emptyTitle="No Documents"
              emptyDescription="You haven't uploaded any documents yet."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}