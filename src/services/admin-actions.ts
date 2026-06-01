"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/audit";

export async function getUsers(role?: string, search?: string) {
  try {
    const where: any = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { username: { contains: search, mode: "insensitive" } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fullName: true,
        email: true,
        username: true,
        role: true,
        phone: true,
        address: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { applications: true },
        },
      },
    });
    return { users };
  } catch (error) {
    console.error("Get users error:", error);
    return { error: "Failed to fetch users" };
  }
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        applications: {
          include: {
            program: true,
          },
          orderBy: { submittedAt: "desc" },
        },
        _count: {
          select: { applications: true, notifications: true },
        },
      },
    });
    return { user };
  } catch (error) {
    console.error("Get user error:", error);
    return { error: "Failed to fetch user" };
  }
}

export async function createUser(adminId: string, formData: FormData) {
  try {
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;

    // Check existing
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) return { error: "Email already exists" };

    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) return { error: "Username already exists" };

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        username,
        passwordHash: hashedPassword,
        role: role as any,
        phone: phone || null,
        address: address || null,
      },
    });

    await createAuditLog({
      userId: adminId,
      action: "USER_CREATED",
      targetTable: "users",
      targetId: user.id,
    });

    revalidatePath("/admin/users");
    return { success: true, user };
  } catch (error) {
    console.error("Create user error:", error);
    return { error: "Failed to create user" };
  }
}

export async function updateUser(adminId: string, userId: string, formData: FormData) {
  try {
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName,
        email,
        role: role as any,
        phone: phone || null,
        address: address || null,
      },
    });

    await createAuditLog({
      userId: adminId,
      action: "USER_UPDATED",
      targetTable: "users",
      targetId: userId,
    });

    revalidatePath("/admin/users");
    return { success: true, user };
  } catch (error) {
    console.error("Update user error:", error);
    return { error: "Failed to update user" };
  }
}

export async function deleteUser(adminId: string, userId: string) {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });

    await createAuditLog({
      userId: adminId,
      action: "USER_DELETED",
      targetTable: "users",
      targetId: userId,
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Delete user error:", error);
    return { error: "Failed to delete user" };
  }
}

export async function getAuditLogs(limit?: number, offset?: number) {
  try {
    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        take: limit || 50,
        skip: offset || 0,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { fullName: true, email: true, role: true },
          },
        },
      }),
      prisma.auditLog.count(),
    ]);
    return { logs, total };
  } catch (error) {
    console.error("Get audit logs error:", error);
    return { error: "Failed to fetch audit logs" };
  }
}

export async function getDashboardStats() {
  try {
    const [
      totalUsers,
      totalApplications,
      totalPrograms,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      totalCitizens,
      totalStaff,
      recentApplications,
      recentAuditLogs,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.application.count(),
      prisma.assistanceProgram.count(),
      prisma.application.count({ where: { status: "PENDING" } }),
      prisma.application.count({ where: { status: "APPROVED" } }),
      prisma.application.count({ where: { status: "REJECTED" } }),
      prisma.user.count({ where: { role: "CITIZEN" } }),
      prisma.user.count({ where: { role: "STAFF" } }),
      prisma.application.findMany({
        take: 5,
        orderBy: { submittedAt: "desc" },
        include: {
          user: { select: { fullName: true } },
          program: { select: { title: true } },
        },
      }),
      prisma.auditLog.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { fullName: true, role: true } },
        },
      }),
    ]);

    return {
      stats: {
        totalUsers,
        totalApplications,
        totalPrograms,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
        totalCitizens,
        totalStaff,
        recentApplications,
        recentAuditLogs,
      },
    };
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    return { error: "Failed to fetch dashboard stats" };
  }
}

export async function getApplicationStats() {
  try {
    const [statusCounts, monthlyApplications, programApplications] = await Promise.all([
      prisma.application.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
      prisma.application.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
      prisma.application.groupBy({
        by: ["programId"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 5,
      }),
    ]);

    const programIds = programApplications.map((p) => p.programId);
    const programs = await prisma.assistanceProgram.findMany({
      where: { id: { in: programIds } },
      select: { id: true, title: true },
    });

    const programStats = programApplications.map((pa) => ({
      name: programs.find((p) => p.id === pa.programId)?.title || "Unknown",
      count: pa._count.id,
    }));

    return {
      statusCounts: statusCounts.map((sc) => ({
        name: sc.status,
        count: sc._count.status,
      })),
      programStats,
    };
  } catch (error) {
    console.error("Get application stats error:", error);
    return { error: "Failed to fetch application stats" };
  }
}