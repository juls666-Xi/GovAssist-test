export const USER_ROLES = {
  CITIZEN: "CITIZEN",
  STAFF: "STAFF",
  ADMIN: "ADMIN",
} as const;

export const APPLICATION_STATUSES = {
  PENDING: "PENDING",
  REVIEWING: "REVIEWING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  CLAIMED: "CLAIMED",
} as const;

export const PROGRAM_STATUSES = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  CLOSED: "CLOSED",
} as const;

export const SCHEDULE_STATUSES = {
  SCHEDULED: "SCHEDULED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export const STATUS_COLORS = {
  PENDING: "bg-amber-100 text-amber-800 border-amber-200",
  REVIEWING: "bg-blue-100 text-blue-800 border-blue-200",
  APPROVED: "bg-green-100 text-green-800 border-green-200",
  REJECTED: "bg-red-100 text-red-800 border-red-200",
  CLAIMED: "bg-purple-100 text-purple-800 border-purple-200",
  ACTIVE: "bg-green-100 text-green-800 border-green-200",
  INACTIVE: "bg-gray-100 text-gray-800 border-gray-200",
  CLOSED: "bg-red-100 text-red-800 border-red-200",
  SCHEDULED: "bg-blue-100 text-blue-800 border-blue-200",
  COMPLETED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
} as const;

export const STATUS_LABELS = {
  PENDING: "Pending",
  REVIEWING: "Under Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CLAIMED: "Claimed",
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  CLOSED: "Closed",
  SCHEDULED: "Scheduled",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
} as const;

export const ROLE_COLORS = {
  CITIZEN: "bg-blue-100 text-blue-800",
  STAFF: "bg-purple-100 text-purple-800",
  ADMIN: "bg-red-100 text-red-800",
} as const;

export const ROLE_LABELS = {
  CITIZEN: "Citizen",
  STAFF: "Staff",
  ADMIN: "Administrator",
} as const;

export const NAV_LINKS = {
  public: [
    { label: "Home", href: "/" },
    { label: "Programs", href: "/programs" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  citizen: [
    { label: "Dashboard", href: "/citizen/dashboard", icon: "LayoutDashboard" },
    { label: "My Applications", href: "/citizen/applications", icon: "FileText" },
    { label: "Documents", href: "/citizen/documents", icon: "FileCheck" },
    { label: "Notifications", href: "/citizen/notifications", icon: "Bell" },
    { label: "Schedules", href: "/citizen/schedules", icon: "Calendar" },
  ],
  staff: [
    { label: "Dashboard", href: "/staff/dashboard", icon: "LayoutDashboard" },
    { label: "Applications", href: "/staff/applications", icon: "FileText" },
    { label: "Search", href: "/staff/search", icon: "Search" },
    { label: "Schedules", href: "/staff/schedules", icon: "Calendar" },
  ],
  admin: [
    { label: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard" },
    { label: "Users", href: "/admin/users", icon: "Users" },
    { label: "Staff", href: "/admin/staff", icon: "UserCog" },
    { label: "Programs", href: "/admin/programs", icon: "Briefcase" },
    { label: "Reports", href: "/admin/reports", icon: "BarChart3" },
    { label: "Audit Logs", href: "/admin/audit-logs", icon: "ClipboardList" },
    { label: "Settings", href: "/admin/settings", icon: "Settings" },
  ],
} as const;

export const ITEMS_PER_PAGE = 10;

export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const APP_NAME = "GovAssist";
export const APP_DESCRIPTION = "Government Assistance and Document Management System";
export const APP_VERSION = "1.0.0";