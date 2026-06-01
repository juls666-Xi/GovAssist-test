import { PortalLayout } from "@/components/layout/portal-layout";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PortalLayout>{children}</PortalLayout>;
}