"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Code2,
  FileCode2,
  Flame,
  Play,
  Target,
  Trophy,
  User,
  Zap,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Protected } from "@/components/layout/protected";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActivityChart } from "@/components/profile/activity-chart";
import { api } from "@/lib/api";
import { useLang } from "@/store/lang";
import { getProblemTitle } from "@/lib/problem-translations";
import type { Problem, Profile, Submission } from "@/lib/types";
import { cn, difficultyColor, formatStatus, statusColor } from "@/lib/utils";

type Dashboard = {
  profile: Profile;
  rank: number;
  today_challenge: Problem | null;
  featured_problems?: Problem[];
  total_problems?: number;
  recent_submissions: Submission[];
  activity: { date: string; count: number }[];
};

export default function DashboardPage() {
  return (
    <Protected>
      <DashboardInner />
    </Protected>
  );
}

function DashboardInner() {
  const [data, setData] = useState<Dashboard | null>(null);
  const { t, lang } = useLang();

  useEffect(() => {
    api<Dashboard>("/dashboard/").then(setData).catch(console.error);
  }, []);

  if (!data) {
    return (
      <AppShell>
        <div className="flex h-64 items-center justify-center text-zinc-500">
          Loading dashboard…
        </div>
      </AppShell>
    );
  }

  const p = data.profile;
  const stats = [
    { label: t.dashboard.totalXp, value: `${p.xp} XP`, icon: Zap, color: "text-amber-400 bg-amber-500/10" },
    { label: t.dashboard.level, value: `Lv ${p.level}`, icon: Target, color: "text-emerald-400 bg-emerald-500/10" },
    { label: t.dashboard.solved, value: p.problems_solved, icon: Trophy, color: "text-blue-400 bg-blue-500/10" },
    { label: t.dashboard.submissions, value: p.total_submissions, icon: FileCode2, color: "text-purple-400 bg-purple-500/10" },
    { label: t.dashboard.streak, value: `${p.current_streak} ${t.dashboard.streakDays}`, icon: Flame, color: "text-rose-400 bg-rose-500/10" },
    { label: t.dashboard.globalRank, value: `#${data.rank}`, icon: Trophy, color: "text-teal-400 bg-teal-500/10" },
  ];

  return (
    <AppShell>
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
          {t.dashboard.welcomeBack}, {p.username} 👋
        </h1>
        <p className="mt-1 text-zinc-400">
          {t.dashboard.keepStreak} {p.current_streak} {t.dashboard.streakDays}.
        </p>
      </div>

      {/* 6 Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border-zinc-800/80 bg-zinc-900/40 backdrop-blur">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", color)}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-[11px] text-zinc-500">{label}</div>
                <div className="truncate text-base font-bold text-zinc-100">{value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Link
          href="/problems"
          className="group flex items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 transition hover:border-emerald-500/50 hover:bg-emerald-500/5"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition">
            <Code2 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm text-zinc-200">{t.dashboard.solveProblems}</div>
            <div className="text-[11px] text-zinc-500">{data.total_problems ?? 30} {t.dashboard.challengesAvailable}</div>
          </div>
        </Link>
        <Link
          href="/leaderboard"
          className="group flex items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 transition hover:border-amber-500/50 hover:bg-amber-500/5"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 group-hover:scale-105 transition">
            <Trophy className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm text-zinc-200">{t.dashboard.leaderboardAction}</div>
            <div className="text-[11px] text-zinc-500">{t.dashboard.leaderboardDesc}</div>
          </div>
        </Link>
        <Link
          href="/submissions"
          className="group flex items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 transition hover:border-sky-500/50 hover:bg-sky-500/5"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 group-hover:scale-105 transition">
            <Clock className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm text-zinc-200">{t.dashboard.submissionsAction}</div>
            <div className="text-[11px] text-zinc-500">{t.dashboard.submissionsDesc}</div>
          </div>
        </Link>
        <Link
          href="/profile"
          className="group flex items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 transition hover:border-purple-500/50 hover:bg-purple-500/5"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 group-hover:scale-105 transition">
            <User className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm text-zinc-200">{t.dashboard.profileAction}</div>
            <div className="text-[11px] text-zinc-500">{t.dashboard.profileDesc}</div>
          </div>
        </Link>
      </div>

      {/* Main Content: XP Progress & Today's Challenge */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-zinc-800/80 bg-zinc-900/40 backdrop-blur">
          <CardHeader>
            <CardTitle>{t.dashboard.xpProgress} · {t.dashboard.level} {p.level}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex justify-between text-xs text-zinc-400">
              <span>{p.xp} XP</span>
              <span>{t.dashboard.nextLevel}: {p.xp_for_next_level} XP</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500"
                style={{ width: `${Math.min(100, p.xp_progress)}%` }}
              />
            </div>
            <div className="mt-6">
              <div className="mb-2 text-sm font-medium text-zinc-300">{t.dashboard.activity}</div>
              <ActivityChart days={data.activity} />
            </div>
          </CardContent>
        </Card>

        {/* Today's Challenge */}
        <Card className="border-zinc-800/80 bg-zinc-900/40 backdrop-blur flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base text-zinc-300">{t.dashboard.todaysChallenge}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between">
            {data.today_challenge ? (
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link
                    href={`/problems/${data.today_challenge.slug}/solve`}
                    className="text-xl font-bold text-emerald-400 hover:underline block"
                  >
                    {getProblemTitle(data.today_challenge, lang)}
                  </Link>
                  <div className="mt-2.5 flex items-center gap-2">
                    <Badge className={difficultyColor(data.today_challenge.difficulty)}>
                      {data.today_challenge.difficulty}
                    </Badge>
                    <Badge>+{data.today_challenge.xp_reward} XP</Badge>
                    <span className="text-xs text-zinc-400">
                      {data.today_challenge.category?.name || "Arrays"}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-zinc-400">
                    {data.today_challenge.acceptance_rate}% acceptance
                  </p>
                </div>
                <div className="mt-6">
                  <Link
                    href={`/problems/${data.today_challenge.slug}/solve`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-600 px-4 py-2.5 text-sm font-bold text-zinc-950 shadow-[0_2px_12px_rgba(16,185,129,0.35)] hover:from-emerald-300 hover:to-emerald-400 hover:shadow-[0_4px_20px_rgba(16,185,129,0.5)] border border-emerald-300/40 transition-all active:scale-[0.97]"
                  >
                    <Play className="h-4 w-4 fill-current" /> {t.dashboard.startCoding}
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-sm text-zinc-500">{t.dashboard.noChallenge}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Featured Problems Section */}
      <Card className="mt-6 border-zinc-800/80 bg-zinc-900/40 backdrop-blur">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-lg">{t.dashboard.featuredProblems}</CardTitle>
            <p className="text-xs text-zinc-400 mt-1">
              {t.dashboard.featuredDesc} ({data.total_problems ?? 30} {t.dashboard.challengesAvailable})
            </p>
          </div>
          <Link
            href="/problems"
            className="flex items-center gap-1 rounded-xl border border-zinc-700/80 bg-zinc-800/60 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition active:scale-[0.97]"
          >
            {t.dashboard.viewAllProblems} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(data.featured_problems && data.featured_problems.length > 0
              ? data.featured_problems
              : []
            ).map((prob) => (
              <div
                key={prob.id}
                className="flex flex-col justify-between rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-4 transition hover:border-zinc-700 hover:bg-zinc-900/60"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-zinc-500">
                      #{String(prob.id).padStart(3, "0")}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Badge className={difficultyColor(prob.difficulty)}>{prob.difficulty}</Badge>
                      <Badge>+{prob.xp_reward} XP</Badge>
                    </div>
                  </div>
                  <Link
                    href={`/problems/${prob.slug}/solve`}
                    className="mt-2.5 block text-sm font-semibold text-zinc-200 hover:text-emerald-400 transition"
                  >
                    {getProblemTitle(prob, lang)}
                  </Link>
                  <div className="mt-1 text-xs text-zinc-400">
                    {prob.category?.name || "Algorithms"} · {prob.acceptance_rate}% acceptance
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-zinc-800/60 pt-3">
                  {prob.user_solved ? (
                    <span className="text-xs font-medium text-emerald-400">✓ {t.dashboard.solvedBadge}</span>
                  ) : (
                    <span className="text-xs text-zinc-500">{t.dashboard.unsolvedBadge}</span>
                  )}
                  <Link
                    href={`/problems/${prob.slug}/solve`}
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition active:scale-[0.97]"
                  >
                    {t.dashboard.solveBtn} <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="mt-6 border-zinc-800/80 bg-zinc-900/40 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-base">{t.dashboard.recentSubmissions}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-zinc-800/80">
            {data.recent_submissions.length === 0 && (
              <p className="py-4 text-sm text-zinc-500">{t.dashboard.noSubmissions}</p>
            )}
            {data.recent_submissions.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                <Link
                  href={`/problems/${s.problem_slug}/solve`}
                  className="font-medium hover:text-emerald-400"
                >
                  {s.problem_title}
                </Link>
                <span className={cn(statusColor(s.status))}>{formatStatus(s.status)}</span>
                <span className="text-zinc-400">{s.language}</span>
                <span className="text-zinc-500">{new Date(s.created_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
