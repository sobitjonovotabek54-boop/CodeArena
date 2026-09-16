"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Protected } from "@/components/layout/protected";
import { api } from "@/lib/api";
import { useLang } from "@/store/lang";
import type { LeaderboardEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function LeaderboardPage() {
  return (
    <Protected>
      <LeaderboardInner />
    </Protected>
  );
}

function LeaderboardInner() {
  const [period, setPeriod] = useState<"global" | "weekly" | "monthly">("global");
  const [rows, setRows] = useState<LeaderboardEntry[]>([]);
  const { t } = useLang();

  useEffect(() => {
    api<LeaderboardEntry[]>(`/leaderboard/?period=${period}`, { auth: false })
      .then(setRows)
      .catch(console.error);
  }, [period]);

  const periodLabels = {
    global: t.leaderboard.allTime,
    weekly: t.leaderboard.weekly,
    monthly: t.leaderboard.monthly,
  };

  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 animate-fade-up">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold">
            {t.leaderboard.title}
          </h1>
          <p className="mt-1 text-sm text-zinc-400">{t.leaderboard.subtitle}</p>
        </div>
        <div className="flex rounded-xl border border-zinc-800 bg-zinc-900/70 p-1 backdrop-blur-sm">
          {(["global", "weekly", "monthly"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={cn(
                "rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 active:scale-[0.97]",
                period === p
                  ? "bg-gradient-to-b from-emerald-400 to-emerald-500 font-bold text-zinc-950 shadow-[0_1px_8px_rgba(16,185,129,0.35)]"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/30 backdrop-blur">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-900/80 text-xs uppercase tracking-wider text-zinc-400">
            <tr>
              <th className="px-4 py-3.5">{t.leaderboard.rank}</th>
              <th className="px-4 py-3.5">{t.leaderboard.coder}</th>
              <th className="px-4 py-3.5">{t.leaderboard.level}</th>
              <th className="px-4 py-3.5">{t.leaderboard.xp}</th>
              <th className="px-4 py-3.5">{t.leaderboard.solved}</th>
              <th className="px-4 py-3.5">{t.leaderboard.streak}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {rows.map((r, i) => (
              <tr key={r.username} className="hover:bg-zinc-800/40 transition">
                <td className="px-4 py-3 font-semibold">
                  {i === 0 ? "🥇 1" : i === 1 ? "🥈 2" : i === 2 ? "🥉 3" : `#${r.rank}`}
                </td>
                <td className="px-4 py-3 font-medium text-zinc-200">{r.username}</td>
                <td className="px-4 py-3 text-zinc-400">Lv {r.level}</td>
                <td className="px-4 py-3 font-bold text-amber-400">{r.xp} XP</td>
                <td className="px-4 py-3 text-zinc-300">{r.problems_solved}</td>
                <td className="px-4 py-3 text-rose-400 font-medium">🔥 {r.current_streak}d</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
