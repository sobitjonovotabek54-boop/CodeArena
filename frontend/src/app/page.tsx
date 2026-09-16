"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Code2,
  Trophy,
  Zap,
  CheckCircle2,
  Terminal,
  Cpu,
  ShieldCheck,
  Flame,
  Globe2,
  TrendingUp,
  Play,
  Layers,
  Sparkles,
  BarChart3,
  Award,
  ChevronRight,
} from "lucide-react";
import { useLang } from "@/store/lang";
import { LangSwitch } from "@/components/layout/lang-switch";

export default function HomePage() {
  const { t, lang } = useLang();
  const [activeTab, setActiveTab] = useState<"results" | "console">("results");
  const [copiedCode, setCopiedCode] = useState(false);

  const samplePythonCode = `def two_sum(nums: list[int], target: int) -> list[int]:
    # Hash xaritasi yordamida O(n) vaqt murakkabligi
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Sinov uchun chaqirish
print(two_sum([2, 7, 11, 15], 9))  # -> [0, 1]`;

  const topCoders = [
    { rank: 1, name: "Jahongir_Dev", xp: 1450, solved: 28, streak: 14, badge: "Grandmaster", color: "from-amber-400 to-yellow-500" },
    { rank: 2, name: "Malika_Code", xp: 1180, solved: 24, streak: 9, badge: "Master", color: "from-slate-300 to-zinc-400" },
    { rank: 3, name: "Bobur_Algo", xp: 950, solved: 19, streak: 6, badge: "Expert", color: "from-amber-600 to-amber-700" },
  ];

  const technologies = [
    { name: "Python 3.13", color: "text-amber-400 border-amber-400/20 bg-amber-400/5" },
    { name: "JavaScript (Node 22)", color: "text-yellow-400 border-yellow-400/20 bg-yellow-400/5" },
    { name: "TypeScript 5", color: "text-blue-400 border-blue-400/20 bg-blue-400/5" },
    { name: "C++ (GCC 14)", color: "text-cyan-400 border-cyan-400/20 bg-cyan-400/5" },
    { name: "Java 21", color: "text-orange-400 border-orange-400/20 bg-orange-400/5" },
    { name: "Go 1.23", color: "text-teal-400 border-teal-400/20 bg-teal-400/5" },
    { name: "PostgreSQL 16", color: "text-sky-400 border-sky-400/20 bg-sky-400/5" },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050811] text-zinc-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* GitHub-style Ambient Radial Lights & Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,_rgba(59,130,246,0.14),_transparent_55%),radial-gradient(ellipse_at_20%_15%,_rgba(16,185,129,0.15),_transparent_50%),radial-gradient(ellipse_at_50%_45%,_rgba(99,102,241,0.08),_transparent_60%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at 50% 25%, black 40%, transparent 80%)",
        }}
      />

      {/* 1. Header / Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#050811]/85 backdrop-blur-xl transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-transform group-hover:scale-105">
                <Code2 className="h-5 w-5 text-zinc-950 stroke-[2.5]" />
              </div>
              <span className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-white">
                Code<span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Arena</span>
              </span>
            </Link>

            <nav className="hidden items-center gap-6 md:flex">
              <Link
                href="/problems"
                className="text-sm font-medium text-zinc-300 transition-colors hover:text-white"
              >
                {t.nav.problems}
              </Link>
              <Link
                href="/leaderboard"
                className="text-sm font-medium text-zinc-300 transition-colors hover:text-white"
              >
                {t.nav.leaderboard}
              </Link>
              <Link
                href="/submissions"
                className="text-sm font-medium text-zinc-300 transition-colors hover:text-white"
              >
                {t.nav.submissions}
              </Link>
              <Link
                href="/achievements"
                className="text-sm font-medium text-zinc-300 transition-colors hover:text-white"
              >
                {t.nav.achievements}
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <LangSwitch />
            <Link
              href="/login"
              className="rounded-lg px-3 py-1.5 text-sm font-semibold text-zinc-300 transition-colors hover:text-white"
            >
              {t.nav.login}
            </Link>
            <Link
              href="/register"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-600 px-4 py-2 text-xs font-bold text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.35)] transition-all hover:from-emerald-300 hover:to-emerald-500 active:scale-[0.97]"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                {t.nav.getStarted}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section with Cosmic Globe & Ambient Lighting */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Hero Text & CTAs */}
          <div className="flex flex-col items-start lg:col-span-7">
            {/* Pill Announcement Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)] backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t.landing.badge}</span>
              <ChevronRight className="h-3.5 w-3.5 text-emerald-400/80" />
            </div>

            {/* Giant Title */}
            <h1 className="font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight text-white sm:text-6xl sm:leading-[1.1]">
              {t.landing.heroTitle1} <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                {t.landing.heroTitle2}
              </span>
            </h1>

            {/* Tagline & Description */}
            <p className="mt-6 max-w-xl text-base text-zinc-300 sm:text-lg sm:leading-relaxed">
              {t.landing.description}
            </p>

            {/* Actions / CTA Buttons */}
            <div className="mt-8 flex w-full flex-col gap-3.5 sm:flex-row sm:items-center">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-600 px-6 py-3.5 text-sm font-bold text-zinc-950 shadow-[0_4px_20px_rgba(16,185,129,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] transition-all hover:from-emerald-300 hover:to-emerald-400 hover:shadow-[0_6px_28px_rgba(16,185,129,0.6)] active:scale-[0.98]"
              >
                <span>{t.landing.startCompeting}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/problems"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700/80 bg-zinc-900/60 px-6 py-3.5 text-sm font-semibold text-zinc-200 backdrop-blur-md transition-all hover:border-zinc-500 hover:bg-zinc-800/80 hover:text-white active:scale-[0.98]"
              >
                <Code2 className="h-4 w-4 text-emerald-400" />
                <span>{t.landing.browseProblems}</span>
              </Link>
            </div>

            {/* GitHub-style Key Metrics Row */}
            <div className="mt-12 grid w-full grid-cols-2 gap-4 border-t border-zinc-800/80 pt-8 sm:grid-cols-4">
              <div>
                <div className="text-2xl font-extrabold text-white sm:text-3xl font-[family-name:var(--font-display)]">
                  {t.landing.stats.problemsVal}
                </div>
                <div className="mt-1 text-xs text-zinc-400">{t.landing.stats.problems}</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-emerald-400 sm:text-3xl font-[family-name:var(--font-display)]">
                  {t.landing.stats.codersVal}
                </div>
                <div className="mt-1 text-xs text-zinc-400">{t.landing.stats.coders}</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-teal-300 sm:text-3xl font-[family-name:var(--font-display)]">
                  {t.landing.stats.submissionsVal}
                </div>
                <div className="mt-1 text-xs text-zinc-400">{t.landing.stats.submissions}</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-cyan-400 sm:text-3xl font-[family-name:var(--font-display)]">
                  {t.landing.stats.speedVal}
                </div>
                <div className="mt-1 text-xs text-zinc-400">{t.landing.stats.speed}</div>
              </div>
            </div>
          </div>

          {/* Right Column: GitHub Cosmic Globe & Real-time Live Badge Hologram */}
          <div className="relative flex items-center justify-center lg:col-span-5">
            {/* Cosmic Ambient Glow Behind Globe */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-emerald-500/20 via-teal-500/15 to-indigo-500/25 blur-3xl" />

            {/* Glowing Tech Globe Graphic */}
            <div className="relative flex h-[380px] w-[380px] sm:h-[440px] sm:w-[440px] items-center justify-center">
              {/* Outer Pulsing Orbits */}
              <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-[spin_60s_linear_infinite]" />
              <div className="absolute inset-6 rounded-full border border-dashed border-teal-500/25 animate-[spin_40s_linear_infinite_reverse]" />
              <div className="absolute inset-14 rounded-full border border-indigo-500/20" />

              {/* Central Sphere Graphic */}
              <div className="relative flex h-64 w-64 items-center justify-center rounded-full bg-gradient-to-b from-[#0e1726] to-[#080d1a] shadow-[inset_0_0_60px_rgba(16,185,129,0.25),0_0_80px_rgba(14,165,233,0.2)] border border-emerald-500/30 overflow-hidden">
                {/* Simulated Globe Lines */}
                <div className="absolute inset-0 opacity-40">
                  <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-emerald-400/40" />
                  <div className="absolute top-1/4 left-0 right-0 h-[1px] bg-emerald-400/20" />
                  <div className="absolute bottom-1/4 left-0 right-0 h-[1px] bg-emerald-400/20" />
                  <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-emerald-400/40" />
                  <div className="absolute top-0 bottom-0 left-1/4 w-[1px] rounded-full border-l border-emerald-400/20" />
                  <div className="absolute top-0 bottom-0 right-1/4 w-[1px] rounded-full border-r border-emerald-400/20" />
                </div>

                {/* Glowing Nodes representing coders around the world */}
                <div className="absolute top-[35%] left-[45%] h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_12px_#10b981] animate-ping" />
                <div className="absolute top-[35%] left-[45%] h-2.5 w-2.5 rounded-full bg-white" />
                
                <div className="absolute top-[55%] left-[65%] h-2 w-2 rounded-full bg-teal-300 shadow-[0_0_10px_#2dd4bf]" />
                <div className="absolute top-[60%] left-[28%] h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
                <div className="absolute top-[25%] left-[30%] h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_10px_#818cf8]" />

                {/* Center Core */}
                <div className="relative z-10 flex flex-col items-center text-center p-4">
                  <Terminal className="h-10 w-10 text-emerald-400 mb-2 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
                  <span className="font-bold text-sm text-white tracking-wider">LIVE ARENA</span>
                  <span className="text-[11px] text-emerald-300 font-mono">1,500+ active</span>
                </div>
              </div>

              {/* Floating Holographic Badge 1: Top Right (Solved Problem) */}
              <div className="absolute -top-2 -right-4 rounded-xl border border-emerald-500/40 bg-zinc-950/80 p-3 shadow-[0_8px_24px_rgba(0,0,0,0.6),0_0_20px_rgba(16,185,129,0.2)] backdrop-blur-xl transition-transform hover:scale-105">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>#001 Two Sum</span>
                      <span className="rounded bg-emerald-500/20 px-1 py-0.2 text-[9px] text-emerald-300">Accepted</span>
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono">+25 XP • 14ms (99%)</div>
                  </div>
                </div>
              </div>

              {/* Floating Holographic Badge 2: Bottom Left (Streak Flame) */}
              <div className="absolute -bottom-4 -left-4 rounded-xl border border-amber-500/30 bg-zinc-950/80 p-3 shadow-[0_8px_24px_rgba(0,0,0,0.6),0_0_20px_rgba(245,158,11,0.15)] backdrop-blur-xl transition-transform hover:scale-105">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                    <Flame className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">7 kunlik seriya 🔥</div>
                    <div className="text-[11px] text-zinc-400">Grandmaster sari qadam</div>
                  </div>
                </div>
              </div>

              {/* Floating Holographic Badge 3: Bottom Right (Speed Benchmark) */}
              <div className="absolute bottom-10 -right-6 hidden sm:flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-zinc-950/80 px-3 py-2 shadow-lg backdrop-blur-xl">
                <Zap className="h-4 w-4 text-cyan-400" />
                <span className="text-[11px] font-mono text-zinc-200">&lt; 30ms Sandboxed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Tech Stack / Language Banner (GitHub style sponsor/language ribbon) */}
      <section className="relative z-10 mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-6 backdrop-blur-md">
          <div className="text-center text-xs font-semibold uppercase tracking-widest text-zinc-400">
            {lang === "uz"
              ? "Qo'llab-quvvatlanadigan texnologiyalar va dasturlash tillari"
              : "Supported languages and developer runtime environments"}
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4">
            {technologies.map((tech) => (
              <div
                key={tech.name}
                className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-medium backdrop-blur-sm transition-transform hover:scale-105 ${tech.color}`}
              >
                <Code2 className="h-3.5 w-3.5 opacity-80" />
                <span>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Connected Timeline Spine: "How CodeArena Works" (Signature GitHub Vertical Line) */}
      <section className="relative z-10 mx-auto mt-32 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t.landing.howItWorks.badge}</span>
          </div>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-extrabold text-white sm:text-4xl">
            {t.landing.howItWorks.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-zinc-400">
            {t.landing.howItWorks.subtitle}
          </p>
        </div>

        {/* 4 Steps Grid with Glowing Connector */}
        <div className="relative mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Step 1 */}
          <div className="relative rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-sm transition-all hover:border-emerald-500/40 hover:bg-zinc-900/70">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 font-mono text-sm">
              01
            </div>
            <h3 className="mt-4 text-lg font-bold text-white">
              {t.landing.howItWorks.step1Title}
            </h3>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              {t.landing.howItWorks.step1Desc}
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-sm transition-all hover:border-teal-500/40 hover:bg-zinc-900/70">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 font-bold border border-teal-500/20 font-mono text-sm">
              02
            </div>
            <h3 className="mt-4 text-lg font-bold text-white">
              {t.landing.howItWorks.step2Title}
            </h3>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              {t.landing.howItWorks.step2Desc}
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-sm transition-all hover:border-cyan-500/40 hover:bg-zinc-900/70">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20 font-mono text-sm">
              03
            </div>
            <h3 className="mt-4 text-lg font-bold text-white">
              {t.landing.howItWorks.step3Title}
            </h3>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              {t.landing.howItWorks.step3Desc}
            </p>
          </div>

          {/* Step 4 */}
          <div className="relative rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-sm transition-all hover:border-amber-500/40 hover:bg-zinc-900/70">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20 font-mono text-sm">
              04
            </div>
            <h3 className="mt-4 text-lg font-bold text-white">
              {t.landing.howItWorks.step4Title}
            </h3>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              {t.landing.howItWorks.step4Desc}
            </p>
          </div>
        </div>
      </section>

      {/* 5. Centerpiece: Full-scale Interactive Monaco IDE & Terminal Mockup */}
      <section className="relative z-10 mx-auto mt-32 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            <Terminal className="h-3.5 w-3.5" />
            <span>{t.landing.ideSection.badge}</span>
          </div>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-extrabold text-white sm:text-4xl">
            {t.landing.ideSection.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-zinc-400">
            {t.landing.ideSection.subtitle}
          </p>
        </div>

        {/* The VS Code Studio Window */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-zinc-700/70 bg-[#0c101b] shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(16,185,129,0.12)]">
          {/* Top Window Bar */}
          <div className="flex items-center justify-between border-b border-zinc-800 bg-[#090d16] px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
              <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
              <span className="ml-3 hidden font-mono text-xs text-zinc-400 sm:inline">
                {t.landing.ideSection.editorTitle}
              </span>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono text-emerald-300">
                <Code2 className="h-3.5 w-3.5" />
                <span>two_sum.py</span>
              </div>
              <div className="hidden items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-mono text-zinc-500 sm:flex">
                <span>solution.cpp</span>
              </div>
              <div className="hidden items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-mono text-zinc-500 sm:flex">
                <span>test_cases.json</span>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-zinc-400">Python 3.13</span>
            </div>
          </div>

          {/* Main IDE Grid: Editor on Top/Left, Test Output at Bottom */}
          <div className="grid lg:grid-cols-12">
            {/* Editor Canvas */}
            <div className="p-4 sm:p-6 lg:col-span-7 border-b lg:border-b-0 lg:border-r border-zinc-800">
              <div className="font-mono text-xs sm:text-sm leading-relaxed">
                <div className="flex">
                  <div className="w-8 select-none text-right font-mono text-zinc-600 pr-4">
                    1<br />2<br />3<br />4<br />5<br />6<br />7<br />8<br />9<br />10<br />11<br />12
                  </div>
                  <div className="flex-1 text-zinc-300 overflow-x-auto">
                    <div>
                      <span className="text-purple-400">def</span>{" "}
                      <span className="text-yellow-300">two_sum</span>(nums:{" "}
                      <span className="text-cyan-400">list[int]</span>, target:{" "}
                      <span className="text-cyan-400">int</span>) -&gt;{" "}
                      <span className="text-cyan-400">list[int]</span>:
                    </div>
                    <div className="text-zinc-500 italic pl-4">
                      # O(n) Hashmap optimal yechim
                    </div>
                    <div className="pl-4">
                      seen = {}
                    </div>
                    <div className="pl-4">
                      <span className="text-purple-400">for</span> i, num{" "}
                      <span className="text-purple-400">in</span>{" "}
                      <span className="text-yellow-300">enumerate</span>(nums):
                    </div>
                    <div className="pl-8">
                      complement = target - num
                    </div>
                    <div className="pl-8">
                      <span className="text-purple-400">if</span> complement{" "}
                      <span className="text-purple-400">in</span> seen:
                    </div>
                    <div className="pl-12">
                      <span className="text-purple-400">return</span> [seen[complement], i]
                    </div>
                    <div className="pl-8">
                      seen[num] = i
                    </div>
                    <div className="pl-4">
                      <span className="text-purple-400">return</span> []
                    </div>
                    <div className="mt-2 text-zinc-500 italic">
                      # Sinov
                    </div>
                    <div>
                      <span className="text-yellow-300">print</span>(two_sum([<span className="text-emerald-300">2, 7, 11, 15</span>], <span className="text-emerald-300">9</span>))
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800/80 pt-4">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-zinc-800 px-2 py-1 text-[11px] font-mono text-zinc-400">
                    UTF-8
                  </span>
                  <span className="rounded bg-zinc-800 px-2 py-1 text-[11px] font-mono text-zinc-400">
                    Spaces: 4
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="/problems/1"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30 transition-colors"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>{t.landing.ideSection.runBtn}</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Live Terminal & Test Results Panel */}
            <div className="p-4 sm:p-6 lg:col-span-5 bg-[#090d16] flex flex-col justify-between">
              <div>
                {/* Panel Tabs */}
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveTab("results")}
                      className={`text-xs font-semibold ${
                        activeTab === "results"
                          ? "text-emerald-400 border-b-2 border-emerald-400 pb-1"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {t.landing.ideSection.terminalTab}
                    </button>
                    <button
                      onClick={() => setActiveTab("console")}
                      className={`text-xs font-semibold ${
                        activeTab === "console"
                          ? "text-emerald-400 border-b-2 border-emerald-400 pb-1"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {t.landing.ideSection.consoleTab}
                    </button>
                  </div>

                  <span className="inline-flex items-center gap-1 rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                    <CheckCircle2 className="h-3 w-3" />
                    {t.landing.ideSection.acceptedStatus}
                  </span>
                </div>

                {/* Test Cases Passed List */}
                <div className="mt-4 space-y-2.5">
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        Test Case 1
                      </span>
                      <span className="font-mono text-[11px] text-zinc-400">12 ms</span>
                    </div>
                    <div className="mt-1 text-[11px] font-mono text-zinc-300">
                      nums = [2,7,11,15], target = 9 ➔ [0, 1]
                    </div>
                  </div>

                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        Test Case 2
                      </span>
                      <span className="font-mono text-[11px] text-zinc-400">9 ms</span>
                    </div>
                    <div className="mt-1 text-[11px] font-mono text-zinc-300">
                      nums = [3,2,4], target = 6 ➔ [1, 2]
                    </div>
                  </div>

                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        Test Case 3
                      </span>
                      <span className="font-mono text-[11px] text-zinc-400">8 ms</span>
                    </div>
                    <div className="mt-1 text-[11px] font-mono text-zinc-300">
                      nums = [3,3], target = 6 ➔ [0, 1]
                    </div>
                  </div>
                </div>
              </div>

              {/* Execution Summary Pill */}
              <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-3.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">{t.landing.ideSection.speedText}</span>
                  <span className="text-emerald-400 font-bold">{t.landing.ideSection.xpEarned}</span>
                </div>
                <div className="mt-1 text-[11px] font-mono text-zinc-500">
                  {t.landing.ideSection.memoryText}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Difficulty Showcase (Easy, Medium, Hard with direct solve links) */}
      <section className="relative z-10 mx-auto mt-32 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
            <Layers className="h-3.5 w-3.5" />
            <span>{t.landing.difficultySection.badge}</span>
          </div>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-extrabold text-white sm:text-4xl">
            {t.landing.difficultySection.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-zinc-400">
            {t.landing.difficultySection.subtitle}
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {/* Easy Tier */}
          <div className="group relative rounded-2xl border border-emerald-500/30 bg-zinc-900/40 p-6 backdrop-blur-sm transition-all hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <div className="flex items-center justify-between">
              <span className="rounded-lg bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-300">
                {t.landing.difficultySection.easy}
              </span>
              <span className="font-mono text-xs font-bold text-emerald-400">
                {t.landing.difficultySection.easyXp}
              </span>
            </div>
            <h3 className="mt-4 text-xl font-bold text-white">
              {lang === "uz" ? "Boshlang'ich Masalalar" : "Foundational Challenges"}
            </h3>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              {t.landing.difficultySection.easyDesc}
            </p>

            <div className="mt-6 space-y-2 border-t border-zinc-800/80 pt-4 text-xs font-mono">
              <div className="flex justify-between text-zinc-300">
                <span>#001 Two Sum</span>
                <span className="text-emerald-400">Massiv</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>#005 Valid Palindrome</span>
                <span className="text-emerald-400">String</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>#007 Merge Two Lists</span>
                <span className="text-emerald-400">Ro'yxat</span>
              </div>
            </div>

            <Link
              href="/problems"
              className="mt-6 flex items-center justify-between text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span>{t.landing.difficultySection.solveAction}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Medium Tier */}
          <div className="group relative rounded-2xl border border-amber-500/30 bg-zinc-900/40 p-6 backdrop-blur-sm transition-all hover:border-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]">
            <div className="flex items-center justify-between">
              <span className="rounded-lg bg-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-300">
                {t.landing.difficultySection.medium}
              </span>
              <span className="font-mono text-xs font-bold text-amber-400">
                {t.landing.difficultySection.mediumXp}
              </span>
            </div>
            <h3 className="mt-4 text-xl font-bold text-white">
              {lang === "uz" ? "Intervyu Darajasi" : "Interview Ready"}
            </h3>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              {t.landing.difficultySection.mediumDesc}
            </p>

            <div className="mt-6 space-y-2 border-t border-zinc-800/80 pt-4 text-xs font-mono">
              <div className="flex justify-between text-zinc-300">
                <span>#011 Longest Substring</span>
                <span className="text-amber-400">Sliding Window</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>#012 3Sum</span>
                <span className="text-amber-400">Massiv</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>#013 Container With Water</span>
                <span className="text-amber-400">Ikki Ko'rsatkich</span>
              </div>
            </div>

            <Link
              href="/problems"
              className="mt-6 flex items-center justify-between text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
            >
              <span>{t.landing.difficultySection.solveAction}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Hard Tier */}
          <div className="group relative rounded-2xl border border-rose-500/30 bg-zinc-900/40 p-6 backdrop-blur-sm transition-all hover:border-rose-400 hover:shadow-[0_0_30px_rgba(244,63,94,0.2)]">
            <div className="flex items-center justify-between">
              <span className="rounded-lg bg-rose-500/20 px-2.5 py-1 text-xs font-bold text-rose-300">
                {t.landing.difficultySection.hard}
              </span>
              <span className="font-mono text-xs font-bold text-rose-400">
                {t.landing.difficultySection.hardXp}
              </span>
            </div>
            <h3 className="mt-4 text-xl font-bold text-white">
              {lang === "uz" ? "Chempionlar Musobaqasi" : "Contest Hard"}
            </h3>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              {t.landing.difficultySection.hardDesc}
            </p>

            <div className="mt-6 space-y-2 border-t border-zinc-800/80 pt-4 text-xs font-mono">
              <div className="flex justify-between text-zinc-300">
                <span>#024 Median of Arrays</span>
                <span className="text-rose-400">Binary Search</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>#025 Trapping Rain Water</span>
                <span className="text-rose-400">DP / Stack</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>#026 Merge k Sorted Lists</span>
                <span className="text-rose-400">Heap</span>
              </div>
            </div>

            <Link
              href="/problems"
              className="mt-6 flex items-center justify-between text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors"
            >
              <span>{t.landing.difficultySection.solveAction}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Platform Features Bento Grid */}
      <section className="relative z-10 mx-auto mt-32 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            <Zap className="h-3.5 w-3.5" />
            <span>{t.landing.features.badge}</span>
          </div>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-extrabold text-white sm:text-4xl">
            {t.landing.features.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-zinc-400">
            {t.landing.features.subtitle}
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-sm transition-all hover:border-emerald-500/40 hover:bg-zinc-900/70">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Code2 className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-white">{t.landing.features.proIde}</h3>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{t.landing.features.proIdeDesc}</p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-sm transition-all hover:border-teal-500/40 hover:bg-zinc-900/70">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-white">{t.landing.features.runner}</h3>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{t.landing.features.runnerDesc}</p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-sm transition-all hover:border-amber-500/40 hover:bg-zinc-900/70">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Flame className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-white">{t.landing.features.gamified}</h3>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{t.landing.features.gamifiedDesc}</p>
          </div>

          {/* Card 4 */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-sm transition-all hover:border-indigo-500/40 hover:bg-zinc-900/70">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Trophy className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-white">{t.landing.features.leaderboard}</h3>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{t.landing.features.leaderboardDesc}</p>
          </div>

          {/* Card 5 */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-sm transition-all hover:border-cyan-500/40 hover:bg-zinc-900/70">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-white">{t.landing.features.analytics}</h3>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{t.landing.features.analyticsDesc}</p>
          </div>

          {/* Card 6 */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-sm transition-all hover:border-emerald-500/40 hover:bg-zinc-900/70">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Globe2 className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-white">{t.landing.features.bilingual}</h3>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{t.landing.features.bilingualDesc}</p>
          </div>
        </div>
      </section>

      {/* 8. Live Leaderboard / Hall of Fame Showcase */}
      <section className="relative z-10 mx-auto mt-32 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 p-8 sm:p-12 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-300">
                <Award className="h-3.5 w-3.5" />
                <span>{t.landing.leaderboardPreview.badge}</span>
              </div>
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-extrabold text-white sm:text-3xl">
                {t.landing.leaderboardPreview.title}
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                {t.landing.leaderboardPreview.subtitle}
              </p>
            </div>
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300"
            >
              <span>{t.landing.leaderboardPreview.viewAll}</span>
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {topCoders.map((coder) => (
              <div
                key={coder.rank}
                className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4 transition-all hover:border-zinc-700"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${coder.color} text-zinc-950 font-black text-sm shadow-md`}
                  >
                    #{coder.rank}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{coder.name}</div>
                    <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                      <span>{coder.badge}</span>
                      <span>•</span>
                      <span className="text-amber-400 font-mono flex items-center gap-0.5">
                        <Flame className="h-3 w-3" /> {coder.streak}d
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm font-bold text-emerald-400">{coder.xp} XP</div>
                  <div className="text-[10px] text-zinc-500">{coder.solved} yechilgan</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. High-converting Cosmic Bottom CTA Section */}
      <section className="relative z-10 mx-auto mt-32 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/50 via-[#07131b]/80 to-teal-950/50 p-8 sm:p-16 text-center shadow-[0_0_80px_rgba(16,185,129,0.15)]">
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />

          <h2 className="relative z-10 font-[family-name:var(--font-display)] text-3xl font-extrabold text-white sm:text-5xl">
            {t.landing.cta.title}
          </h2>
          <p className="relative z-10 mx-auto mt-4 max-w-2xl text-base text-zinc-300">
            {t.landing.cta.subtitle}
          </p>

          <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-600 px-8 py-4 text-sm font-bold text-zinc-950 shadow-[0_4px_25px_rgba(16,185,129,0.5)] transition-all hover:from-emerald-300 hover:to-emerald-400 hover:shadow-[0_6px_35px_rgba(16,185,129,0.7)] active:scale-[0.98]"
            >
              <span>{t.landing.cta.buttonPrimary}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/problems"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/80 px-8 py-4 text-sm font-semibold text-zinc-200 backdrop-blur-md transition-all hover:border-zinc-500 hover:bg-zinc-800 hover:text-white active:scale-[0.98]"
            >
              <span>{t.landing.cta.buttonSecondary}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 10. Modern Developer-Centric Footer */}
      <footer className="relative z-10 mx-auto mt-32 max-w-7xl border-t border-zinc-800/80 px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-sm">
                <Code2 className="h-4 w-4 text-zinc-950 stroke-[2.5]" />
              </div>
              <span className="font-[family-name:var(--font-display)] text-lg font-bold text-white">
                Code<span className="text-emerald-400">Arena</span>
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-xs text-zinc-400 leading-relaxed">
              {t.landing.footer.description}
            </p>

            <div className="mt-5 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-emerald-400">
                {t.landing.footer.status}
              </span>
            </div>
          </div>

          {/* Col 1: Platform */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              {t.landing.footer.platform}
            </div>
            <ul className="mt-3 space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/problems" className="hover:text-white transition-colors">
                  {t.nav.problems} (30+)
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-white transition-colors">
                  {t.nav.leaderboard}
                </Link>
              </li>
              <li>
                <Link href="/submissions" className="hover:text-white transition-colors">
                  {t.nav.submissions}
                </Link>
              </li>
              <li>
                <Link href="/achievements" className="hover:text-white transition-colors">
                  {t.nav.achievements}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Resources */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              {t.landing.footer.resources}
            </div>
            <ul className="mt-3 space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  {t.nav.dashboard}
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-white transition-colors">
                  {t.nav.settings}
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  {t.nav.login}
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  {t.nav.register}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Language & Settings */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              {lang === "uz" ? "Tilni tanlash" : "Language"}
            </div>
            <div className="mt-3">
              <LangSwitch />
            </div>
            <p className="mt-4 text-[11px] text-zinc-500">
              © {new Date().getFullYear()} {t.landing.footer.rights}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
