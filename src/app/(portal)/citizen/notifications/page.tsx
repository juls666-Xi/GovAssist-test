"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from "@/services/notification-actions";
import { formatDateTime } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { Bell, Check, Trash2, MailOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CitizenNotificationsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, [session?.user?.id]);

  async function loadNotifications() {
    if (!session?.user?.id) return;
    const result = await getNotifications(session.user.id);
    if (result.notifications) setNotifications(result.notifications);
    setIsLoading(false);
  }

  async function handleMarkAsRead(id: string) {
    const result = await markAsRead(id);
    if (result.success) {
      loadNotifications();
    }
  }

  async function handleMarkAllAsRead() {
    if (!session?.user?.id) return;
    const result = await markAllAsRead(session.user.id);
    if (result.success) {
      toast({ title: "Success", description: "All notifications marked as read" });
      loadNotifications();
    }
  }

  async function handleDelete(id: string) {
    const result = await deleteNotification(id);
    if (result.success) {
      loadNotifications();
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description={`You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`}
        actions={
          unreadCount > 0 && (
            <Button variant="outline" onClick={handleMarkAllAsRead}>
              <MailOpen className="mr-2 h-4 w-4" />
              Mark All as Read
            </Button>
          )
        }
      />

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : notifications.length === 0 ? (
            <EmptyState
              title="No Notifications"
              description="You don't have any notifications yet."
              icon="inbox"
            />
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start justify-between p-4 rounded-lg border transition-colors ${
                    notification.isRead ? "bg-background" : "bg-primary/5 border-primary/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Bell className={`h-5 w-5 mt-0.5 ${notification.isRead ? "text-muted-foreground" : "text-primary"}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{notification.title}</p>
                        {!notification.isRead && (
                          <Badge variant="default" className="text-xs">New</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDateTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(notification.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}