"use client";

import { useEffect, useState } from "react";
import { Lock, Trophy } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Protected } from "@/components/layout/protected";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useLang } from "@/store/lang";
import type { Achievement } from "@/lib/types";

export default function AchievementsPage() {
  return (
    <Protected>
      <AchievementsInner />
    </Protected>
  );
}

function AchievementsInner() {
  const [items, setItems] = useState<Achievement[]>([]);
  const { t } = useLang();

  useEffect(() => {
    api<Achievement[]>("/achievements/").then(setItems).catch(console.error);
  }, []);

  return (
    <AppShell>
      <div className="mb-8 animate-fade-up">
        <h1 className="font-display-discord text-[36px] text-snow sm:text-[48px]">{t.achievements.title}</h1>
        <p className="mt-2 text-sm text-fog">{t.achievements.subtitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((a) => (
          <Card key={a.code} className={a.unlocked ? "ring-1 ring-blurple/40" : ""}>
            <CardContent className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-[12px] ${
                    a.unlocked ? "bg-blurple text-snow" : "bg-dark-charcoal text-greyple"
                  }`}
                >
                  {a.unlocked ? <Trophy className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                </div>
                <span className="font-mono text-xs text-fog">
                  {Math.min(a.progress, a.threshold)}/{a.threshold}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-medium text-snow">{a.title}</h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                    a.unlocked
                      ? "bg-spring-green/15 text-spring-green"
                      : "bg-dark-charcoal text-greyple"
                  }`}
                >
                  {a.unlocked ? t.achievements.unlocked : t.achievements.locked}
                </span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-fog">{a.description}</p>
              <div className="mt-3.5 h-2 overflow-hidden rounded-full bg-dark-charcoal">
                <div
                  className="h-full bg-blurple transition-all duration-500"
                  style={{ width: `${Math.min(100, (a.progress / a.threshold) * 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
