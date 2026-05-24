"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

const CRUMBS: Record<string, { bm: string; en: string }> = {
  "/about":          { bm: "Tentang",       en: "About" },
  "/privacy-policy": { bm: "Dasar Privasi", en: "Privacy Policy" },
  "/terms":          { bm: "Terma",         en: "Terms" },
};

export default function Breadcrumb() {
  const pathname = usePathname();
  const { lang } = useLanguage();

  const crumb = CRUMBS[pathname];

  return (
    <div className="max-w-2xl mx-auto px-4 py-2 flex items-center gap-1.5 text-xs text-white/40">
      <span>⛽</span>
      <Link href="/" className="hover:text-white/70 transition-colors">
        {lang === "bm" ? "Harga Petrol Malaysia" : "Malaysia Petrol Price"}
      </Link>
      {crumb && (
        <>
          <span className="text-white/20">⛽</span>
          <span className="text-white/60">{lang === "bm" ? crumb.bm : crumb.en}</span>
        </>
      )}
    </div>
  );
}
