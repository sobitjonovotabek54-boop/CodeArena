"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Protected } from "@/components/layout/protected";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityChart } from "@/components/profile/activity-chart";
import { FramedAvatar, TitleBadge } from "@/components/ui/cosmetics";
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
        <div className="text-greyple">Loading profile…</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mb-8 flex flex-wrap items-center gap-5">
        <FramedAvatar
          name={profile.username}
          src={profile.avatar_url}
          frame={profile.equipped_frame}
          size={80}
        />
        <div>
          <h1 className="font-display-discord text-[36px] text-snow sm:text-[48px]">{profile.username}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <TitleBadge title={profile.equipped_title} />
            <span className="flex items-center gap-1 text-sm font-bold text-amber-300">🪙 {profile.coins}</span>
          </div>
          <p className="mt-1 max-w-lg text-fog">{profile.bio || "No bio yet."}</p>
          <p className="mt-1 text-sm text-greyple">
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
              <div className="text-xs text-greyple">{label}</div>
              <div className="text-2xl font-medium text-snow">{value}</div>
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
              className={`rounded-[12px] p-3 ${
                a.unlocked ? "bg-blurple/15 ring-1 ring-blurple/40" : "bg-dark-charcoal opacity-60"
              }`}
            >
              <div className="font-medium text-snow">{a.title}</div>
              <div className="text-xs text-fog">{a.description}</div>
              <div className="mt-2 text-xs text-greyple">
                {a.unlocked ? "Unlocked" : `Progress ${a.progress}/${a.threshold}`}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}
