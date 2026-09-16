"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Code2,
  Trophy,
  User,
  Medal,
  Settings,
  LogOut,
  Shield,
  FileCode2,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/store/auth";
import { useLang } from "@/store/lang";
import { Button } from "@/components/ui/button";
import { LangSwitch } from "@/components/layout/lang-switch";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { t } = useLang();
  const router = useRouter();

  const links = [
    { href: "/dashboard", label: t.nav.dashboard, icon: LayoutDashboard },
    { href: "/problems", label: t.nav.problems, icon: Code2 },
    { href: "/submissions", label: t.nav.submissions, icon: FileCode2 },
    { href: "/leaderboard", label: t.nav.leaderboard, icon: Trophy },
    { href: "/achievements", label: t.nav.achievements, icon: Medal },
    { href: "/profile", label: t.nav.profile, icon: User },
    { href: "/settings", label: t.nav.settings, icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#07090d] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.08),_transparent_50%),radial-gradient(ellipse_at_bottom_right,_rgba(56,189,248,0.05),_transparent_40%)]" />
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-[#07090d]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
              <Flame className="h-4 w-4" />
            </span>
            <span className="font-[family-name:var(--font-display)] text-lg">
              Code<span className="text-emerald-400">Arena</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-zinc-400 transition hover:bg-zinc-800/60 hover:text-zinc-100",
                    active && "bg-zinc-850 text-emerald-400 font-semibold"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </Link>
              );
            })}
            {user?.is_admin && (
              <Link
                href="/admin"
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-zinc-400 transition hover:bg-zinc-800/60",
                  pathname.startsWith("/admin") && "bg-zinc-800 text-amber-400 font-semibold"
                )}
              >
                <Shield className="h-3.5 w-3.5" />
                {t.nav.admin}
              </Link>
            )}
          </nav>
          <div className="flex items-center gap-2.5">
            {/* Language Switcher */}
            <LangSwitch />

            {user && (
              <div className="hidden text-right text-xs sm:block">
                <div className="font-semibold text-zinc-200">{user.username}</div>
                <div className="text-zinc-500">
                  Lv {user.profile?.level ?? 1} · {user.profile?.xp ?? 0} XP
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                logout();
                router.push("/login");
              }}
              title={t.nav.logout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      <main className="relative mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
