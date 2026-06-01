import { PortalLayout } from "@/components/layout/portal-layout";

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PortalLayout>{children}</PortalLayout>;
}