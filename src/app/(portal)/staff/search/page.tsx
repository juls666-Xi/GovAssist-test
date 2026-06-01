"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { formatDate } from "@/lib/utils";
import { getUsers } from "@/services/admin-actions";
import { Search, Eye } from "lucide-react";
import Link from "next/link";

export default function StaffSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  async function handleSearch() {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const result = await getUsers("CITIZEN", searchQuery);
    if (result.users) setResults(result.users);
    setIsSearching(false);
  }

  const columns = [
    {
      key: "name",
      header: "Name",
      cell: (item: any) => (
        <div>
          <p className="font-medium">{item.fullName}</p>
          <p className="text-xs text-muted-foreground">{item.email}</p>
        </div>
      ),
    },
    {
      key: "username",
      header: "Username",
      cell: (item: any) => item.username,
    },
    {
      key: "phone",
      header: "Phone",
      cell: (item: any) => item.phone || "N/A",
    },
    {
      key: "applications",
      header: "Applications",
      cell: (item: any) => item._count?.applications || 0,
    },
    {
      key: "joined",
      header: "Joined",
      cell: (item: any) => formatDate(item.createdAt),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (item: any) => (
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/staff/search/${item.id}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Search Applicants"
        description="Search for citizens by name, email, or username"
      />

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>

          {results.length > 0 && (
            <DataTable
              columns={columns}
              data={results}
              searchKey="fullName"
              searchPlaceholder="Filter results..."
              emptyTitle="No Results"
              emptyDescription="No citizens found matching your search."
            />
          )}

          {results.length === 0 && !isSearching && searchQuery && (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2" />
              <p>No results found for &quot;{searchQuery}&quot;</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}