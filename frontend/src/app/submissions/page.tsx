"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Protected } from "@/components/layout/protected";
import { api } from "@/lib/api";
import { useLang } from "@/store/lang";
import type { Paginated, Submission } from "@/lib/types";
import { cn, formatStatus, statusColor, tableWrapClass, thClass, trClass } from "@/lib/utils";

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
        <h1 className="font-display-discord text-[36px] text-snow sm:text-[48px]">{t.submissions.title}</h1>
        <p className="mt-2 text-sm text-fog">{t.submissions.subtitle}</p>
      </div>

      <div className={tableWrapClass}>
        <table className="w-full text-left text-sm">
          <thead className="bg-dark-charcoal">
            <tr>
              <th className={thClass}>{t.submissions.problem}</th>
              <th className={thClass}>{t.submissions.status}</th>
              <th className={thClass}>{t.submissions.language}</th>
              <th className={thClass}>{t.submissions.runtime}</th>
              <th className={thClass}>{t.submissions.date}</th>
            </tr>
          </thead>
          <tbody>
            {(!data?.results || data.results.length === 0) && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm text-greyple">
                  {t.dashboard.noSubmissions}
                </td>
              </tr>
            )}
            {data?.results.map((s) => (
              <tr key={s.id} className={trClass}>
                <td className="px-4 py-3">
                  <Link
                    href={`/problems/${s.problem_slug}/solve`}
                    className="font-medium text-snow hover:text-hover-blurple"
                  >
                    {s.problem_title}
                  </Link>
                </td>
                <td className={cn("px-4 py-3 font-medium", statusColor(s.status))}>
                  {formatStatus(s.status)}
                </td>
                <td className="px-4 py-3 text-fog">{s.language}</td>
                <td className="px-4 py-3 font-mono text-fog">
                  {s.runtime != null ? `${s.runtime.toFixed(1)} ms` : "—"}
                </td>
                <td className="px-4 py-3 text-greyple">{new Date(s.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
