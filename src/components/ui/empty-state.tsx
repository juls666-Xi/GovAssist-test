"use client";

import { FileX, Inbox, Search, FolderOpen } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: "file" | "inbox" | "search" | "folder";
  action?: React.ReactNode;
}

const icons = {
  file: FileX,
  inbox: Inbox,
  search: Search,
  folder: FolderOpen,
};

export function EmptyState({
  title = "No items found",
  description = "There are no items to display at this time.",
  icon = "inbox",
  action,
}: EmptyStateProps) {
  const Icon = icons[icon];

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}