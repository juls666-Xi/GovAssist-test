"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate, formatCurrency } from "@/lib/utils";
import { getPrograms, createProgram, updateProgram, deleteProgram } from "@/services/program-actions";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Plus, Trash2, Pencil, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function AdminProgramsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [programs, setPrograms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingProgram, setEditingProgram] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { loadPrograms(); }, []);

  async function loadPrograms() {
    const result = await getPrograms();
    if (result.programs) setPrograms(result.programs);
    setIsLoading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!session?.user?.id) return;
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    let result;
    if (editingProgram) {
      result = await updateProgram(session.user.id, editingProgram.id, formData);
    } else {
      result = await createProgram(session.user.id, formData);
    }

    setIsSubmitting(false);
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Success", description: editingProgram ? "Program updated" : "Program created" });
      setShowDialog(false);
      setEditingProgram(null);
      loadPrograms();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure?")) return;
    if (!session?.user?.id) return;
    const result = await deleteProgram(session.user.id, id);
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Program deleted" });
      loadPrograms();
    }
  }

  function openEdit(program: any) {
    setEditingProgram(program);
    setShowDialog(true);
  }

  function openCreate() {
    setEditingProgram(null);
    setShowDialog(true);
  }

  const columns = [
    { key: "title", header: "Title", cell: (item: any) => item.title },
    { key: "budget", header: "Budget", cell: (item: any) => formatCurrency(Number(item.budget)) },
    { key: "status", header: "Status", cell: (item: any) => <StatusBadge status={item.status} /> },
    { key: "applications", header: "Applications", cell: (item: any) => item._count?.applications || 0 },
    { key: "created", header: "Created", cell: (item: any) => formatDate(item.createdAt) },
    { key: "actions", header: "Actions", cell: (item: any) => (
      <div className="flex gap-1">
        <Button variant="ghost" size="sm" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Program Management" description="Manage assistance programs" actions={
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Add Program</Button>
      } />

      <Card>
        <CardContent className="pt-6">
          {isLoading ? <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div> : (
            <DataTable columns={columns} data={programs} searchKey="title" searchPlaceholder="Search programs..."
              emptyTitle="No Programs" emptyDescription="No programs found." />
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={(open) => { setShowDialog(open); if (!open) setEditingProgram(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingProgram ? "Edit Program" : "Create Program"}</DialogTitle>
            <DialogDescription>{editingProgram ? "Update program details." : "Add a new assistance program."}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2"><Label>Title</Label><Input name="title" defaultValue={editingProgram?.title} required /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea name="description" defaultValue={editingProgram?.description} rows={3} required /></div>
            <div className="space-y-2"><Label>Requirements</Label><Textarea name="requirements" defaultValue={editingProgram?.requirements} rows={3} required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Budget</Label><Input name="budget" type="number" step="0.01" defaultValue={editingProgram?.budget || ""} /></div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select name="status" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue={editingProgram?.status || "ACTIVE"}>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Saving..." : (editingProgram ? "Update Program" : "Create Program")}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}