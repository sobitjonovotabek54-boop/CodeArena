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
  ShoppingBag,
  Gift,
  Coins,
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
    { href: "/shop", label: t.nav.shop, icon: ShoppingBag },
    { href: "/referrals", label: t.nav.invite, icon: Gift },
    { href: "/profile", label: t.nav.profile, icon: User },
    { href: "/settings", label: t.nav.settings, icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-cosmic text-snow">
      <div className="pointer-events-none fixed inset-0 starfield opacity-40" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(88,101,242,0.12),transparent_55%)]" />
      <header className="sticky top-0 z-40 border-b border-dim-grey/30 bg-not-quite-black/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between gap-4 px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-[12px] bg-blurple text-snow">
              <Code2 className="h-4 w-4" />
            </span>
            <span className="font-display-discord text-base text-snow">CodeArena</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  title={label}
                  className={cn(
                    "flex items-center gap-1.5 rounded-[12px] px-2.5 py-1.5 text-sm text-fog transition hover:bg-dark-charcoal hover:text-snow",
                    active && "bg-blurple/20 text-snow font-medium"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className={active ? "" : "sr-only"}>{label}</span>
                </Link>
              );
            })}
            {user?.is_admin && (
              <Link
                href="/admin"
                className={cn(
                  "flex items-center gap-1.5 rounded-[12px] px-3 py-1.5 text-sm text-fog transition hover:bg-dark-charcoal",
                  pathname.startsWith("/admin") && "bg-ember-orange/20 text-ember-orange font-medium"
                )}
              >
                <Shield className="h-3.5 w-3.5" />
                {t.nav.admin}
              </Link>
            )}
          </nav>
          <div className="flex items-center gap-2.5">
            <LangSwitch />
            {user && (
              <Link
                href="/shop"
                title={t.nav.shop}
                className="flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-sm font-bold text-amber-300 transition hover:bg-amber-400/20"
              >
                <Coins className="h-4 w-4" />
                {(user.profile?.coins ?? 0).toLocaleString()}
              </Link>
            )}
            {user && (
              <div className="hidden text-right text-xs sm:block">
                <div className="font-medium text-snow">{user.username}</div>
                <div className="text-greyple">
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
      <main className="relative mx-auto max-w-[1200px] px-4 py-8">{children}</main>
    </div>
  );
}
