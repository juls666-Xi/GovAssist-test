"use server";

import { prisma } from "@/lib/prisma";
import { programSchema, programUpdateSchema } from "@/validators/program";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/audit";

export async function getPrograms() {
  try {
    const programs = await prisma.assistanceProgram.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });
    return { programs };
  } catch (error) {
    console.error("Get programs error:", error);
    return { error: "Failed to fetch programs" };
  }
}

export async function getProgramById(id: string) {
  try {
    const program = await prisma.assistanceProgram.findUnique({
      where: { id },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });
    return { program };
  } catch (error) {
    console.error("Get program error:", error);
    return { error: "Failed to fetch program" };
  }
}

export async function createProgram(userId: string, formData: FormData) {
  try {
    const rawData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      requirements: formData.get("requirements") as string,
      budget: formData.get("budget") ? Number(formData.get("budget")) : undefined,
      status: formData.get("status") as "ACTIVE" | "INACTIVE" | "CLOSED",
    };

    const validatedData = programSchema.safeParse(rawData);
    if (!validatedData.success) {
      return { error: validatedData.error.errors[0].message };
    }

    const program = await prisma.assistanceProgram.create({
      data: validatedData.data,
    });

    await createAuditLog({
      userId,
      action: "PROGRAM_CREATED",
      targetTable: "assistance_programs",
      targetId: program.id,
    });

    revalidatePath("/admin/programs");
    return { success: true, program };
  } catch (error) {
    console.error("Create program error:", error);
    return { error: "Failed to create program" };
  }
}

export async function updateProgram(userId: string, id: string, formData: FormData) {
  try {
    const rawData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      requirements: formData.get("requirements") as string,
      budget: formData.get("budget") ? Number(formData.get("budget")) : undefined,
      status: formData.get("status") as "ACTIVE" | "INACTIVE" | "CLOSED",
    };

    const validatedData = programUpdateSchema.safeParse(rawData);
    if (!validatedData.success) {
      return { error: validatedData.error.errors[0].message };
    }

    const program = await prisma.assistanceProgram.update({
      where: { id },
      data: validatedData.data,
    });

    await createAuditLog({
      userId,
      action: "PROGRAM_UPDATED",
      targetTable: "assistance_programs",
      targetId: id,
    });

    revalidatePath("/admin/programs");
    return { success: true, program };
  } catch (error) {
    console.error("Update program error:", error);
    return { error: "Failed to update program" };
  }
}

export async function deleteProgram(userId: string, id: string) {
  try {
    await prisma.assistanceProgram.delete({
      where: { id },
    });

    await createAuditLog({
      userId,
      action: "PROGRAM_DELETED",
      targetTable: "assistance_programs",
      targetId: id,
    });

    revalidatePath("/admin/programs");
    return { success: true };
  } catch (error) {
    console.error("Delete program error:", error);
    return { error: "Failed to delete program" };
  }
}