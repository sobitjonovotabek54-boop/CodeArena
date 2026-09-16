"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";
import { useLang } from "@/store/lang";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LangSwitch } from "@/components/layout/lang-switch";

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const { t } = useLang();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await register(username, email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ro'yxatdan o'tishda xatolik yuz berdi");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#07090d] px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur">
        <div className="mb-4 flex justify-end">
          <LangSwitch />
        </div>
        <div className="mb-6 text-center">
          <div className="font-[family-name:var(--font-display)] text-2xl font-bold">
            Code<span className="text-emerald-400">Arena</span>
          </div>
          <p className="mt-1 text-sm text-zinc-400">{t.auth.registerSubtitle}</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              {t.auth.username}
            </label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              {t.auth.email}
            </label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              {t.auth.password}
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>
          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-400">
              {error}
            </div>
          )}
          <Button className="w-full" disabled={loading}>
            {loading ? "Yaratilmoqda…" : t.auth.signUpBtn}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-zinc-400">
          {t.auth.alreadyAccount}{" "}
          <Link href="/login" className="text-emerald-400 font-semibold hover:underline">
            {t.auth.signInBtn}
          </Link>
        </p>
      </div>
    </div>
  );
}
