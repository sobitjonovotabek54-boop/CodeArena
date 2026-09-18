"use client";

import Link from "next/link";
import {
  ArrowRight,
  Code2,
  Trophy,
  Zap,
  CheckCircle2,
  Terminal,
  ShieldCheck,
  Flame,
  Globe2,
  Play,
} from "lucide-react";
import { useLang } from "@/store/lang";
import { LangSwitch } from "@/components/layout/lang-switch";

export default function HomePage() {
  const { t, lang } = useLang();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-cosmic text-snow selection:bg-blurple/40">
      <div className="pointer-events-none absolute inset-0 starfield opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_10%,rgba(88,101,242,0.22),transparent_50%),radial-gradient(ellipse_at_10%_40%,rgba(235,69,158,0.08),transparent_45%)]" />

      {/* Nav — frosted strip */}
      <header className="sticky top-0 z-50 w-full bg-snow/10 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-blurple">
              <Code2 className="h-5 w-5 text-snow" strokeWidth={2.5} />
            </span>
            <span className="font-display-discord text-lg text-snow tracking-tight">
              CodeArena
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/problems" className="text-[16px] font-medium tracking-[0.014em] text-snow hover:underline">
              {t.nav.problems}
            </Link>
            <Link href="/leaderboard" className="text-[16px] font-medium tracking-[0.014em] text-snow hover:underline">
              {t.nav.leaderboard}
            </Link>
            <Link href="/achievements" className="text-[16px] font-medium tracking-[0.014em] text-snow hover:underline">
              {t.nav.achievements}
            </Link>
            <Link href="/submissions" className="text-[16px] font-medium tracking-[0.014em] text-snow hover:underline">
              {t.nav.submissions}
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <LangSwitch />
            <Link
              href="/login"
              className="hidden rounded-[16px] border border-void bg-snow px-4 py-2.5 text-[16px] font-medium text-void sm:inline-flex"
            >
              {t.nav.login}
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center rounded-[12px] bg-blurple px-4 py-[10px] text-[16px] font-medium text-snow hover:bg-dark-blurple"
            >
              {t.nav.getStarted}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-64px)] max-w-[1200px] items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:py-0">
        <div className="animate-fade-up">
          <h1 className="font-display-discord max-w-[520px] text-[36px] text-snow sm:text-[56px] sm:leading-[0.86] lg:text-[61px]">
            {lang === "uz"
              ? "KOD YOZ. BELLASH. LEVEL UP."
              : "CODE. COMPETE. LEVEL UP."}
          </h1>
          <p className="mt-6 max-w-[380px] text-[16px] leading-[1.5] tracking-[0.014em] text-fog">
            {t.landing.description}
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-blurple px-6 py-[19.5px] text-[16px] font-medium tracking-[0.016em] text-snow hover:bg-dark-blurple"
            >
              {t.landing.startCompeting}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/problems"
              className="inline-flex items-center justify-center gap-2 rounded-[12px] border border-not-quite-black bg-snow px-6 py-[15px] text-[16px] font-medium tracking-[0.016em] text-not-quite-black hover:bg-off-white"
            >
              {t.landing.browseProblems}
            </Link>
          </div>
        </div>

        {/* Product mock + floating mascots */}
        <div className="relative animate-fade-up-delay">
          <div className="animate-float absolute -left-4 top-8 z-20 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-ember-orange to-ekko-red sm:h-20 sm:w-20">
            <Trophy className="h-8 w-8 text-snow" />
          </div>
          <div className="animate-drift absolute -right-2 bottom-16 z-20 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-spring-green to-vivid-cerulean sm:h-16 sm:w-16">
            <Zap className="h-7 w-7 text-void" />
          </div>
          <div className="animate-float absolute right-8 top-0 z-20 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia to-blurple [animation-delay:1s]">
            <Code2 className="h-6 w-6 text-snow" />
          </div>

          <div className="relative overflow-hidden rounded-[16px] bg-not-quite-black">
            <div className="flex items-center gap-2 border-b border-dim-grey/50 bg-dark-charcoal px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-ekko-red/80" />
              <span className="h-3 w-3 rounded-full bg-ember-orange/80" />
              <span className="h-3 w-3 rounded-full bg-spring-green/80" />
              <span className="ml-3 font-mono text-xs text-greyple">two_sum.py</span>
              <span className="ml-auto flex items-center gap-1.5 text-xs text-spring-green">
                <span className="h-2 w-2 animate-pulse rounded-full bg-spring-green" />
                Online
              </span>
            </div>
            <div className="grid sm:grid-cols-5">
              <div className="border-b border-dim-grey/40 bg-not-quite-black p-4 font-mono text-[12px] leading-relaxed text-fog sm:col-span-3 sm:border-b-0 sm:border-r">
                <div>
                  <span className="text-hover-blurple">def</span>{" "}
                  <span className="text-ember-orange">two_sum</span>
                  <span className="text-fog">(nums, target):</span>
                </div>
                <div className="pl-4 text-greyple"># O(n) hashmap</div>
                <div className="pl-4">seen = {"{}"}</div>
                <div className="pl-4">
                  <span className="text-hover-blurple">for</span> i, n{" "}
                  <span className="text-hover-blurple">in</span> enumerate(nums):
                </div>
                <div className="pl-8">
                  <span className="text-hover-blurple">if</span> target - n{" "}
                  <span className="text-hover-blurple">in</span> seen:
                </div>
                <div className="pl-12">
                  <span className="text-hover-blurple">return</span> [seen[target - n], i]
                </div>
                <div className="pl-8">seen[n] = i</div>
              </div>
              <div className="bg-dark-charcoal p-4 sm:col-span-2">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-snow">Tests</span>
                  <span className="rounded-full bg-spring-green/15 px-2 py-0.5 text-[10px] font-medium text-spring-green">
                    Accepted
                  </span>
                </div>
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="mb-2 flex items-center gap-2 rounded-[12px] bg-not-quite-black px-3 py-2 text-xs text-fog"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-spring-green" />
                    Case {n}
                    <span className="ml-auto font-mono text-greyple">{8 + n}ms</span>
                  </div>
                ))}
                <div className="mt-4 flex items-center gap-2 text-xs text-ember-orange">
                  <Flame className="h-3.5 w-3.5" />
                  +25 XP
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature panel — purple/magenta */}
      <section className="relative z-10 mx-auto max-w-[1100px] px-4 py-20 sm:px-6">
        <div className="grid items-center gap-10 overflow-hidden rounded-[24px] bg-gradient-to-br from-[#8B31A0] to-[#E040A0] p-8 sm:p-12 lg:grid-cols-2">
          <div className="order-2 overflow-hidden rounded-[16px] bg-not-quite-black lg:order-1">
            <div className="border-b border-dim-grey/40 bg-dark-charcoal px-4 py-3 text-xs text-fog">
              CodeArena IDE
            </div>
            <div className="space-y-3 p-5">
              <div className="h-3 w-3/4 rounded bg-dim-grey/50" />
              <div className="h-3 w-1/2 rounded bg-dim-grey/40" />
              <div className="mt-4 flex gap-2">
                <span className="rounded-[12px] bg-blurple px-3 py-2 text-xs font-medium text-snow">
                  <Play className="mr-1 inline h-3 w-3" />
                  Run
                </span>
                <span className="rounded-[12px] bg-snow px-3 py-2 text-xs font-medium text-not-quite-black">
                  Submit
                </span>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="font-display-discord text-[36px] text-snow sm:text-[48px] sm:leading-[0.93]">
              {lang === "uz" ? "PRO IDE BILAN YECHING" : "SOLVE IN A PRO IDE"}
            </h2>
            <p className="mt-4 max-w-[360px] text-[16px] leading-[1.5] text-snow/90">
              {t.landing.features.proIdeDesc}
            </p>
          </div>
        </div>
      </section>

      {/* Feature panel — green */}
      <section className="relative z-10 mx-auto max-w-[1100px] px-4 pb-20 sm:px-6">
        <div className="grid items-center gap-10 overflow-hidden rounded-[24px] bg-gradient-to-br from-[#0a7a4a] to-[#3ba55d] p-8 sm:p-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display-discord text-[36px] text-snow sm:text-[48px] sm:leading-[0.93]">
              {lang === "uz" ? "XP, STREAK VA REYTING" : "XP, STREAKS & RANKS"}
            </h2>
            <p className="mt-4 max-w-[360px] text-[16px] leading-[1.5] text-snow/90">
              {t.landing.features.gamifiedDesc}
            </p>
          </div>
          <div className="relative overflow-hidden rounded-[16px] bg-not-quite-black p-5">
            {[
              { name: "Jahongir_Dev", xp: "1450 XP", rank: "#1" },
              { name: "Malika_Code", xp: "1180 XP", rank: "#2" },
              { name: "Bobur_Algo", xp: "950 XP", rank: "#3" },
            ].map((row) => (
              <div
                key={row.name}
                className="mb-2 flex items-center justify-between rounded-[12px] bg-dark-charcoal px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blurple text-xs font-bold text-snow">
                    {row.rank}
                  </span>
                  <span className="text-sm font-medium text-snow">{row.name}</span>
                </div>
                <span className="font-mono text-xs text-spring-green">{row.xp}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — dark charcoal stage */}
      <section className="relative z-10 mx-auto max-w-[1100px] px-4 pb-20 sm:px-6">
        <div className="rounded-[24px] bg-not-quite-black p-8 sm:p-12">
          <h2 className="font-display-discord text-center text-[36px] text-snow sm:text-[48px]">
            {t.landing.howItWorks.title}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-[16px] text-fog">
            {t.landing.howItWorks.subtitle}
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: "01", title: t.landing.howItWorks.step1Title, desc: t.landing.howItWorks.step1Desc, icon: Code2 },
              { n: "02", title: t.landing.howItWorks.step2Title, desc: t.landing.howItWorks.step2Desc, icon: Terminal },
              { n: "03", title: t.landing.howItWorks.step3Title, desc: t.landing.howItWorks.step3Desc, icon: Zap },
              { n: "04", title: t.landing.howItWorks.step4Title, desc: t.landing.howItWorks.step4Desc, icon: Trophy },
            ].map((step) => (
              <div key={step.n} className="rounded-[16px] bg-dark-charcoal p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-blurple/20 text-blurple">
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="mt-3 font-mono text-xs text-greyple">{step.n}</div>
                <h3 className="mt-1 text-[16px] font-medium text-snow">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fog">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="relative z-10 mx-auto max-w-[1100px] px-4 pb-20 sm:px-6">
        <h2 className="font-display-discord text-center text-[36px] text-snow sm:text-[48px]">
          {t.landing.features.title}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-[16px] text-fog">
          {t.landing.features.subtitle}
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Code2, title: t.landing.features.proIde, desc: t.landing.features.proIdeDesc },
            { icon: ShieldCheck, title: t.landing.features.runner, desc: t.landing.features.runnerDesc },
            { icon: Flame, title: t.landing.features.gamified, desc: t.landing.features.gamifiedDesc },
            { icon: Trophy, title: t.landing.features.leaderboard, desc: t.landing.features.leaderboardDesc },
            { icon: Zap, title: t.landing.features.analytics, desc: t.landing.features.analyticsDesc },
            { icon: Globe2, title: t.landing.features.bilingual, desc: t.landing.features.bilingualDesc },
          ].map((f) => (
            <div key={f.title} className="rounded-[16px] bg-dark-charcoal p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-blurple text-snow">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-[16px] font-medium text-snow">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fog">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 mx-auto max-w-[1100px] px-4 pb-20 sm:px-6">
        <div className="rounded-[24px] bg-gradient-to-br from-blurple to-[#3442d9] px-8 py-14 text-center sm:px-16">
          <h2 className="font-display-discord text-[36px] text-snow sm:text-[48px]">
            {t.landing.cta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[16px] text-snow/90">{t.landing.cta.subtitle}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-[12px] bg-snow px-6 py-[15px] text-[16px] font-medium text-not-quite-black hover:bg-off-white"
            >
              {t.landing.cta.buttonPrimary}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/problems"
              className="inline-flex items-center rounded-[12px] border border-snow px-6 py-[15px] text-[16px] font-medium text-snow hover:bg-snow/10"
            >
              {t.landing.cta.buttonSecondary}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t-0 bg-not-quite-black">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-[12px] bg-blurple">
                <Code2 className="h-4 w-4 text-snow" />
              </span>
              <span className="font-display-discord text-base text-snow">CodeArena</span>
            </Link>
            <p className="mt-4 max-w-sm text-[16px] leading-[1.5] text-fog">
              {t.landing.footer.description}
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-spring-green">
              <span className="h-2 w-2 animate-pulse rounded-full bg-spring-green" />
              {t.landing.footer.status}
            </div>
          </div>
          <div>
            <div className="text-[16px] font-medium tracking-[0.013em] text-snow">
              {t.landing.footer.platform}
            </div>
            <ul className="mt-3 space-y-2 text-[16px] leading-[1.5] text-fog">
              <li><Link href="/problems" className="hover:underline">{t.nav.problems}</Link></li>
              <li><Link href="/leaderboard" className="hover:underline">{t.nav.leaderboard}</Link></li>
              <li><Link href="/achievements" className="hover:underline">{t.nav.achievements}</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-[16px] font-medium tracking-[0.013em] text-snow">
              {t.landing.footer.resources}
            </div>
            <ul className="mt-3 space-y-2 text-[16px] leading-[1.5] text-fog">
              <li><Link href="/dashboard" className="hover:underline">{t.nav.dashboard}</Link></li>
              <li><Link href="/settings" className="hover:underline">{t.nav.settings}</Link></li>
              <li><Link href="/login" className="hover:underline">{t.nav.login}</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-[16px] font-medium tracking-[0.013em] text-snow">
              {lang === "uz" ? "Til" : "Language"}
            </div>
            <div className="mt-3">
              <LangSwitch />
            </div>
            <p className="mt-6 text-sm text-greyple">
              © {new Date().getFullYear()} {t.landing.footer.rights}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
