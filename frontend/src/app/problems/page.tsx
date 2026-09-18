"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Protected } from "@/components/layout/protected";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useLang } from "@/store/lang";
import { getProblemTitle } from "@/lib/problem-translations";
import type { Category, Paginated, Problem } from "@/lib/types";
import { difficultyColor, selectClass, tableWrapClass, thClass, trClass } from "@/lib/utils";

export default function ProblemsPage() {
  return (
    <Protected>
      <ProblemsInner />
    </Protected>
  );
}

function ProblemsInner() {
  const [data, setData] = useState<Paginated<Problem> | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [category, setCategory] = useState("");
  const [solved, setSolved] = useState("");
  const [page, setPage] = useState(1);
  const { t, lang } = useLang();

  useEffect(() => {
    api<Paginated<Category> | Category[]>("/categories/", { auth: false })
      .then((res) => setCategories(Array.isArray(res) ? res : res.results || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("page_size", "30");
    if (search) params.set("search", search);
    if (difficulty) params.set("difficulty", difficulty);
    if (category) params.set("category", category);
    if (solved !== "") params.set("solved", solved);
    api<Paginated<Problem>>(`/problems/?${params}`).then(setData).catch(console.error);
  }, [search, difficulty, category, solved, page]);

  return (
    <AppShell>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display-discord text-[36px] text-snow sm:text-[48px]">{t.problems.title}</h1>
          <p className="mt-2 text-sm text-fog">
            <span className="font-medium text-blurple">
              {data?.count ?? 30} {t.problems.subtitle}
            </span>{" "}
            (10 {t.problems.easy} · 12 {t.problems.medium} · 8 {t.problems.hard})
          </p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-greyple" />
          <Input
            className="pl-9"
            placeholder={t.problems.searchPlaceholder}
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <select className={selectClass} value={difficulty} onChange={(e) => { setPage(1); setDifficulty(e.target.value); }}>
          <option value="">{t.problems.allDifficulties}</option>
          <option value="easy">{t.problems.easy}</option>
          <option value="medium">{t.problems.medium}</option>
          <option value="hard">{t.problems.hard}</option>
        </select>
        <select className={selectClass} value={category} onChange={(e) => { setPage(1); setCategory(e.target.value); }}>
          <option value="">{t.problems.allCategories}</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <select className={selectClass} value={solved} onChange={(e) => { setPage(1); setSolved(e.target.value); }}>
          <option value="">{t.problems.allStatus}</option>
          <option value="true">{t.problems.solvedOnly}</option>
          <option value="false">{t.problems.unsolvedOnly}</option>
        </select>
      </div>

      <div className={tableWrapClass}>
        <table className="w-full text-left text-sm">
          <thead className="bg-dark-charcoal">
            <tr>
              <th className={thClass}>#</th>
              <th className={thClass}>{t.problems.statusCol}</th>
              <th className={thClass}>{t.problems.titleCol}</th>
              <th className={thClass}>{t.problems.difficultyCol}</th>
              <th className={thClass}>{t.problems.categoryCol}</th>
              <th className={thClass}>{t.problems.xpCol}</th>
              <th className={thClass}>{t.problems.acceptanceCol}</th>
              <th className={`${thClass} text-right`}>{t.problems.actionCol}</th>
            </tr>
          </thead>
          <tbody>
            {data?.results.map((p) => (
              <tr key={p.id} className={trClass}>
                <td className="px-4 py-3 font-mono text-xs text-greyple">#{String(p.id).padStart(3, "0")}</td>
                <td className="px-4 py-3 font-medium">
                  {p.user_solved || p.solved ? (
                    <span className="text-spring-green">✓ {t.dashboard.solvedBadge}</span>
                  ) : (
                    <span className="text-dim-grey">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/problems/${p.slug}/solve`} className="font-medium text-snow hover:text-hover-blurple">
                    {getProblemTitle(p, lang)}
                  </Link>
                </td>
                <td className="px-4 py-3"><Badge className={difficultyColor(p.difficulty)}>{p.difficulty}</Badge></td>
                <td className="px-4 py-3 text-fog">{p.category?.name || "Algorithms"}</td>
                <td className="px-4 py-3"><Badge>+{p.xp_reward} XP</Badge></td>
                <td className="px-4 py-3 text-fog">{p.acceptance_rate}%</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/problems/${p.slug}/solve`}
                    className="inline-flex rounded-[12px] bg-blurple px-3 py-1.5 text-xs font-medium text-snow hover:bg-dark-blurple"
                  >
                    {t.problems.solveBtn}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          {t.problems.prevPage}
        </Button>
        <span className="text-sm text-fog">{t.problems.page} {page}</span>
        <Button variant="secondary" disabled={!data?.next} onClick={() => setPage((p) => p + 1)}>
          {t.problems.nextPage}
        </Button>
      </div>
    </AppShell>
  );
}
