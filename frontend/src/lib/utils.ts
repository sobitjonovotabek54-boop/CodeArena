import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function difficultyColor(d: string) {
  if (d === "easy") return "text-spring-green bg-spring-green/10 border-spring-green/30";
  if (d === "medium") return "text-ember-orange bg-ember-orange/10 border-ember-orange/30";
  return "text-ekko-red bg-ekko-red/10 border-ekko-red/30";
}

export function statusColor(s: string) {
  const map: Record<string, string> = {
    accepted: "text-spring-green",
    wrong_answer: "text-ekko-red",
    runtime_error: "text-ember-orange",
    time_limit_exceeded: "text-ember-orange",
    compilation_error: "text-fuchsia",
    pending: "text-greyple",
    running: "text-vivid-cerulean",
  };
  return map[s] || "text-greyple";
}

export function formatStatus(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export const selectClass =
  "h-10 rounded-[12px] border border-dim-grey bg-not-quite-black px-3 text-sm text-snow tracking-[0.014em] focus:outline-none focus:ring-2 focus:ring-blurple/50";

export const tableWrapClass =
  "overflow-hidden rounded-[16px] bg-not-quite-black";

export const thClass =
  "px-4 py-3.5 text-xs font-medium uppercase tracking-[0.013em] text-fog";

export const trClass =
  "border-t border-dim-grey/40 hover:bg-dark-charcoal/80 transition";
