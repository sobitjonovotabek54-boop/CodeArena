"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";
import { useLang } from "@/store/lang";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LangSwitch } from "@/components/layout/lang-switch";
import { Code2 } from "lucide-react";

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
    <div className="relative flex min-h-screen items-center justify-center bg-cosmic px-4">
      <div className="pointer-events-none absolute inset-0 starfield opacity-50" />
      <div className="relative w-full max-w-md rounded-[24px] bg-not-quite-black p-8">
        <div className="mb-4 flex justify-end">
          <LangSwitch />
        </div>
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-[12px] bg-blurple">
            <Code2 className="h-6 w-6 text-snow" />
          </div>
          <div className="font-display-discord text-2xl text-snow">CodeArena</div>
          <p className="mt-2 text-[16px] text-fog">{t.auth.registerSubtitle}</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-fog">{t.auth.username}</label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-fog">{t.auth.email}</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-fog">{t.auth.password}</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>
          {error && (
            <div className="rounded-[12px] border border-ekko-red/40 bg-ekko-red/10 p-3 text-sm text-ekko-red">
              {error}
            </div>
          )}
          <Button className="w-full" size="lg" disabled={loading}>
            {loading ? "Yaratilmoqda…" : t.auth.signUpBtn}
          </Button>
        </form>
        <p className="mt-4 text-center text-[16px] text-fog">
          {t.auth.alreadyAccount}{" "}
          <Link href="/login" className="font-medium text-hover-blurple hover:underline">
            {t.auth.signInBtn}
          </Link>
        </p>
      </div>
    </div>
  );
}
