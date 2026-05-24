"use client";

import Link from "next/link";
import TankCalculator from "@/components/TankCalculator";
import AdBanner from "@/components/AdBanner";
import { useLanguage } from "@/contexts/LanguageContext";
import type { PetrolData } from "@/lib/petrol";

interface Props {
  data: PetrolData;
}

const FUEL_STYLES: Record<string, {
  bg: string; border: string; badge: string; saveBadge: string; icon: string;
}> = {
  RON95:      { bg: "from-yellow-500 to-yellow-700",  border: "border-yellow-400/40", badge: "bg-yellow-600", saveBadge: "bg-green-700",  icon: "🟡" },
  RON97:      { bg: "from-green-600 to-green-800",    border: "border-green-500/40",  badge: "bg-green-700",  saveBadge: "",              icon: "🟢" },
  DIESEL:     { bg: "from-blue-600 to-blue-900",      border: "border-blue-400/40",   badge: "bg-blue-700",   saveBadge: "",              icon: "🔵" },
  DIESEL_B10: { bg: "from-gray-700 to-gray-950",      border: "border-gray-500/40",   badge: "bg-gray-600",   saveBadge: "bg-green-700",  icon: "⚫" },
};

const t = {
  bm: {
    live: "Langsung dari KPDNHEP",
    reference: "Harga Rujukan",
    h1: "⛽ Harga Petrol Malaysia",
    subtitle: "Dikemas kini setiap Khamis",
    effective: "Berkuat kuasa",
    nextUpdate: "Kemaskini seterusnya",
    subsidised: "Bersubsidi",
    noSubsidy: "tanpa subsidi",
    perLitre: "se-liter",
    save: "Jimat",
    perL: "/L",
    infoCards: [
      {
        icon: "📅",
        title: "Bila Harga Berubah?",
        body: "Dikemas kini setiap Khamis tengah malam di bawah Mekanisme Harga Automatik (APM).",
      },
      {
        icon: "🟡",
        title: "RON95 — Bersubsidi",
        body: "RON95 ialah petrol paling biasa di Malaysia dengan harga siling kerajaan. Sesuai untuk kebanyakan kereta penumpang.",
      },
      {
        icon: "🟢",
        title: "RON97 — Harga Pasaran",
        body: "RON97 ialah petrol premium tanpa subsidi mengikut harga pasaran. Disyorkan untuk enjin turbo dan berprestasi tinggi.",
      },
      {
        icon: "🔵",
        title: "Diesel Euro 5 — Harga Pasaran",
        body: "Diesel Euro 5 ialah diesel bersih tanpa subsidi. Diesel B10 mungkin bersubsidi untuk kenderaan komersial dan pertanian yang layak.",
      },
    ],
    source: "Sumber",
    disclaimer: "Harga untuk rujukan sahaja",
  },
  en: {
    live: "Live from KPDNHEP",
    reference: "Reference Price",
    h1: "⛽ Malaysia Petrol Price",
    subtitle: "Updated every Thursday",
    effective: "Effective",
    nextUpdate: "Next update",
    subsidised: "Subsidised",
    noSubsidy: "without subsidy",
    perLitre: "per litre",
    save: "Save",
    perL: "/L",
    infoCards: [
      {
        icon: "📅",
        title: "When Do Prices Change?",
        body: "Updated every Thursday midnight under Malaysia's Automatic Pricing Mechanism (APM).",
      },
      {
        icon: "🟡",
        title: "RON95 — Subsidised",
        body: "Most common petrol in Malaysia with a government ceiling price. Suitable for most passenger cars.",
      },
      {
        icon: "🟢",
        title: "RON97 — Market Price",
        body: "Premium unsubsidised petrol. Recommended for turbocharged and high-performance engines.",
      },
      {
        icon: "🔵",
        title: "Euro 5 Diesel — Market Price",
        body: "Clean unsubsidised diesel. B10 may be subsidised for eligible commercial and agricultural vehicles.",
      },
    ],
    source: "Source",
    disclaimer: "Prices are for informational reference only",
  },
};

