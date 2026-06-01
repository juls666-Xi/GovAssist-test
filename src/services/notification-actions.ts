"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getNotifications(userId: string) {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return { notifications };
  } catch (error) {
    console.error("Get notifications error:", error);
    return { error: "Failed to fetch notifications" };
  }
}

export async function getUnreadCount(userId: string) {
  try {
    const count = await prisma.notification.count({
      where: { userId, isRead: false },
    });
    return { count };
  } catch (error) {
    console.error("Get unread count error:", error);
    return { error: "Failed to fetch unread count" };
  }
}

export async function markAsRead(notificationId: string) {
  try {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
    revalidatePath("/citizen/notifications");
    return { success: true };
  } catch (error) {
    console.error("Mark as read error:", error);
    return { error: "Failed to mark as read" };
  }
}

export async function markAllAsRead(userId: string) {
  try {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    revalidatePath("/citizen/notifications");
    return { success: true };
  } catch (error) {
    console.error("Mark all as read error:", error);
    return { error: "Failed to mark all as read" };
  }
}

export async function deleteNotification(notificationId: string) {
  try {
    await prisma.notification.delete({
      where: { id: notificationId },
    });
    revalidatePath("/citizen/notifications");
    return { success: true };
  } catch (error) {
    console.error("Delete notification error:", error);
    return { error: "Failed to delete notification" };
  }
}

export async function sendNotification(staffId: string, userId: string, title: string, message: string) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: staffId,
        action: "NOTIFICATION_SENT",
        targetTable: "notifications",
        targetId: notification.id,
      },
    });

    return { success: true, notification };
  } catch (error) {
    console.error("Send notification error:", error);
    return { error: "Failed to send notification" };
  }
}