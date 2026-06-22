import type { ReactNode } from "react";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
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