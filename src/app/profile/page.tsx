"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { RoleBadge } from "@/components/ui/role-badge";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { getCurrentUserProfile, updateProfile, changePassword } from "@/services/auth-actions";
import { useUploadThing } from "@/lib/uploadthing-react";
import { Camera, Loader2, Mail, Phone, MapPin, Calendar, FileText, Save, KeyRound } from "lucide-react";

interface ProfileData {
  id: string;
  fullName: string;
  email: string;
  username: string;
  role: string;
  phone: string | null;
  address: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  _count: { applications: number };
}

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const [form, setForm] = useState({ fullName: "", phone: "", address: "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    loadProfile();
  }, [session?.user?.id]);

  async function loadProfile() {
    if (!session?.user?.id) return;
    const result = await getCurrentUserProfile(session.user.id);
    if (result.user) {
      setProfile(result.user as ProfileData);
      setForm({
        fullName: result.user.fullName,
        phone: result.user.phone || "",
        address: result.user.address || "",
      });
    } else if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
    setIsLoading(false);
  }

  const { startUpload } = useUploadThing("profileImage", {
    onUploadBegin: () => setIsUploadingAvatar(true),
    onClientUploadComplete: async (res) => {
      const url = res?.[0]?.url;
      setIsUploadingAvatar(false);
      if (!url || !session?.user?.id) return;

      const fd = new FormData();
      fd.set("fullName", profile?.fullName || "");
      fd.set("phone", profile?.phone || "");
      fd.set("address", profile?.address || "");
      fd.set("avatarUrl", url);

      const result = await updateProfile(session.user.id, fd);
      if (result.success) {
        setProfile((prev) => (prev ? { ...prev, avatarUrl: url } : prev));
        await updateSession({ image: url });
        toast({ title: "Photo updated", description: "Your profile photo has been updated." });
      } else {
        toast({ title: "Upload failed", description: result.error, variant: "destructive" });
      }
    },
    onUploadError: (error) => {
      setIsUploadingAvatar(false);
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    },
  });

  function handleAvatarClick() {
    fileInputRef.current?.click();
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) startUpload([file]);
    e.target.value = "";
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!session?.user?.id) return;
    setIsSaving(true);

    const fd = new FormData();
    fd.set("fullName", form.fullName);
    fd.set("phone", form.phone);
    fd.set("address", form.address);

    const result = await updateProfile(session.user.id, fd);
    setIsSaving(false);

    if (result.success) {
      setProfile((prev) => (prev ? { ...prev, ...result.user } as ProfileData : prev));
      if (form.fullName !== session.user.name) {
        await updateSession({ name: form.fullName });
      }
      toast({ title: "Profile updated", description: result.message });
    } else {
      toast({ title: "Update failed", description: result.error, variant: "destructive" });
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!session?.user?.id) return;
    setIsChangingPassword(true);

    const fd = new FormData();
    fd.set("currentPassword", passwordForm.currentPassword);
    fd.set("newPassword", passwordForm.newPassword);
    fd.set("confirmNewPassword", passwordForm.confirmNewPassword);

    const result = await changePassword(session.user.id, fd);
    setIsChangingPassword(false);

    if (result.success) {
      setPasswordForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
      toast({ title: "Password changed", description: result.message });
    } else {
      toast({ title: "Change failed", description: result.error, variant: "destructive" });
    }
  }

  function getInitials(name?: string) {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <PageHeader title="Profile" />
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            We couldn't load your profile. Please try refreshing the page.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="My Profile" description="Manage your account information and security settings" />

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                {profile.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={profile.fullName} />}
                <AvatarFallback className="text-2xl">{getInitials(profile.fullName)}</AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={handleAvatarClick}
                disabled={isUploadingAvatar}
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60"
                aria-label="Change profile photo"
              >
                {isUploadingAvatar ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h2 className="text-2xl font-bold">{profile.fullName}</h2>
                <RoleBadge role={profile.role} />
              </div>
              <p className="text-muted-foreground">@{profile.username}</p>
              <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground pt-1">
                <span className="flex items-center justify-center sm:justify-start gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> {profile.email}
                </span>
                {profile.phone && (
                  <span className="flex items-center justify-center sm:justify-start gap-1.5">
                    <Phone className="h-3.5 w-3.5" /> {profile.phone}
                  </span>
                )}
                <span className="flex items-center justify-center sm:justify-start gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> Member since {formatDate(profile.createdAt)}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-1 rounded-lg border px-6 py-3">
              <FileText className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{profile._count.applications}</span>
              <span className="text-xs text-muted-foreground">Applications</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Profile Information</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your name, phone number, and address</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      required
                      minLength={2}
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={profile.email} disabled />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="09XX XXX XXXX"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" value={profile.username} disabled />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> Address
                  </Label>
                  <Textarea
                    id="address"
                    placeholder="House/Unit No., Street, Barangay, City"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                    minLength={8}
                  />
                  <p className="text-xs text-muted-foreground">
                    At least 8 characters, with uppercase, lowercase, a number, and a special character.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                  <Input
                    id="confirmNewPassword"
                    type="password"
                    value={passwordForm.confirmNewPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
                    required
                    minLength={8}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isChangingPassword}>
                    {isChangingPassword ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <KeyRound className="mr-2 h-4 w-4" />
                    )}
                    Update Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}