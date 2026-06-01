"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { getApplications, submitApplication } from "@/services/application-actions";
import { getPrograms } from "@/services/program-actions";
import { FileText, Plus, Eye, Upload } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function CitizenApplicationsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [applications, setApplications] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [session?.user?.id]);

  async function loadData() {
    if (!session?.user?.id) return;
    const [appsResult, progsResult] = await Promise.all([
      getApplications(session.user.id),
      getPrograms(),
    ]);
    if (appsResult.applications) setApplications(appsResult.applications);
    if (progsResult.programs) setPrograms(progsResult.programs.filter((p: any) => p.status === "ACTIVE"));
    setIsLoading(false);
  }

  async function handleSubmitApplication() {
    if (!selectedProgram || !session?.user?.id) return;
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("programId", selectedProgram);
    const result = await submitApplication(session.user.id, formData);
    setIsSubmitting(false);
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Application submitted successfully!" });
      setShowApplyDialog(false);
      setSelectedProgram("");
      loadData();
    }
  }

  const columns = [
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
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/citizen/applications/${item.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Applications"
        description="View and manage your assistance applications"
        actions={
          <Button onClick={() => setShowApplyDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Application
          </Button>
        }
      />

      <Card>
        <CardContent className="pt-6">
          <DataTable
            columns={columns}
            data={applications}
            isLoading={isLoading}
            searchKey="program"
            searchPlaceholder="Search by program..."
            emptyTitle="No Applications"
            emptyDescription="You haven't submitted any applications yet."
          />
        </CardContent>
      </Card>

      {/* Apply Dialog */}
      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Submit New Application</DialogTitle>
            <DialogDescription>
              Select a program to apply for assistance.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {programs.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No active programs available at this time.
              </p>
            ) : (
              <div className="space-y-2">
                {programs.map((program) => (
                  <div
                    key={program.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedProgram === program.id
                        ? "border-primary bg-primary/5"
                        : "hover:bg-accent"
                    }`}
                    onClick={() => setSelectedProgram(program.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{program.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {program.description}
                        </p>
                      </div>
                      {selectedProgram === program.id && (
                        <div className="h-4 w-4 rounded-full bg-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button
              className="w-full"
              disabled={!selectedProgram || isSubmitting}
              onClick={handleSubmitApplication}
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}