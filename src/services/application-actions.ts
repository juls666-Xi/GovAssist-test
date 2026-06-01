"use server";

import { prisma } from "@/lib/prisma";
import { applicationSubmitSchema, applicationReviewSchema, scheduleSchema } from "@/validators/application";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/audit";

export async function getApplications(userId?: string, status?: string) {
  try {
    const where: any = {};
    if (userId) where.userId = userId;
    if (status) where.status = status;

    const applications = await prisma.application.findMany({
      where,
      include: {
        user: {
          select: { id: true, fullName: true, email: true, phone: true },
        },
        program: true,
        reviewer: {
          select: { id: true, fullName: true },
        },
        documents: true,
        schedules: {
          orderBy: { date: "desc" },
        },
      },
      orderBy: { submittedAt: "desc" },
    });
    return { applications };
  } catch (error) {
    console.error("Get applications error:", error);
    return { error: "Failed to fetch applications" };
  }
}

export async function getApplicationById(id: string) {
  try {
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, fullName: true, email: true, phone: true, address: true },
        },
        program: true,
        reviewer: {
          select: { id: true, fullName: true },
        },
        documents: true,
        schedules: {
          orderBy: { date: "desc" },
        },
      },
    });
    return { application };
  } catch (error) {
    console.error("Get application error:", error);
    return { error: "Failed to fetch application" };
  }
}

export async function submitApplication(userId: string, formData: FormData) {
  try {
    const rawData = {
      programId: formData.get("programId") as string,
    };

    const validatedData = applicationSubmitSchema.safeParse(rawData);
    if (!validatedData.success) {
      return { error: validatedData.error.errors[0].message };
    }

    // Check if user already has pending application for this program
    const existingApplication = await prisma.application.findFirst({
      where: {
        userId,
        programId: validatedData.data.programId,
        status: { in: ["PENDING", "REVIEWING"] },
      },
    });

    if (existingApplication) {
      return { error: "You already have an active application for this program" };
    }

    const application = await prisma.application.create({
      data: {
        userId,
        programId: validatedData.data.programId,
        status: "PENDING",
      },
      include: {
        program: true,
      },
    });

    // Create notification for user
    await prisma.notification.create({
      data: {
        userId,
        title: "Application Submitted",
        message: `Your application for ${application.program.title} has been submitted successfully.`,
      },
    });

    await createAuditLog({
      userId,
      action: "APPLICATION_SUBMITTED",
      targetTable: "applications",
      targetId: application.id,
    });

    revalidatePath("/citizen/applications");
    return { success: true, application };
  } catch (error) {
    console.error("Submit application error:", error);
    return { error: "Failed to submit application" };
  }
}

export async function reviewApplication(
  staffId: string,
  applicationId: string,
  formData: FormData
) {
  try {
    const rawData = {
      status: formData.get("status") as string,
      remarks: formData.get("remarks") as string,
    };

    const validatedData = applicationReviewSchema.safeParse(rawData);
    if (!validatedData.success) {
      return { error: validatedData.error.errors[0].message };
    }

    const application = await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: validatedData.data.status as any,
        remarks: validatedData.data.remarks || null,
        reviewedAt: new Date(),
        reviewedBy: staffId,
      },
      include: {
        user: true,
        program: true,
      },
    });

    // Create notification for applicant
    const statusMessages: Record<string, string> = {
      REVIEWING: "is now under review",
      APPROVED: "has been approved",
      REJECTED: "has been rejected",
      CLAIMED: "has been marked as claimed",
    };

    await prisma.notification.create({
      data: {
        userId: application.userId,
        title: `Application ${validatedData.data.status}`,
        message: `Your application for ${application.program.title} ${statusMessages[validatedData.data.status] || "has been updated"}.${validatedData.data.remarks ? ` Remarks: ${validatedData.data.remarks}` : ""}`,
      },
    });

    await createAuditLog({
      userId: staffId,
      action: `APPLICATION_${validatedData.data.status}`,
      targetTable: "applications",
      targetId: applicationId,
    });

    revalidatePath("/staff/applications");
    revalidatePath("/citizen/applications");
    return { success: true, application };
  } catch (error) {
    console.error("Review application error:", error);
    return { error: "Failed to review application" };
  }
}

export async function addDocument(applicationId: string, fileName: string, fileUrl: string, fileType: string) {
  try {
    const document = await prisma.document.create({
      data: {
        applicationId,
        fileName,
        fileUrl,
        fileType,
      },
    });

    revalidatePath("/citizen/documents");
    return { success: true, document };
  } catch (error) {
    console.error("Add document error:", error);
    return { error: "Failed to add document" };
  }
}

export async function verifyDocument(staffId: string, documentId: string, verified: boolean) {
  try {
    const document = await prisma.document.update({
      where: { id: documentId },
      data: { verified },
    });

    await createAuditLog({
      userId: staffId,
      action: verified ? "DOCUMENT_VERIFIED" : "DOCUMENT_UNVERIFIED",
      targetTable: "documents",
      targetId: documentId,
    });

    return { success: true, document };
  } catch (error) {
    console.error("Verify document error:", error);
    return { error: "Failed to verify document" };
  }
}

export async function createSchedule(staffId: string, formData: FormData) {
  try {
    const rawData = {
      applicationId: formData.get("applicationId") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      location: formData.get("location") as string,
    };

    const validatedData = scheduleSchema.safeParse(rawData);
    if (!validatedData.success) {
      return { error: validatedData.error.errors[0].message };
    }

    const schedule = await prisma.schedule.create({
      data: validatedData.data,
      include: {
        application: {
          include: {
            user: true,
            program: true,
          },
        },
      },
    });

    // Notify applicant
    await prisma.notification.create({
      data: {
        userId: schedule.application.userId,
        title: "Claim Schedule Created",
        message: `A claim schedule has been created for your ${schedule.application.program.title} application on ${new Date(schedule.date).toLocaleDateString()} at ${schedule.time}. Location: ${schedule.location}`,
      },
    });

    await createAuditLog({
      userId: staffId,
      action: "SCHEDULE_CREATED",
      targetTable: "schedules",
      targetId: schedule.id,
    });

    revalidatePath("/staff/schedules");
    return { success: true, schedule };
  } catch (error) {
    console.error("Create schedule error:", error);
    return { error: "Failed to create schedule" };
  }
}

export async function updateScheduleStatus(staffId: string, scheduleId: string, status: string) {
  try {
    const schedule = await prisma.schedule.update({
      where: { id: scheduleId },
      data: { status: status as any },
    });

    await createAuditLog({
      userId: staffId,
      action: `SCHEDULE_${status}`,
      targetTable: "schedules",
      targetId: scheduleId,
    });

    revalidatePath("/staff/schedules");
    return { success: true, schedule };
  } catch (error) {
    console.error("Update schedule error:", error);
    return { error: "Failed to update schedule" };
  }
}