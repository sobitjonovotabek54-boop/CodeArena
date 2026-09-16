"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Protected } from "@/components/layout/protected";
import { api } from "@/lib/api";
import { useLang } from "@/store/lang";
import type { Paginated, Submission } from "@/lib/types";
import { cn, formatStatus, statusColor } from "@/lib/utils";

export default function SubmissionsPage() {
  return (
    <Protected>
      <SubmissionsInner />
    </Protected>
  );
}

function SubmissionsInner() {
  const [data, setData] = useState<Paginated<Submission> | null>(null);
  const { t } = useLang();

  useEffect(() => {
    api<Paginated<Submission>>("/submissions/").then(setData).catch(console.error);
  }, []);

  return (
    <AppShell>
      <div className="mb-6 animate-fade-up">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold">
          {t.submissions.title}
        </h1>
        <p className="mt-1 text-sm text-zinc-400">{t.submissions.subtitle}</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/30 backdrop-blur">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-900/80 text-xs uppercase tracking-wider text-zinc-400">
            <tr>
              <th className="px-4 py-3.5">{t.submissions.problem}</th>
              <th className="px-4 py-3.5">{t.submissions.status}</th>
              <th className="px-4 py-3.5">{t.submissions.language}</th>
              <th className="px-4 py-3.5">{t.submissions.runtime}</th>
              <th className="px-4 py-3.5">{t.submissions.date}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {(!data?.results || data.results.length === 0) && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm text-zinc-500">
                  {t.dashboard.noSubmissions}
                </td>
              </tr>
            )}
            {data?.results.map((s) => (
              <tr key={s.id} className="hover:bg-zinc-800/40 transition">
                <td className="px-4 py-3">
                  <Link
                    href={`/problems/${s.problem_slug}/solve`}
                    className="font-medium text-zinc-200 hover:text-emerald-400 transition"
                  >
                    {s.problem_title}
                  </Link>
                </td>
                <td className={cn("px-4 py-3 font-semibold", statusColor(s.status))}>
                  {formatStatus(s.status)}
                </td>
                <td className="px-4 py-3 text-zinc-400">{s.language}</td>
                <td className="px-4 py-3 font-mono text-zinc-400">
                  {s.runtime != null ? `${s.runtime.toFixed(1)} ms` : "—"}
                </td>
                <td className="px-4 py-3 text-zinc-500">{new Date(s.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
