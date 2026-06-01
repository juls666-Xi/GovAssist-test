"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { formatDate, formatDateTime } from "@/lib/utils";
import { getApplicationById, reviewApplication } from "@/services/application-actions";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Calendar,
  Download,
  Save,
} from "lucide-react";

export default function StaffApplicationReviewPage() {
  const params = useParams();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [application, setApplication] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadApplication();
  }, [params.id]);

  async function loadApplication() {
    if (!params.id) return;
    const result = await getApplicationById(params.id as string);
    if (result.application) {
      setApplication(result.application);
      setStatus(result.application.status);
      setRemarks(result.application.remarks || "");
    }
    setIsLoading(false);
  }

  async function handleReview() {
    if (!session?.user?.id || !params.id) return;
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("status", status);
    formData.append("remarks", remarks);

    const result = await reviewApplication(session.user.id, params.id as string, formData);
    setIsSubmitting(false);

    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Application reviewed successfully" });
      loadApplication();
    }
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
        title="Review Application"
        description={`Reviewing application for ${application.program?.title}`}
        backHref="/staff/applications"
      />

      <div className="grid lg:grid-cols-3 gap-6">
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
                  <p className="text-sm text-muted-foreground">Applicant</p>
                  <p className="font-medium">{application.user?.fullName}</p>
                  <p className="text-sm text-muted-foreground">{application.user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{application.user?.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Program</p>
                  <p className="font-medium">{application.program?.title}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                  <p className="font-medium">{formatDateTime(application.submittedAt)}</p>
                </div>
              </div>
              {application.user?.address && (
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{application.user.address}</p>
                </div>
              )}
            </CardContent>
          </Card>

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
                    <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border">
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
                <EmptyState title="No Documents" description="No documents have been uploaded." icon="file" />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Review Decision</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="REVIEWING">Reviewing</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                    <SelectItem value="CLAIMED">Claimed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Add your review remarks here..."
                  rows={4}
                />
              </div>
              <Button onClick={handleReview} disabled={isSubmitting} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save Review"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Program Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-sm">{application.program?.description}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Requirements</p>
                <div className="text-sm whitespace-pre-line">{application.program?.requirements}</div>
              </div>
            </CardContent>
          </Card>

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
                        <span className="font-medium text-sm">{formatDate(schedule.date)}</span>
                        <StatusBadge status={schedule.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">{schedule.time}</p>
                      <p className="text-sm text-muted-foreground">{schedule.location}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No schedules yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}