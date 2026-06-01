"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/stats-card";
import { getDashboardStats, getApplicationStats } from "@/services/admin-actions";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FileText, Users, CheckCircle, XCircle, Clock, Briefcase } from "lucide-react";

export default function AdminReportsPage() {
  const [stats, setStats] = useState<any>(null);
  const [appStats, setAppStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  async function loadStats() {
    const [dashResult, appResult] = await Promise.all([
      getDashboardStats(),
      getApplicationStats(),
    ]);
    if (dashResult.stats) setStats(dashResult.stats);
    if (appResult.statusCounts) setAppStats(appResult);
    setIsLoading(false);
  }

  if (isLoading) {
    return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Reports & Analytics" description="System-wide statistics and insights" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Users" value={stats?.totalUsers || 0} icon={Users} />
        <StatsCard title="Total Applications" value={stats?.totalApplications || 0} icon={FileText} />
        <StatsCard title="Active Programs" value={stats?.totalPrograms || 0} icon={Briefcase} />
        <StatsCard title="Pending" value={stats?.pendingApplications || 0} icon={Clock} />
        <StatsCard title="Approved" value={stats?.approvedApplications || 0} icon={CheckCircle} />
        <StatsCard title="Rejected" value={stats?.rejectedApplications || 0} icon={XCircle} />
        <StatsCard title="Citizens" value={stats?.totalCitizens || 0} icon={Users} />
        <StatsCard title="Staff" value={stats?.totalStaff || 0} icon={Users} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Applications by Status</CardTitle></CardHeader>
          <CardContent>
            {appStats?.statusCounts?.length > 0 ? (
              <div className="space-y-3">
                {appStats.statusCounts.map((item: any) => (
                  <div key={item.name} className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-lg font-bold">{item.count}</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-muted-foreground text-center py-4">No data available</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Top Programs by Applications</CardTitle></CardHeader>
          <CardContent>
            {appStats?.programStats?.length > 0 ? (
              <div className="space-y-3">
                {appStats.programStats.map((item: any) => (
                  <div key={item.name} className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-lg font-bold">{item.count}</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-muted-foreground text-center py-4">No data available</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}