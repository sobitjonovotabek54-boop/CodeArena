"use client";

import { cn } from "@/lib/utils";

type Day = { date: string; count: number };

export function ActivityChart({ days }: { days: Day[] }) {
  const map = new Map(days.map((d) => [d.date, d.count]));
  const today = new Date();
  const cells: { date: string; count: number }[] = [];
  for (let i = 363; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    cells.push({ date: key, count: map.get(key) || 0 });
  }

  const level = (c: number) => {
    if (c === 0) return "bg-zinc-800/80";
    if (c === 1) return "bg-emerald-900";
    if (c <= 3) return "bg-emerald-700";
    if (c <= 5) return "bg-emerald-500";
    return "bg-emerald-400";
  };

  return (
    <div className="overflow-x-auto">
      <div className="inline-grid grid-flow-col grid-rows-7 gap-1">
        {cells.map((c) => (
          <div
            key={c.date}
            title={`${c.date}: ${c.count} submissions`}
            className={cn("h-2.5 w-2.5 rounded-[2px]", level(c.count))}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center gap-1 text-[10px] text-zinc-500">
        Less
        {[0, 1, 3, 5, 8].map((n) => (
          <span key={n} className={cn("h-2.5 w-2.5 rounded-[2px]", level(n))} />
        ))}
        More
      </div>
    </div>
  );
}
