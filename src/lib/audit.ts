"use server";

import { prisma } from "./prisma";
import { headers } from "next/headers";

export async function createAuditLog({
  userId,
  action,
  targetTable,
  targetId,
}: {
  userId: string;
  action: string;
  targetTable: string;
  targetId?: string;
}) {
  try {
    const headersList = await headers();
    const ipAddress = headersList.get("x-forwarded-for") || 
                      headersList.get("x-real-ip") || 
                      "unknown";

    await prisma.auditLog.create({
      data: {
        userId,
        action,
        targetTable,
        targetId: targetId || null,
        ipAddress: ipAddress.split(",")[0].trim(),
      },
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
  }
}