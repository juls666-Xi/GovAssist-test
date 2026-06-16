"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";

export default function RegisterPage() {
  const router = useRouter();
  const { openAuth } = useAuth();

  useEffect(() => {
    openAuth("register");
    router.replace("/");
  }, [openAuth, router]);

  return null;
}