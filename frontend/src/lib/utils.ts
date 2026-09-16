import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function difficultyColor(d: string) {
  if (d === "easy") return "text-emerald-400";
  if (d === "medium") return "text-amber-400";
  return "text-rose-400";
}

export function statusColor(s: string) {
  const map: Record<string, string> = {
    accepted: "text-emerald-400",
    wrong_answer: "text-rose-400",
    runtime_error: "text-orange-400",
    time_limit_exceeded: "text-amber-400",
    compilation_error: "text-fuchsia-400",
    pending: "text-zinc-400",
    running: "text-sky-400",
  };
  return map[s] || "text-zinc-400";
}

export function formatStatus(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
