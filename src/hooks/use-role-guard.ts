"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./use-auth";

export function useRoleGuard(...allowedRoles: string[]) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!allowedRoles.includes(user.role)) {
      // Redirect to the appropriate dashboard based on role
      if (user.role === "booster") router.replace("/dashboard/booster");
      else if (user.role === "admin") router.replace("/dashboard/admin");
      else router.replace("/dashboard");
    }
  }, [user, loading, router, allowedRoles]);

  return { user, loading, authorized: !loading && user && allowedRoles.includes(user.role) };
}
