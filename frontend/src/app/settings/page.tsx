"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Protected } from "@/components/layout/protected";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useAuth } from "@/store/auth";
import { useLang } from "@/store/lang";
import type { Profile } from "@/lib/types";

export default function SettingsPage() {
  return (
    <Protected>
      <SettingsInner />
    </Protected>
  );
}

function SettingsInner() {
  const { fetchMe } = useAuth();
  const { lang: systemLang, setLang: setSystemLang, t } = useLang();
  const [bio, setBio] = useState("");
  const [github, setGithub] = useState("");
  const [lang, setLang] = useState("python");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api<Profile>("/profile/me/").then((p) => {
      setBio(p.bio || "");
      setGithub(p.github_username || "");
      setLang(p.preferred_language || "python");
      setAvatarUrl(p.avatar_url || "");
    });
  }, []);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      await api("/profile/me/", {
        method: "PATCH",
        body: JSON.stringify({
          bio,
          github_username: github,
          preferred_language: lang,
          avatar_url: avatarUrl,
        }),
      });
      await fetchMe();
      setMsg(t.settings.savedSuccess);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="mb-6 animate-fade-up">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold">
          {t.settings.title}
        </h1>
        <p className="mt-1 text-sm text-zinc-400">{t.settings.subtitle}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
        {/* Profile Settings */}
        <Card className="border-zinc-800/80 bg-zinc-900/40 backdrop-blur">
          <CardHeader>
            <CardTitle>{t.settings.subtitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={save} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-400">
                  {t.settings.bio}
                </label>
                <Input
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Senior Python & Full-stack dev"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-400">
                  Avatar URL
                </label>
                <Input
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-400">
                  {t.settings.github}
                </label>
                <Input
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="username"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-400">
                  {t.settings.preferredLanguage}
                </label>
                <select
                  className="h-10 w-full rounded-xl border border-zinc-700/80 bg-zinc-900 px-3 text-sm text-zinc-200"
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                >
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>
              </div>
              {msg && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400">
                  {msg}
                </div>
              )}
              <Button type="submit" disabled={loading}>
                {loading ? t.settings.saving : t.settings.saveChanges}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* System Language Preference */}
        <Card className="border-zinc-800/80 bg-zinc-900/40 backdrop-blur h-fit">
          <CardHeader>
            <CardTitle>{t.settings.languageSection}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-zinc-400">
              {systemLang === "uz"
                ? "CodeArena interfeysining asosiy tilini tanlang:"
                : "Select the primary interface language for CodeArena:"}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSystemLang("uz")}
                className={`flex flex-col items-center justify-center rounded-xl border p-4 text-sm font-semibold transition-all duration-150 active:scale-[0.97] ${
                  systemLang === "uz"
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                    : "border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                }`}
              >
                <span className="text-2xl mb-1">🇺🇿</span>
                <span>O&apos;zbek tili</span>
                <span className="text-[11px] text-zinc-500 font-normal mt-0.5">Asosiy til</span>
              </button>

              <button
                type="button"
                onClick={() => setSystemLang("en")}
                className={`flex flex-col items-center justify-center rounded-xl border p-4 text-sm font-semibold transition-all duration-150 active:scale-[0.97] ${
                  systemLang === "en"
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                    : "border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                }`}
              >
                <span className="text-2xl mb-1">🇬🇧</span>
                <span>English</span>
                <span className="text-[11px] text-zinc-500 font-normal mt-0.5">Global language</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
