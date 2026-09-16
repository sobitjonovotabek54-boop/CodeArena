"use client";

import { useLang } from "@/store/lang";

export function LangSwitch({ className }: { className?: string }) {
  const { lang, setLang } = useLang();

  return (
    <div
      className={`inline-flex items-center rounded-xl border border-zinc-800 bg-zinc-900/70 p-0.5 text-xs font-semibold backdrop-blur-sm ${
        className || ""
      }`}
    >
      <button
        type="button"
        onClick={() => setLang("uz")}
        className={`flex items-center gap-1 rounded-lg px-2.5 py-1 transition-all duration-150 ${
          lang === "uz"
            ? "bg-gradient-to-b from-emerald-400 to-emerald-500 font-bold text-zinc-950 shadow-[0_1px_6px_rgba(16,185,129,0.35)]"
            : "text-zinc-400 hover:text-zinc-200"
        }`}
        title="O'zbek tili"
      >
        <span>🇺🇿</span> UZ
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`flex items-center gap-1 rounded-lg px-2.5 py-1 transition-all duration-150 ${
          lang === "en"
            ? "bg-gradient-to-b from-emerald-400 to-emerald-500 font-bold text-zinc-950 shadow-[0_1px_6px_rgba(16,185,129,0.35)]"
            : "text-zinc-400 hover:text-zinc-200"
        }`}
        title="English"
      >
        <span>🇬🇧</span> EN
      </button>
    </div>
  );
}
