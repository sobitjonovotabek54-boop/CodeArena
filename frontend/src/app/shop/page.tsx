"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Coins,
  Crown,
  Flame,
  Palette,
  Shield,
  Sparkles,
  Terminal,
  Trophy,
  Code2,
  Zap,
  Check,
  Gift,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Protected } from "@/components/layout/protected";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FramedAvatar } from "@/components/ui/cosmetics";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAuth } from "@/store/auth";
import { useLang } from "@/store/lang";
import type { CoinTransaction, ShopCategory, ShopItem, ShopRarity } from "@/lib/types";

const ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  crown: Crown,
  terminal: Terminal,
  flame: Flame,
  code: Code2,
  shield: Shield,
  trophy: Trophy,
  palette: Palette,
  zap: Zap,
};

const RARITY_STYLE: Record<ShopRarity, string> = {
  common: "text-greyple border-greyple/40 bg-greyple/10",
  rare: "text-vivid-cerulean border-vivid-cerulean/40 bg-vivid-cerulean/10",
  epic: "text-fuchsia border-fuchsia/40 bg-fuchsia/10",
  legendary: "text-amber-300 border-amber-400/50 bg-amber-400/10",
};

const CATEGORIES: ("all" | ShopCategory)[] = ["all", "frame", "title", "theme", "booster"];

export default function ShopPage() {
  return (
    <Protected>
      <ShopInner />
    </Protected>
  );
}

