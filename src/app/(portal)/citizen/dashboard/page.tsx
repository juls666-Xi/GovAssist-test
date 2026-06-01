import { requireCitizen } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/utils";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Bell,
  Calendar,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CitizenDashboardPage() {
  const session = await requireCitizen();
  const userId = session.user.id;

  const [applications, notifications, schedules, totalPending, totalApproved, totalRejected] =
    await Promise.all([
      prisma.application.findMany({
        where: { userId },
        include: { program: true },
        orderBy: { submittedAt: "desc" },
        take: 5,
      }),
      prisma.notification.findMany({
        where: { userId, isRead: false },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.schedule.findMany({
        where: {
          application: { userId },
          status: "SCHEDULED",
        },
        include: { application: { include: { program: true } } },
        orderBy: { date: "asc" },
        take: 5,
      }),
      prisma.application.count({ where: { userId, status: "PENDING" } }),
      prisma.application.count({ where: { userId, status: "APPROVED" } }),
      prisma.application.count({ where: { userId, status: "REJECTED" } }),
    ]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Citizen Dashboard"
        description={`Welcome back, ${session.user.name}`}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Applications"
          value={applications.length}
          icon={FileText}
        />
        <StatsCard
          title="Pending"
          value={totalPending}
          icon={Clock}
        />
        <StatsCard
          title="Approved"
          value={totalApproved}
          icon={CheckCircle}
        />
        <StatsCard
          title="Rejected"
          value={totalRejected}
          icon={XCircle}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Applications</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/citizen/applications">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                    >
                      <div>
                        <p className="font-medium">{app.program.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Submitted {formatDate(app.submittedAt)}
                        </p>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2" />
                  <p>No applications yet</p>
                  <Button variant="link" asChild className="mt-2">
                    <Link href="/programs">Browse Programs</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Notifications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/citizen/notifications">
                  View All
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="text-sm">
                      <p className="font-medium">{notif.title}</p>
                      <p className="text-muted-foreground line-clamp-2">{notif.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No new notifications
                </p>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Schedules */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Upcoming Schedules
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/citizen/schedules">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {schedules.length > 0 ? (
                <div className="space-y-3">
                  {schedules.map((schedule) => (
                    <div key={schedule.id} className="text-sm">
                      <p className="font-medium">{schedule.application.program.title}</p>
                      <p className="text-muted-foreground">
                        {formatDate(schedule.date)} at {schedule.time}
                      </p>
                      <p className="text-muted-foreground">{schedule.location}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No upcoming schedules
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}