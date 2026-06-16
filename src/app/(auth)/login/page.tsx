"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";

export default function LoginPage() {
  const router = useRouter();
  const { openAuth } = useAuth();

  useEffect(() => {
    openAuth("login");
    router.replace("/");
  }, [openAuth, router]);

  return null;
}