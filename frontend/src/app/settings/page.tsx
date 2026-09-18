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
import { selectClass } from "@/lib/utils";

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
        <h1 className="font-display-discord text-[36px] text-snow sm:text-[48px]">{t.settings.title}</h1>
        <p className="mt-2 text-sm text-fog">{t.settings.subtitle}</p>
      </div>

      <div className="grid max-w-4xl gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t.settings.subtitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={save} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-fog">{t.settings.bio}</label>
                <Input value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Senior Python & Full-stack dev" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-fog">Avatar URL</label>
                <Input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://..." />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-fog">{t.settings.github}</label>
                <Input value={github} onChange={(e) => setGithub(e.target.value)} placeholder="username" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-fog">{t.settings.preferredLanguage}</label>
                <select className={`${selectClass} w-full`} value={lang} onChange={(e) => setLang(e.target.value)}>
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>
              </div>
              {msg && (
                <div className="rounded-[12px] border border-spring-green/30 bg-spring-green/10 p-3 text-sm text-spring-green">
                  {msg}
                </div>
              )}
              <Button type="submit" size="lg" disabled={loading}>
                {loading ? t.settings.saving : t.settings.saveChanges}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>{t.settings.languageSection}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-fog">
              {systemLang === "uz"
                ? "CodeArena interfeysining asosiy tilini tanlang:"
                : "Select the primary interface language for CodeArena:"}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSystemLang("uz")}
                className={`flex flex-col items-center justify-center rounded-[16px] p-4 text-sm font-medium transition ${
                  systemLang === "uz"
                    ? "bg-blurple text-snow"
                    : "bg-dark-charcoal text-fog hover:text-snow"
                }`}
              >
                <span>O&apos;zbek tili</span>
                <span className="mt-0.5 text-[11px] opacity-70">Asosiy til</span>
              </button>
              <button
                type="button"
                onClick={() => setSystemLang("en")}
                className={`flex flex-col items-center justify-center rounded-[16px] p-4 text-sm font-medium transition ${
                  systemLang === "en"
                    ? "bg-blurple text-snow"
                    : "bg-dark-charcoal text-fog hover:text-snow"
                }`}
              >
                <span>English</span>
                <span className="mt-0.5 text-[11px] opacity-70">Global language</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
