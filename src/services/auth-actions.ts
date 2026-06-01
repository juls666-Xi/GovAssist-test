"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registerSchema, profileUpdateSchema, passwordChangeSchema } from "@/validators/auth";
import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

export async function registerUser(formData: FormData) {
  try {
    const rawData = {
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      username: formData.get("username") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
      phone: formData.get("phone") as string || undefined,
      address: formData.get("address") as string || undefined,
    };

    const validatedData = registerSchema.safeParse(rawData);
    if (!validatedData.success) {
      return { error: validatedData.error.errors[0].message };
    }

    const { fullName, email, username, password, phone, address } = validatedData.data;

    // Check if email exists
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail) {
      return { error: "Email already registered" };
    }

    // Check if username exists
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUsername) {
      return { error: "Username already taken" };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        username,
        passwordHash: hashedPassword,
        phone: phone || null,
        address: address || null,
      },
    });

    // Create welcome notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: "Welcome to GovAssist",
        message: `Welcome ${fullName}! Your account has been created successfully. You can now apply for assistance programs.`,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "USER_REGISTERED",
        targetTable: "users",
        targetId: user.id,
      },
    });

    return { success: true, message: "Account created successfully! Please sign in." };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

export async function loginUser(formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
}

export async function logoutUser() {
  await signOut({ redirectTo: "/" });
}

export async function updateProfile(userId: string, formData: FormData) {
  try {
    const rawData = {
      fullName: formData.get("fullName") as string,
      phone: formData.get("phone") as string || undefined,
      address: formData.get("address") as string || undefined,
    };

    const validatedData = profileUpdateSchema.safeParse(rawData);
    if (!validatedData.success) {
      return { error: validatedData.error.errors[0].message };
    }

    await prisma.user.update({
      where: { id: userId },
      data: validatedData.data,
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: "PROFILE_UPDATED",
        targetTable: "users",
        targetId: userId,
      },
    });

    revalidatePath("/citizen/dashboard");
    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    console.error("Profile update error:", error);
    return { error: "Failed to update profile" };
  }
}

export async function changePassword(userId: string, formData: FormData) {
  try {
    const rawData = {
      currentPassword: formData.get("currentPassword") as string,
      newPassword: formData.get("newPassword") as string,
      confirmNewPassword: formData.get("confirmNewPassword") as string,
    };

    const validatedData = passwordChangeSchema.safeParse(rawData);
    if (!validatedData.success) {
      return { error: validatedData.error.errors[0].message };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { error: "User not found" };
    }

    const isValid = await bcrypt.compare(validatedData.data.currentPassword, user.passwordHash);
    if (!isValid) {
      return { error: "Current password is incorrect" };
    }

    const hashedPassword = await bcrypt.hash(validatedData.data.newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedPassword },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: "PASSWORD_CHANGED",
        targetTable: "users",
        targetId: userId,
      },
    });

    return { success: true, message: "Password changed successfully" };
  } catch (error) {
    console.error("Password change error:", error);
    return { error: "Failed to change password" };
  }
}