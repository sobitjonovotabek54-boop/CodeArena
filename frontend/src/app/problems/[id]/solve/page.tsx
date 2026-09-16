"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
      <div className="flex min-h-screen items-center justify-center bg-[#07090d] text-zinc-500">
        Loading workspace…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090d] p-3 md:p-4">
      <div className="mb-3 flex items-center gap-3">
        <Link href={`/problems/${problem.slug}`} className="text-zinc-500 hover:text-zinc-200">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <span className="font-[family-name:var(--font-display)] text-sm font-semibold">
          Code<span className="text-emerald-400">Arena</span>
        </span>
        <span className="text-zinc-600">/</span>
        <span className="text-sm text-zinc-300">{problem.title}</span>
      </div>
      <CodingWorkspace problem={problem} />
    </div>
  );
}
