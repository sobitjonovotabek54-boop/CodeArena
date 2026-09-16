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
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold">
          {t.achievements.title}
        </h1>
        <p className="mt-1 text-sm text-zinc-400">{t.achievements.subtitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((a) => (
          <Card
            key={a.code}
            className={`border-zinc-800/80 bg-zinc-900/40 backdrop-blur transition hover:border-zinc-700 ${
              a.unlocked
                ? "border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.12)]"
                : ""
            }`}
          >
            <CardContent className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
                    a.unlocked
                      ? "bg-emerald-500/15 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                      : "bg-zinc-800/80 text-zinc-500"
                  }`}
                >
                  {a.unlocked ? <Trophy className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                </div>
                <span className="text-xs font-mono font-medium text-zinc-400">
                  {Math.min(a.progress, a.threshold)}/{a.threshold}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-zinc-100">{a.title}</h3>
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    a.unlocked
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : "bg-zinc-800 text-zinc-500"
                  }`}
                >
                  {a.unlocked ? t.achievements.unlocked : t.achievements.locked}
                </span>
              </div>
              <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">{a.description}</p>
              <div className="mt-3.5 h-2 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
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
