import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardRedirectPage() {
  const session = await auth();

  if (!session?.user) redirect("/login");

  if (session.user.role === "ADMIN") redirect("/admin/dashboard");
  if (session.user.role === "STAFF") redirect("/staff/dashboard");

  redirect("/citizen/dashboard");
}
