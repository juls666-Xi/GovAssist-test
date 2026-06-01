"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/ui/data-table";
import { RoleBadge } from "@/components/ui/role-badge";
import { formatDate } from "@/lib/utils";
import { getUsers, createUser, deleteUser } from "@/services/admin-actions";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Plus, Trash2, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function AdminStaffPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [staff, setStaff] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { loadStaff(); }, []);

  async function loadStaff() {
    const result = await getUsers("STAFF");
    if (result.users) setStaff(result.users);
    setIsLoading(false);
  }

  async function handleCreateStaff(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!session?.user?.id) return;
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.append("role", "STAFF");
    const result = await createUser(session.user.id, formData);
    setIsSubmitting(false);
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Staff member created successfully" });
      setShowDialog(false);
      loadStaff();
    }
  }

  async function handleDelete(userId: string) {
    if (!confirm("Are you sure?")) return;
    if (!session?.user?.id) return;
    const result = await deleteUser(session.user.id, userId);
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Staff member deleted" });
      loadStaff();
    }
  }

  const columns = [
    { key: "name", header: "Name", cell: (item: any) => <div><p className="font-medium">{item.fullName}</p><p className="text-xs text-muted-foreground">{item.email}</p></div> },
    { key: "username", header: "Username", cell: (item: any) => item.username },
    { key: "phone", header: "Phone", cell: (item: any) => item.phone || "N/A" },
    { key: "joined", header: "Joined", cell: (item: any) => formatDate(item.createdAt) },
    { key: "actions", header: "Actions", cell: (item: any) => (
      <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Staff Management" description="Manage staff members" actions={
        <Button onClick={() => setShowDialog(true)}><Plus className="mr-2 h-4 w-4" /> Add Staff</Button>
      } />

      <Card>
        <CardContent className="pt-6">
          {isLoading ? <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div> : (
            <DataTable columns={columns} data={staff} searchKey="fullName" searchPlaceholder="Search staff..."
              emptyTitle="No Staff" emptyDescription="No staff members found." />
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add Staff Member</DialogTitle><DialogDescription>Create a new staff account.</DialogDescription></DialogHeader>
          <form onSubmit={handleCreateStaff} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Full Name</Label><Input name="fullName" required /></div>
              <div className="space-y-2"><Label>Username</Label><Input name="username" required /></div>
            </div>
            <div className="space-y-2"><Label>Email</Label><Input name="email" type="email" required /></div>
            <div className="space-y-2"><Label>Password</Label><Input name="password" type="password" required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Phone</Label><Input name="phone" /></div>
              <div className="space-y-2"><Label>Address</Label><Input name="address" /></div>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create Staff"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}