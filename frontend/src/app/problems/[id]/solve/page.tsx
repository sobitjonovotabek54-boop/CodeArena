"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Code2 } from "lucide-react";
import { Protected } from "@/components/layout/protected";
import { CodingWorkspace } from "@/components/ide/coding-workspace";
import { api } from "@/lib/api";
import type { Problem } from "@/lib/types";

export default function SolvePage() {
  return (
    <Protected>
      <SolveInner />
    </Protected>
  );
}

function SolveInner() {
  const { id } = useParams<{ id: string }>();
  const [problem, setProblem] = useState<Problem | null>(null);

  useEffect(() => {
    api<Problem>(`/problems/${id}/`).then(setProblem).catch(console.error);
  }, [id]);

  if (!problem) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cosmic text-greyple">
        Loading workspace…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cosmic p-3 md:p-4">
      <div className="pointer-events-none fixed inset-0 starfield opacity-30" />
      <div className="relative mb-3 flex items-center gap-3">
        <Link href={`/problems/${problem.slug}`} className="text-fog hover:text-snow">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-blurple">
          <Code2 className="h-3.5 w-3.5 text-snow" />
        </span>
        <span className="font-display-discord text-sm text-snow">CodeArena</span>
        <span className="text-dim-grey">/</span>
        <span className="text-sm text-fog">{problem.title}</span>
      </div>
      <div className="relative">
        <CodingWorkspace problem={problem} />
      </div>
    </div>
  );
}
