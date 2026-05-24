"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="flex items-center gap-1 bg-white/10 rounded-lg p-0.5">
      <button
        onClick={() => setLang("bm")}
        className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-colors ${
          lang === "bm"
            ? "bg-yellow-500 text-black"
            : "text-white/60 hover:text-white"
        }`}
      >
        BM
      </button>
      <button
        onClick={() => setLang("en")}
        className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-colors ${
          lang === "en"
            ? "bg-yellow-500 text-black"
            : "text-white/60 hover:text-white"
        }`}
      >
        EN
      </button>
    </div>
  );
}
