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
        <div className="flex h-64 items-center justify-center text-greyple">Loading dashboard…</div>
      </AppShell>
    );
  }

  const p = data.profile;
  const stats = [
    { label: t.dashboard.totalXp, value: `${p.xp} XP`, icon: Zap, color: "text-ember-orange bg-ember-orange/15" },
    { label: t.dashboard.level, value: `Lv ${p.level}`, icon: Target, color: "text-blurple bg-blurple/15" },
    { label: t.dashboard.solved, value: p.problems_solved, icon: Trophy, color: "text-spring-green bg-spring-green/15" },
    { label: t.dashboard.submissions, value: p.total_submissions, icon: FileCode2, color: "text-vivid-cerulean bg-vivid-cerulean/15" },
    { label: t.dashboard.streak, value: `${p.current_streak} ${t.dashboard.streakDays}`, icon: Flame, color: "text-ekko-red bg-ekko-red/15" },
    { label: t.dashboard.globalRank, value: `#${data.rank}`, icon: Trophy, color: "text-fuchsia bg-fuchsia/15" },
  ];

  return (
    <AppShell>
      <div className="mb-8 animate-fade-up">
        <h1 className="font-display-discord text-[36px] text-snow sm:text-[48px]">
          {t.dashboard.welcomeBack}, {p.username}
        </h1>
        <p className="mt-2 text-[16px] text-fog">
          {t.dashboard.keepStreak} {p.current_streak} {t.dashboard.streakDays}.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px]", color)}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-[11px] text-greyple">{label}</div>
                <div className="truncate text-base font-medium text-snow">{value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { href: "/problems", icon: Code2, title: t.dashboard.solveProblems, desc: `${data.total_problems ?? 30} ${t.dashboard.challengesAvailable}`, tint: "hover:bg-blurple/10" },
          { href: "/leaderboard", icon: Trophy, title: t.dashboard.leaderboardAction, desc: t.dashboard.leaderboardDesc, tint: "hover:bg-ember-orange/10" },
          { href: "/submissions", icon: Clock, title: t.dashboard.submissionsAction, desc: t.dashboard.submissionsDesc, tint: "hover:bg-vivid-cerulean/10" },
          { href: "/profile", icon: User, title: t.dashboard.profileAction, desc: t.dashboard.profileDesc, tint: "hover:bg-fuchsia/10" },
        ].map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className={cn(
              "group flex items-center gap-3 rounded-[16px] bg-not-quite-black p-3.5 transition",
              a.tint
            )}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-blurple text-snow">
              <a.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-snow">{a.title}</div>
              <div className="text-[11px] text-greyple">{a.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {t.dashboard.xpProgress} · {t.dashboard.level} {p.level}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex justify-between text-xs text-fog">
              <span>{p.xp} XP</span>
              <span>
                {t.dashboard.nextLevel}: {p.xp_for_next_level} XP
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-dark-charcoal">
              <div
                className="h-full rounded-full bg-blurple transition-all duration-500"
                style={{ width: `${Math.min(100, p.xp_progress)}%` }}
              />
            </div>
            <div className="mt-6">
              <div className="mb-2 text-sm font-medium text-snow">{t.dashboard.activity}</div>
              <ActivityChart days={data.activity} />
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between bg-gradient-to-br from-blurple to-dark-blurple border-0">
          <CardHeader>
            <CardTitle className="text-snow/90">{t.dashboard.todaysChallenge}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between">
            {data.today_challenge ? (
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link
                    href={`/problems/${data.today_challenge.slug}/solve`}
                    className="block text-xl font-medium text-snow hover:underline"
                  >
                    {getProblemTitle(data.today_challenge, lang)}
                  </Link>
                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    <Badge className={difficultyColor(data.today_challenge.difficulty)}>
                      {data.today_challenge.difficulty}
                    </Badge>
                    <Badge className="border-snow/20 bg-snow/10 text-snow">
                      +{data.today_challenge.xp_reward} XP
                    </Badge>
                  </div>
                  <p className="mt-3 text-xs text-snow/70">
                    {data.today_challenge.acceptance_rate}% acceptance
                  </p>
                </div>
                <Link
                  href={`/problems/${data.today_challenge.slug}/solve`}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[12px] bg-snow px-4 py-[15px] text-sm font-medium text-not-quite-black hover:bg-off-white"
                >
                  <Play className="h-4 w-4 fill-current" /> {t.dashboard.startCoding}
                </Link>
              </div>
            ) : (
              <p className="text-sm text-snow/70">{t.dashboard.noChallenge}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-lg">{t.dashboard.featuredProblems}</CardTitle>
            <p className="mt-1 text-xs text-fog">
              {t.dashboard.featuredDesc} ({data.total_problems ?? 30} {t.dashboard.challengesAvailable})
            </p>
          </div>
          <Link
            href="/problems"
            className="flex items-center gap-1 rounded-[12px] border border-dim-grey bg-dark-charcoal px-3 py-1.5 text-xs font-medium text-snow hover:border-blurple"
          >
            {t.dashboard.viewAllProblems} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(data.featured_problems || []).map((prob) => (
              <div key={prob.id} className="flex flex-col justify-between rounded-[16px] bg-dark-charcoal p-4">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-greyple">
                      #{String(prob.id).padStart(3, "0")}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Badge className={difficultyColor(prob.difficulty)}>{prob.difficulty}</Badge>
                      <Badge>+{prob.xp_reward} XP</Badge>
                    </div>
                  </div>
                  <Link
                    href={`/problems/${prob.slug}/solve`}
                    className="mt-2.5 block text-sm font-medium text-snow hover:text-hover-blurple"
                  >
                    {getProblemTitle(prob, lang)}
                  </Link>
                  <div className="mt-1 text-xs text-fog">
                    {prob.category?.name || "Algorithms"} · {prob.acceptance_rate}%
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-dim-grey/40 pt-3">
                  {prob.user_solved ? (
                    <span className="text-xs font-medium text-spring-green">✓ {t.dashboard.solvedBadge}</span>
                  ) : (
                    <span className="text-xs text-greyple">{t.dashboard.unsolvedBadge}</span>
                  )}
                  <Link
                    href={`/problems/${prob.slug}/solve`}
                    className="inline-flex items-center gap-1 rounded-[12px] bg-blurple px-3 py-1.5 text-xs font-medium text-snow hover:bg-dark-blurple"
                  >
                    {t.dashboard.solveBtn} <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{t.dashboard.recentSubmissions}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-dim-grey/40">
            {data.recent_submissions.length === 0 && (
              <p className="py-4 text-sm text-greyple">{t.dashboard.noSubmissions}</p>
            )}
            {data.recent_submissions.map((s) => (
              <div key={s.id} className="flex flex-wrap items-center justify-between gap-4 py-3 text-sm">
                <Link href={`/problems/${s.problem_slug}/solve`} className="font-medium text-snow hover:text-hover-blurple">
                  {s.problem_title}
                </Link>
                <span className={cn(statusColor(s.status))}>{formatStatus(s.status)}</span>
                <span className="text-fog">{s.language}</span>
                <span className="text-greyple">{new Date(s.created_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
