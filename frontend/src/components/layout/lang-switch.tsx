"use client";

import { useLang } from "@/store/lang";

export function LangSwitch({ className }: { className?: string }) {
  const { lang, setLang } = useLang();

  return (
    <div
      className={`inline-flex items-center rounded-[12px] border border-dim-grey/60 bg-not-quite-black p-0.5 text-xs font-medium ${
        className || ""
      }`}
    >
      <button
        type="button"
        onClick={() => setLang("uz")}
        className={`rounded-[10px] px-2.5 py-1 transition-colors ${
          lang === "uz" ? "bg-blurple text-snow" : "text-fog hover:text-snow"
        }`}
        title="O'zbek tili"
      >
        UZ
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`rounded-[10px] px-2.5 py-1 transition-colors ${
          lang === "en" ? "bg-blurple text-snow" : "text-fog hover:text-snow"
        }`}
        title="English"
      >
        EN
      </button>
    </div>
  );
}