export default function PetrolContent({ data }: Props) {
  const { lang } = useLanguage();
  const tx = t[lang];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="hero-bg">
        <div className="max-w-2xl mx-auto px-4 pt-10 pb-16 space-y-6">

          {/* Title */}
          <div className="animate-in text-center space-y-1 pt-4">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white/80 text-xs font-semibold px-3 py-1 rounded-full border border-white/20 mb-3">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
              {data.is_fallback ? tx.reference : tx.live}
            </div>
            <h1 className="text-4xl font-black text-white drop-shadow-lg">{tx.h1}</h1>
            <p className="text-white/60 text-sm">{tx.subtitle}</p>
          </div>

          {/* Effective date */}
          <div className="animate-in delay-1 card-glass rounded-2xl px-5 py-3 flex flex-wrap items-center justify-between gap-2 text-sm">
            <div>
              <div className="text-white/40 text-xs uppercase tracking-wider">{tx.effective}</div>
              <div className="text-white font-semibold">{data.effective_date}</div>
            </div>
            <div className="text-right">
              <div className="text-white/40 text-xs uppercase tracking-wider">{tx.nextUpdate}</div>
              <div className="text-yellow-300 font-semibold">{data.next_update}</div>
            </div>
          </div>

          {/* Price cards */}
          <div className="grid sm:grid-cols-2 gap-4 animate-in delay-2">
            {data.fuels.map((fuel, i) => {
              const style = FUEL_STYLES[fuel.code] ?? FUEL_STYLES.RON97;
              const saving = fuel.market_price ? parseFloat((fuel.market_price - fuel.price).toFixed(2)) : null;
              const fuelName = lang === "bm" ? fuel.name_ms : fuel.name;
              const fuelNote = lang === "bm" ? fuel.note_ms : fuel.note;

              return (
                <div
                  key={fuel.code}
                  className={`bg-gradient-to-br ${style.bg} border ${style.border} rounded-2xl p-5 shadow-xl`}
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{style.icon}</span>
                        <span className="font-extrabold text-white text-xl">{fuelName}</span>
                      </div>
                    </div>
                    {fuel.is_subsidised && (
                      <span className={`text-xs text-white px-2 py-0.5 rounded-full ${style.badge} whitespace-nowrap`}>
                        {tx.subsidised}
                      </span>
                    )}
                  </div>

                  {fuel.market_price && (
                    <div className="text-sm text-white/40 line-through mb-0.5">
                      RM {fuel.market_price.toFixed(2)}{" "}
                      <span className="no-underline text-xs">({tx.noSubsidy})</span>
                    </div>
                  )}

                  <div className="text-4xl font-black text-white tabular-nums">
                    RM {fuel.price.toFixed(2)}
                  </div>
                  <div className="text-xs text-white/40 mt-0.5">{tx.perLitre} · {fuelNote}</div>

                  {saving && saving > 0 && (
                    <div className={`mt-3 inline-flex items-center gap-1 text-xs text-white font-semibold px-2.5 py-1 rounded-full ${style.saveBadge}`}>
                      💰 {tx.save} RM {saving.toFixed(2)}{tx.perL}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content below hero */}
      <div className="max-w-2xl mx-auto px-4 pb-10 space-y-6 bg-[#0a0a0a]">

        <AdBanner slot="6666666666" format="horizontal" className="min-h-[90px] rounded-xl overflow-hidden" />

        <div className="animate-in delay-2">
          <TankCalculator fuels={data.fuels} />
        </div>

        <AdBanner slot="7777777777" format="rectangle" className="min-h-[250px] rounded-xl overflow-hidden" />

        {/* Info cards */}
        <div className="grid sm:grid-cols-2 gap-4 animate-in delay-3">
          {tx.infoCards.map((item) => (
            <div key={item.title} className="card-glass rounded-2xl p-5 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{item.icon}</span>
                <h2 className="font-bold text-white text-sm leading-tight">{item.title}</h2>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="text-center text-xs text-white/25 space-y-1 animate-in delay-4">
          <p>{tx.source}:{" "}
            <a href="https://www.kpdnhep.gov.my" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/50">KPDNHEP</a>
          </p>
          <p>{tx.disclaimer}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 text-sm pb-4">
          <Link href="/about" className="text-yellow-400 hover:underline">About</Link>
          <span className="text-white/20">·</span>
          <Link href="/privacy-policy" className="text-yellow-400 hover:underline">
            {lang === "bm" ? "Dasar Privasi" : "Privacy Policy"}
          </Link>
          <span className="text-white/20">·</span>
          <Link href="/terms" className="text-yellow-400 hover:underline">
            {lang === "bm" ? "Terma Penggunaan" : "Terms of Use"}
          </Link>
        </div>
      </div>
    </div>
  );
}
