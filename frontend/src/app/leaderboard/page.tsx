"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Protected } from "@/components/layout/protected";
import { api } from "@/lib/api";
import { useLang } from "@/store/lang";
import type { LeaderboardEntry } from "@/lib/types";
import { cn, tableWrapClass, thClass, trClass } from "@/lib/utils";
import { Flame } from "lucide-react";

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
          <h1 className="font-display-discord text-[36px] text-snow sm:text-[48px]">{t.leaderboard.title}</h1>
          <p className="mt-2 text-sm text-fog">{t.leaderboard.subtitle}</p>
        </div>
        <div className="flex rounded-[12px] border border-dim-grey bg-not-quite-black p-1">
          {(["global", "weekly", "monthly"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={cn(
                "rounded-[10px] px-3.5 py-1.5 text-xs font-medium transition",
                period === p ? "bg-blurple text-snow" : "text-fog hover:text-snow"
              )}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      </div>

      <div className={tableWrapClass}>
        <table className="w-full text-left text-sm">
          <thead className="bg-dark-charcoal">
            <tr>
              <th className={thClass}>{t.leaderboard.rank}</th>
              <th className={thClass}>{t.leaderboard.coder}</th>
              <th className={thClass}>{t.leaderboard.level}</th>
              <th className={thClass}>{t.leaderboard.xp}</th>
              <th className={thClass}>{t.leaderboard.solved}</th>
              <th className={thClass}>{t.leaderboard.streak}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.username} className={trClass}>
                <td className="px-4 py-3 font-medium text-snow">
                  {i < 3 ? (
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blurple text-xs font-bold text-snow">
                      {i + 1}
                    </span>
                  ) : (
                    `#${r.rank}`
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-snow">{r.username}</td>
                <td className="px-4 py-3 text-fog">Lv {r.level}</td>
                <td className="px-4 py-3 font-medium text-ember-orange">{r.xp} XP</td>
                <td className="px-4 py-3 text-snow">{r.problems_solved}</td>
                <td className="px-4 py-3 font-medium text-ekko-red">
                  <span className="inline-flex items-center gap-1">
                    <Flame className="h-3.5 w-3.5" /> {r.current_streak}d
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
