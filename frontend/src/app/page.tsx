import type { Metadata } from "next";
import { getPetrolData } from "@/lib/petrol";
import TankCalculator from "@/components/TankCalculator";
import AdBanner from "@/components/AdBanner";
import Link from "next/link";

export const revalidate = 86400; // 24 hours

export const metadata: Metadata = {
  title: "Harga Petrol Malaysia Minggu Ini — RON95 RON97 Diesel",
  description:
    "Harga petrol Malaysia terkini minggu ini. RON95 RM2.05/L, RON97 dan Diesel dikemas kini setiap Khamis. Semak harga sebelum isi minyak!",
};

const FUEL_STYLES: Record<string, { bg: string; border: string; badge: string; icon: string }> = {
  RON95:     { bg: "from-green-900/60 to-green-950/80", border: "border-green-700/50", badge: "bg-green-600", icon: "🟢" },
  RON97:     { bg: "from-red-900/60 to-red-950/80",   border: "border-red-700/50",   badge: "bg-red-600",   icon: "🔴" },
  DIESEL:    { bg: "from-blue-900/60 to-blue-950/80", border: "border-blue-700/50",  badge: "bg-blue-600",  icon: "🔵" },
  DIESEL_B10:{ bg: "from-yellow-900/60 to-yellow-950/80", border: "border-yellow-700/50", badge: "bg-yellow-600", icon: "🟡" },
};

export default async function HomePage() {
  const data = await getPetrolData();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Hero */}
      <div className="animate-in text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-orange-900/40 text-orange-300 text-xs font-semibold px-3 py-1 rounded-full border border-orange-700/40">
          <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse inline-block" />
          {data.is_fallback ? "Reference prices" : "Live from KPDNHEP"}
        </div>
        <h1 className="text-3xl font-extrabold text-white">
          Harga Petrol Malaysia
        </h1>
        <p className="text-orange-200/70 text-sm">
          Harga minggu ini · Dikemas kini setiap Khamis
        </p>
      </div>

      {/* Effective date banner */}
      <div className="animate-in delay-1 flex flex-wrap items-center justify-between gap-2 bg-orange-900/30 border border-orange-800/40 rounded-xl px-5 py-3 text-sm">
        <div>
          <span className="text-orange-200/60 text-xs uppercase tracking-wide">Berkuat kuasa</span>
          <div className="text-white font-semibold">{data.effective_date}</div>
        </div>
        <div className="text-right">
          <span className="text-orange-200/60 text-xs uppercase tracking-wide">Kemaskini seterusnya</span>
          <div className="text-orange-300 font-semibold">{data.next_update}</div>
        </div>
      </div>

      {/* Price cards */}
      <div className="grid sm:grid-cols-2 gap-4 animate-in delay-1">
        {data.fuels.map((fuel, i) => {
          const style = FUEL_STYLES[fuel.code] ?? FUEL_STYLES.RON97;
          return (
            <div
              key={fuel.code}
              className={`bg-gradient-to-br ${style.bg} border ${style.border} rounded-2xl p-6 shadow-lg`}
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{style.icon}</span>
                    <span className="font-extrabold text-white text-xl">{fuel.name}</span>
                  </div>
                  <div className="text-xs text-white/50 mt-0.5">{fuel.name_ms}</div>
                </div>
                {fuel.is_subsidised && (
                  <span className={`text-xs text-white px-2 py-0.5 rounded-full ${style.badge}`}>
                    Subsidi
                  </span>
                )}
              </div>
              <div className="text-4xl font-black text-white tabular-nums">
                RM {fuel.price.toFixed(2)}
              </div>
              <div className="text-xs text-white/50 mt-1">per litre · {fuel.note}</div>
            </div>
          );
        })}
      </div>

      {/* Ad */}
      <AdBanner slot="6666666666" format="horizontal" className="min-h-[90px] rounded-xl overflow-hidden" />

      {/* Tank calculator */}
      <div className="animate-in delay-2">
        <TankCalculator fuels={data.fuels} />
      </div>

      {/* Ad */}
      <AdBanner slot="7777777777" format="rectangle" className="min-h-[250px] rounded-xl overflow-hidden" />

      {/* Info cards */}
      <div className="grid sm:grid-cols-2 gap-4 animate-in delay-3">
        {[
          {
            icon: "📅",
            title: "When Do Prices Change?",
            body: "Malaysia's petrol prices are updated every week under the Automatic Pricing Mechanism (APM). New prices take effect from Thursday midnight. They are announced Wednesday evening by the Ministry of Finance.",
          },
          {
            icon: "🟢",
            title: "RON95 — Subsidised",
            body: "RON95 is the most common petrol in Malaysia and is subsidised by the government with a fixed ceiling price. It is suitable for most passenger cars with compression ratios below 10:1.",
          },
          {
            icon: "🔴",
            title: "RON97 — Premium",
            body: "RON97 is a premium, unsubsidised petrol that follows market prices. It is recommended for high-performance engines and turbocharged vehicles. Higher octane means less engine knock.",
          },
          {
            icon: "🔵",
            title: "Diesel — Euro 5",
            body: "Euro 5 Diesel is an unsubsidised, cleaner-burning diesel available at most stations. Diesel B10 (10% biodiesel blend) may be subsidised for eligible commercial and agricultural vehicles.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-white/5 border border-orange-900/30 rounded-2xl p-5 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{item.icon}</span>
              <h2 className="font-bold text-white text-sm">{item.title}</h2>
            </div>
            <p className="text-xs text-orange-100/60 leading-relaxed">{item.body}</p>
          </div>
        ))}
      </div>

      {/* Source note */}
      <div className="text-center text-xs text-orange-200/40 space-y-1 animate-in delay-4">
        <p>
          Source:{" "}
          <a
            href="https://www.kpdnhep.gov.my"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-orange-300"
          >
            KPDNHEP (Kementerian Perdagangan Dalam Negeri)
          </a>
        </p>
        <p>Prices are for informational reference only · Verify with your petrol station</p>
      </div>

      {/* Bottom links */}
      <div className="flex flex-wrap justify-center gap-3 text-sm pb-4">
        <Link href="/about" className="text-orange-400 hover:underline">About</Link>
        <span className="text-orange-900">·</span>
        <Link href="/privacy-policy" className="text-orange-400 hover:underline">Privacy Policy</Link>
        <span className="text-orange-900">·</span>
        <Link href="/terms" className="text-orange-400 hover:underline">Terms</Link>
      </div>
    </div>
  );
}
