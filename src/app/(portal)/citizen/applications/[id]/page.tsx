"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatDateTime } from "@/lib/utils";
import { getApplicationById } from "@/services/application-actions";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import {
  FileText,
  Calendar,
  CheckCircle,
  Download,
} from "lucide-react";

export default function CitizenApplicationDetailPage() {
  const params = useParams();
  const [application, setApplication] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadApplication();
  }, [params.id]);

  async function loadApplication() {
    if (!params.id) return;
    const result = await getApplicationById(params.id as string);
    if (result.application) setApplication(result.application);
    setIsLoading(false);
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!application) {
    return (
      <EmptyState
        title="Application Not Found"
        description="The application you are looking for does not exist."
        icon="search"
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Application Details"
        description={`Application for ${application.program?.title}`}
        backHref="/citizen/applications"
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Application Information</CardTitle>
                <StatusBadge status={application.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Program</p>
                  <p className="font-medium">{application.program?.title}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                  <p className="font-medium">{formatDateTime(application.submittedAt)}</p>
                </div>
                {application.reviewedAt && (
                  <div>
                    <p className="text-sm text-muted-foreground">Reviewed</p>
                    <p className="font-medium">{formatDateTime(application.reviewedAt)}</p>
                  </div>
                )}
                {application.reviewer && (
                  <div>
                    <p className="text-sm text-muted-foreground">Reviewed By</p>
                    <p className="font-medium">{application.reviewer.fullName}</p>
                  </div>
                )}
              </div>
              {application.remarks && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Remarks</p>
                  <p className="text-sm">{application.remarks}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              {application.documents?.length > 0 ? (
                <div className="space-y-3">
                  {application.documents.map((doc: any) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium text-sm">{doc.fileName}</p>
                          <p className="text-xs text-muted-foreground">
                            Uploaded {formatDate(doc.uploadedAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={doc.verified ? "default" : "secondary"}>
                          {doc.verified ? "Verified" : "Pending"}
                        </Badge>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No Documents"
                  description="No documents have been uploaded for this application."
                  icon="file"
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Program Details */}
          <Card>
            <CardHeader>
              <CardTitle>Program Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-sm">{application.program?.description}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Requirements</p>
                <div className="text-sm whitespace-pre-line">
                  {application.program?.requirements}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Schedules
              </CardTitle>
            </CardHeader>
            <CardContent>
              {application.schedules?.length > 0 ? (
                <div className="space-y-3">
                  {application.schedules.map((schedule: any) => (
                    <div key={schedule.id} className="p-3 rounded-lg border">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">
                          {formatDate(schedule.date)}
                        </span>
                        <StatusBadge status={schedule.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">{schedule.time}</p>
                      <p className="text-sm text-muted-foreground">{schedule.location}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No schedules yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}