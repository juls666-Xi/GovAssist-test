"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/utils";
import { getApplications, createSchedule } from "@/services/application-actions";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Calendar, Plus, MapPin, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function StaffSchedulesPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedApp, setSelectedApp] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const result = await getApplications();
    if (result.applications) {
      setApplications(result.applications);
      const allSchedules = result.applications.flatMap((app: any) =>
        (app.schedules || []).map((schedule: any) => ({
          ...schedule,
          applicantName: app.user?.fullName,
          programTitle: app.program?.title,
        }))
      ).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setSchedules(allSchedules);
    }
    setIsLoading(false);
  }

  async function handleCreateSchedule() {
    if (!session?.user?.id || !selectedApp || !date || !time || !location) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("applicationId", selectedApp);
    formData.append("date", date);
    formData.append("time", time);
    formData.append("location", location);

    const result = await createSchedule(session.user.id, formData);
    setIsSubmitting(false);

    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Schedule created successfully" });
      setShowDialog(false);
      setSelectedApp(""); setDate(""); setTime(""); setLocation("");
      loadData();
    }
  }

  const columns = [
    { key: "applicant", header: "Applicant", cell: (item: any) => item.applicantName || "N/A" },
    { key: "program", header: "Program", cell: (item: any) => item.programTitle || "N/A" },
    { key: "date", header: "Date", cell: (item: any) => <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />{formatDate(item.date)}</div> },
    { key: "time", header: "Time", cell: (item: any) => <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />{item.time}</div> },
    { key: "location", header: "Location", cell: (item: any) => <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{item.location}</div> },
    { key: "status", header: "Status", cell: (item: any) => <StatusBadge status={item.status} /> },
  ];

  const approvedApps = applications.filter((app: any) => app.status === "APPROVED");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Schedules"
        description="Manage claim schedules for approved applications"
        actions={
          <Button onClick={() => setShowDialog(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Schedule
          </Button>
        }
      />

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
          ) : (
            <DataTable
              columns={columns}
              data={schedules}
              searchKey="applicantName"
              searchPlaceholder="Search schedules..."
              emptyTitle="No Schedules"
              emptyDescription="No schedules have been created yet."
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Schedule</DialogTitle>
            <DialogDescription>Schedule a claim appointment for an approved application.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Application</Label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={selectedApp} onChange={(e) => setSelectedApp(e.target.value)}>
                <option value="">Select an application</option>
                {approvedApps.map((app: any) => (
                  <option key={app.id} value={app.id}>{app.user?.fullName} - {app.program?.title}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2"><Label>Date</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
            <div className="space-y-2"><Label>Time</Label><Input type="time" value={time} onChange={(e) => setTime(e.target.value)} /></div>
            <div className="space-y-2"><Label>Location</Label><Input placeholder="Enter location" value={location} onChange={(e) => setLocation(e.target.value)} /></div>
            <Button className="w-full" disabled={isSubmitting} onClick={handleCreateSchedule}>
              {isSubmitting ? "Creating..." : "Create Schedule"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}