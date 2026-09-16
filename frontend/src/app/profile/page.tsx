"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Protected } from "@/components/layout/protected";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityChart } from "@/components/profile/activity-chart";
import { api } from "@/lib/api";
import { useAuth } from "@/store/auth";
import type { Achievement, Profile } from "@/lib/types";

export default function ProfilePage() {
  return (
    <Protected>
      <ProfileInner />
    </Protected>
  );
}

function ProfileInner() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activity, setActivity] = useState<{ date: string; count: number }[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    api<Profile>("/profile/me/").then(setProfile).catch(console.error);
    api<{ date: string; count: number }[]>("/activity/").then(setActivity).catch(console.error);
    api<Achievement[]>("/achievements/").then(setAchievements).catch(console.error);
  }, []);

  if (!profile) {
    return (
      <AppShell>
        <div className="text-zinc-500">Loading profile…</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mb-8 flex flex-wrap items-center gap-5">
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 text-2xl font-bold text-emerald-400">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
          ) : (
            profile.username.slice(0, 2).toUpperCase()
          )}
        </div>
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold">{profile.username}</h1>
          <p className="mt-1 max-w-lg text-zinc-500">{profile.bio || "No bio yet."}</p>
          <p className="mt-1 text-sm text-zinc-600">
            Level {profile.level} · Rank #{profile.rank} · {user?.email}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["XP", profile.xp],
          ["Solved", profile.problems_solved],
          ["Acceptance", `${profile.acceptance_rate}%`],
          ["Streak", `${profile.current_streak} (best ${profile.longest_streak})`],
        ].map(([label, value]) => (
          <Card key={label as string}>
            <CardContent className="p-5">
              <div className="text-xs text-zinc-500">{label}</div>
              <div className="text-2xl font-semibold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Contribution activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityChart days={activity} />
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((a) => (
            <div
              key={a.code}
              className={`rounded-lg border p-3 ${
                a.unlocked ? "border-emerald-800/60 bg-emerald-950/20" : "border-zinc-800 opacity-60"
              }`}
            >
              <div className="font-medium">{a.title}</div>
              <div className="text-xs text-zinc-500">{a.description}</div>
              <div className="mt-2 text-xs text-zinc-400">
                {a.unlocked ? "Unlocked" : `Progress ${a.progress}/${a.threshold}`}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}
