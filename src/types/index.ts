export interface User {
  id: string;
  fullName: string;
  email: string;
  username: string;
  role: "CITIZEN" | "STAFF" | "ADMIN";
  phone: string | null;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssistanceProgram {
  id: string;
  title: string;
  description: string;
  requirements: string;
  budget: number | null;
  status: "ACTIVE" | "INACTIVE" | "CLOSED";
  createdAt: Date;
  updatedAt: Date;
  _count?: { applications: number };
}

export interface Application {
  id: string;
  userId: string;
  programId: string;
  status: "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED" | "CLAIMED";
  remarks: string | null;
  submittedAt: Date;
  reviewedAt: Date | null;
  reviewedBy: string | null;
  user?: User;
  program?: AssistanceProgram;
  reviewer?: User | null;
  documents?: Document[];
  schedules?: Schedule[];
}

export interface Document {
  id: string;
  applicationId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  verified: boolean;
  uploadedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface Schedule {
  id: string;
  applicationId: string;
  date: Date;
  time: string;
  location: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  createdAt: Date;
  updatedAt: Date;
  application?: Application;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  targetTable: string;
  targetId: string | null;
  ipAddress: string | null;
  createdAt: Date;
  user?: User;
}

export interface DashboardStats {
  totalUsers: number;
  totalApplications: number;
  totalPrograms: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  totalCitizens: number;
  totalStaff: number;
  recentApplications: Application[];
  recentAuditLogs: AuditLog[];
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}