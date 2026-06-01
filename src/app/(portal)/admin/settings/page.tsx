"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Save, Shield, Bell, Database, Mail } from "lucide-react";

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    appName: "GovAssist",
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true,
    autoApprove: false,
  });

  function handleSave() {
    toast({ title: "Settings Saved", description: "Your settings have been updated successfully." });
  }

  return (
    <div className="space-y-6">
      <PageHeader title="System Settings" description="Configure GovAssist system settings" />

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Application Name</Label>
              <Input value={settings.appName} onChange={(e) => setSettings({ ...settings, appName: e.target.value })} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Maintenance Mode</p>
                <p className="text-sm text-muted-foreground">Disable public access to the site</p>
              </div>
              <Switch checked={settings.maintenanceMode} onCheckedChange={(v) => setSettings({ ...settings, maintenanceMode: v })} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Allow Registration</p>
                <p className="text-sm text-muted-foreground">Enable new user registration</p>
              </div>
              <Switch checked={settings.allowRegistration} onCheckedChange={(v) => setSettings({ ...settings, allowRegistration: v })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Send email notifications to users</p>
              </div>
              <Switch checked={settings.emailNotifications} onCheckedChange={(v) => setSettings({ ...settings, emailNotifications: v })} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-Approve Applications</p>
                <p className="text-sm text-muted-foreground">Automatically approve all applications</p>
              </div>
              <Switch checked={settings.autoApprove} onCheckedChange={(v) => setSettings({ ...settings, autoApprove: v })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Database Connection</Label>
              <Input value="postgresql://localhost:5432/govassist" disabled />
            </div>
            <div className="space-y-2">
              <Label>Backup Schedule</Label>
              <Input value="Daily at 2:00 AM" disabled />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>SMTP Host</Label>
              <Input placeholder="smtp.example.com" />
            </div>
            <div className="space-y-2">
              <Label>SMTP Port</Label>
              <Input placeholder="587" />
            </div>
            <div className="space-y-2">
              <Label>From Email</Label>
              <Input placeholder="noreply@govassist.gov" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}