"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Play } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Protected } from "@/components/layout/protected";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useLang } from "@/store/lang";
import { getProblemDescription, getProblemTitle } from "@/lib/problem-translations";
import type { Problem } from "@/lib/types";
import { cn, difficultyColor } from "@/lib/utils";

export default function ProblemDetailPage() {
  return (
    <Protected>
      <DetailInner />
    </Protected>
  );
}

function DetailInner() {
  const { id } = useParams<{ id: string }>();
  const [problem, setProblem] = useState<Problem | null>(null);
  const { t, lang } = useLang();

  useEffect(() => {
    api<Problem>(`/problems/${id}/`).then(setProblem).catch(console.error);
  }, [id]);

  if (!problem) {
    return (
      <AppShell>
        <div className="flex h-64 items-center justify-center text-greyple">Loading…</div>
      </AppShell>
    );
  }

  const title = getProblemTitle(problem, lang);
  const description = getProblemDescription(problem, lang);

  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4 animate-fade-up">
        <div>
          <h1 className="font-display-discord text-[36px] text-snow sm:text-[48px]">{title}</h1>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <Badge className={cn(difficultyColor(problem.difficulty))}>{problem.difficulty}</Badge>
            <Badge>{problem.category?.name || "Algorithms"}</Badge>
            <Badge>+{problem.xp_reward} XP</Badge>
            <Badge>{problem.acceptance_rate}% acceptance</Badge>
          </div>
        </div>
        <Link href={`/problems/${problem.slug}/solve`}>
          <Button size="lg" className="gap-2">
            <Play className="h-4 w-4 fill-current" />
            {t.problems.solveBtn}
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="space-y-6 p-6">
          <section>
            <h2 className="mb-2 text-xs font-medium uppercase tracking-[0.013em] text-fog">
              {t.workspace.problemDesc}
            </h2>
            <p className="whitespace-pre-wrap leading-relaxed text-fog">{description}</p>
          </section>

          {problem.examples?.map((ex, i) => (
            <section key={i} className="rounded-[16px] bg-dark-charcoal p-4">
              <h2 className="mb-2 text-xs font-medium text-fog">
                {t.workspace.examples} {i + 1}
              </h2>
              <pre className="rounded-[12px] bg-void/60 p-3 font-mono text-xs text-snow">
                {`${t.workspace.input}:\n${ex.input}\n\n${t.workspace.expectedOutput}:\n${ex.output}`}
              </pre>
            </section>
          ))}

          {problem.constraints && (
            <section>
              <h2 className="mb-2 text-xs font-medium uppercase tracking-[0.013em] text-fog">
                {t.workspace.constraints}
              </h2>
              <pre className="whitespace-pre-wrap rounded-[12px] bg-dark-charcoal p-3 font-mono text-xs text-fog">
                {problem.constraints}
              </pre>
            </section>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
