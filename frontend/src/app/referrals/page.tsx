"use client";

import { useEffect, useState } from "react";
import { Check, Coins, Copy, Gift, Send, UserPlus, Users } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Protected } from "@/components/layout/protected";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FramedAvatar } from "@/components/ui/cosmetics";
import { api } from "@/lib/api";
import { useLang } from "@/store/lang";
import type { ReferralInfo } from "@/lib/types";

export default function ReferralsPage() {
  return (
    <Protected>
      <ReferralsInner />
    </Protected>
  );
}

function ReferralsInner() {
  const { t } = useLang();
  const [info, setInfo] = useState<ReferralInfo | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<"code" | "link" | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
    api<ReferralInfo>("/referrals/")
      .then(setInfo)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  const link = info ? `${origin}/register?ref=${encodeURIComponent(info.referral_code)}` : "";

  const copy = async (text: string, which: "code" | "link") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* clipboard ruxsat berilmagan bo'lishi mumkin */
    }
  };

  const steps = [
    { icon: Send, text: t.referral.step1 },
    { icon: UserPlus, text: t.referral.step2 },
    { icon: Coins, text: t.referral.step3 },
  ];

  return (
    <AppShell>
      <div className="mb-8 animate-fade-up">
        <h1 className="font-display-discord text-[36px] text-snow sm:text-[48px]">{t.referral.title}</h1>
        <p className="mt-2 text-sm text-fog">{t.referral.subtitle}</p>
      </div>

      {error && (
        <div className="mb-5 rounded-[12px] border border-ekko-red/40 bg-ekko-red/10 p-3 text-sm text-ekko-red">
          {error}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="space-y-5 p-6">
            <div>
              <div className="mb-1.5 text-sm font-medium text-fog">{t.referral.yourCode}</div>
              <div className="flex gap-2">
                <div className="flex-1 truncate rounded-[12px] bg-not-quite-black px-4 py-3 font-mono text-lg font-bold tracking-wider text-snow">
                  {info?.referral_code ?? "…"}
                </div>
                <Button size="sm" disabled={!info} onClick={() => info && copy(info.referral_code, "code")}>
                  {copied === "code" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied === "code" ? t.referral.copied : t.referral.copy}
                </Button>
              </div>
            </div>
            <div>
              <div className="mb-1.5 text-sm font-medium text-fog">{t.referral.yourLink}</div>
              <div className="flex gap-2">
                <div className="flex-1 truncate rounded-[12px] bg-not-quite-black px-4 py-3 font-mono text-sm text-fog">
                  {link || "…"}
                </div>
                <Button size="sm" variant="outline" disabled={!info} onClick={() => copy(link, "link")}>
                  {copied === "link" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied === "link" ? t.referral.copied : t.referral.copy}
                </Button>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {steps.map(({ icon: Icon, text }, i) => (
                <div key={i} className="rounded-[12px] bg-not-quite-black p-4">
                  <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-blurple/20 text-hover-blurple">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="text-xs text-fog">
                    <b className="text-snow">{i + 1}.</b> {text}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-blurple/20 text-hover-blurple">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs text-fog">{t.referral.invited}</div>
                <div className="font-mono text-3xl font-bold text-snow">{info?.total_referrals ?? 0}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-amber-400/15 text-amber-300">
                <Coins className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs text-fog">{t.referral.earned}</div>
                <div className="font-mono text-3xl font-bold text-amber-300">
                  {(info?.total_earned_coins ?? 0).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <CardContent className="p-6">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-snow">
            <Gift className="h-4 w-4 text-spring-green" /> {t.referral.friends}
          </h2>
          {!info || info.referrals.length === 0 ? (
            <p className="text-sm text-greyple">{t.referral.noFriends}</p>
          ) : (
            <ul className="divide-y divide-dim-grey/30">
              {info.referrals.map((f) => (
                <li key={f.id} className="flex items-center gap-3 py-3">
                  <FramedAvatar name={f.username} src={f.avatar_url} size={36} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-snow">{f.username}</div>
                    <div className="text-xs text-greyple">
                      Lv {f.level} · {new Date(f.date_joined).toLocaleDateString()} {t.referral.joined}
                    </div>
                  </div>
                  <span className="font-mono font-bold text-spring-green">+{f.reward_coins}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