function ShopInner() {
  const { t } = useLang();
  const { user, fetchMe } = useAuth();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [coins, setCoins] = useState(0);
  const [history, setHistory] = useState<CoinTransaction[]>([]);
  const [shields, setShields] = useState(0);
  const [filter, setFilter] = useState<"all" | ShopCategory>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    const [shop, inv] = await Promise.all([
      api<{ items: ShopItem[]; user_coins: number }>("/shop/items/"),
      api<{ coins: number; streak_shields: number; transactions: CoinTransaction[] }>("/shop/inventory/"),
    ]);
    setItems(shop.items);
    setCoins(inv.coins);
    setShields(inv.streak_shields);
    setHistory(inv.transactions);
  }, []);

  useEffect(() => {
    load().catch((e) => setMessage({ ok: false, text: e instanceof Error ? e.message : String(e) }));
  }, [load]);

  const afterAction = async (text: string) => {
    setMessage({ ok: true, text });
    await Promise.all([load(), fetchMe()]);
  };

  const buy = async (item: ShopItem) => {
    setBusyId(item.item_id);
    setMessage(null);
    try {
      const res = await api<{ message: string }>("/shop/buy/", {
        method: "POST",
        body: JSON.stringify({ item_id: item.item_id }),
      });
      await afterAction(res.message);
    } catch (e) {
      setMessage({ ok: false, text: e instanceof Error ? e.message : String(e) });
    } finally {
      setBusyId(null);
    }
  };

  const toggleEquip = async (item: ShopItem) => {
    setBusyId(item.item_id);
    setMessage(null);
    try {
      const res = await api<{ message: string }>("/shop/equip/", {
        method: "POST",
        body: JSON.stringify({ item_id: item.item_id, action: item.is_equipped ? "unequip" : "equip" }),
      });
      await afterAction(res.message);
    } catch (e) {
      setMessage({ ok: false, text: e instanceof Error ? e.message : String(e) });
    } finally {
      setBusyId(null);
    }
  };

  const categoryLabel = (c: "all" | ShopCategory) =>
    c === "all" ? t.shop.all : c === "title" ? t.shop.title_ : t.shop[c];

  const visible = filter === "all" ? items : items.filter((i) => i.category === filter);

  return (
    <AppShell>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 animate-fade-up">
        <div>
          <h1 className="font-display-discord text-[36px] text-snow sm:text-[48px]">{t.shop.title}</h1>
          <p className="mt-2 text-sm text-fog">{t.shop.subtitle}</p>
        </div>
        <div className="flex items-center gap-3 rounded-[16px] border border-amber-400/40 bg-amber-400/10 px-5 py-3">
          <Coins className="h-7 w-7 text-amber-300" />
          <div>
            <div className="text-xs text-fog">{t.shop.balance}</div>
            <div className="font-mono text-2xl font-bold text-amber-300">{coins.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Coin qanday topiladi */}
      <Card className="mb-6">
        <CardContent className="flex flex-wrap items-center gap-3 p-5">
          <span className="mr-2 text-sm font-semibold text-snow">{t.shop.howToEarn}</span>
          {[
            [t.shop.earnEasy, 50],
            [t.shop.earnMedium, 150],
            [t.shop.earnHard, 300],
          ].map(([label, amount]) => (
            <span key={label} className="rounded-full bg-not-quite-black px-3 py-1 text-xs text-fog">
              {label}: <b className="text-amber-300">+{amount}</b>
            </span>
          ))}
          <Link
            href="/referrals"
            className="flex items-center gap-1.5 rounded-full bg-spring-green/15 px-3 py-1 text-xs text-spring-green hover:bg-spring-green/25"
          >
            <Gift className="h-3.5 w-3.5" /> {t.shop.earnInvite}: <b>+500</b>
          </Link>
          {shields > 0 && (
            <span className="ml-auto flex items-center gap-1.5 text-xs text-fog">
              <Shield className="h-3.5 w-3.5 text-vivid-cerulean" /> {t.shop.shields}: <b className="text-snow">{shields}</b>
            </span>
          )}
        </CardContent>
      </Card>

      {message && (
        <div
          className={cn(
            "mb-5 rounded-[12px] border p-3 text-sm",
            message.ok
              ? "border-spring-green/40 bg-spring-green/10 text-spring-green"
              : "border-ekko-red/40 bg-ekko-red/10 text-ekko-red"
          )}
        >
          {message.text}
        </div>
      )}

      <div className="mb-5 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            className={cn(
              "rounded-[12px] px-4 py-2 text-sm transition",
              filter === c ? "bg-blurple text-snow" : "bg-dark-charcoal text-fog hover:text-snow"
            )}
          >
            {categoryLabel(c)}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => {
          const Icon = ICONS[item.icon] || Sparkles;
          const accent = item.preview_data.borderColor || item.preview_data.textColor || item.preview_data.accent;
          const canAfford = coins >= item.price;
          const isBooster = item.category === "booster";
          const busy = busyId === item.item_id;
          return (
            <Card key={item.item_id} className={cn("flex flex-col", item.is_equipped && "ring-2 ring-blurple/60")}>
              <CardContent className="flex flex-1 flex-col p-5">
                <div className="mb-4 flex items-start justify-between">
                  {item.category === "frame" && user ? (
                    <FramedAvatar
                      name={user.username}
                      src={user.profile?.avatar_url}
                      frame={item.item_id}
                      size={48}
                    />
                  ) : (
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-not-quite-black"
                      style={{ color: accent || "#5865f2" }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                  )}
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                      RARITY_STYLE[item.rarity]
                    )}
                  >
                    {t.shop.rarity[item.rarity]}
                  </span>
                </div>
                <h3 className="font-semibold text-snow" style={item.category === "title" ? { color: accent } : undefined}>
                  {item.title}
                </h3>
                <p className="mt-1 flex-1 text-xs leading-relaxed text-fog">{item.description}</p>

                <div className="mt-4 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1 font-mono font-bold text-amber-300">
                    <Coins className="h-4 w-4" /> {item.price.toLocaleString()}
                  </span>
                  {item.is_owned && !isBooster ? (
                    <Button
                      size="sm"
                      variant={item.is_equipped ? "outline" : "default"}
                      disabled={busy}
                      onClick={() => toggleEquip(item)}
                    >
                      {item.is_equipped ? (
                        <>
                          <Check className="h-4 w-4" /> {t.shop.unequip}
                        </>
                      ) : (
                        t.shop.equip
                      )}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      disabled={busy || !canAfford}
                      title={canAfford ? undefined : t.shop.notEnough}
                      onClick={() => buy(item)}
                    >
                      {busy ? t.shop.buying : canAfford ? t.shop.buy : t.shop.notEnough}
                    </Button>
                  )}
                </div>
                {item.is_owned && !isBooster && (
                  <div className="mt-2 text-[11px] text-spring-green">
                    ✓ {item.is_equipped ? t.shop.equipped : t.shop.owned}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-8">
        <CardContent className="p-5">
          <h2 className="mb-3 font-semibold text-snow">{t.shop.history}</h2>
          {history.length === 0 ? (
            <p className="text-sm text-greyple">{t.shop.noHistory}</p>
          ) : (
            <ul className="divide-y divide-dim-grey/30">
              {history.map((tx) => (
                <li key={tx.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <div className="min-w-0">
                    <div className="truncate text-snow">{tx.description}</div>
                    <div className="text-xs text-greyple">{new Date(tx.created_at).toLocaleString()}</div>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 font-mono font-bold",
                      tx.amount >= 0 ? "text-spring-green" : "text-ekko-red"
                    )}
                  >
                    {tx.amount >= 0 ? "+" : ""}
                    {tx.amount}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
