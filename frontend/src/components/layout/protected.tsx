"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useAuth((s) => s.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  return <>{children}</>;
}

export function Protected({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const { user, hydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    if (!user) router.replace("/login");
    else if (adminOnly && !user.is_admin) router.replace("/dashboard");
  }, [user, hydrated, adminOnly, router]);

  if (!hydrated || !user || (adminOnly && !user.is_admin)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07090d] text-zinc-400">
        Loading…
      </div>
    );
  }

  return <>{children}</>;
}
