"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import history from "@/data/price-history.json";
import type { FuelPrice } from "@/lib/petrol";

interface Props {
  currentFuels: FuelPrice[];
}

function fmt(n: number) { return n.toFixed(2); }

function trendClass(cur: number, prev: number) {
  if (cur > prev) return "text-red-400";
  if (cur < prev) return "text-green-400";
  return "text-white/30";
}
function trendArrow(cur: number, prev: number) {
  if (cur > prev) return "▲";
  if (cur < prev) return "▼";
  return "—";
}

// RON95 market price ≈ RON97 × 0.92
function ron95Market(ron97: number) {
  return parseFloat((ron97 * 0.92).toFixed(2));
}

export default function PriceHistory({ currentFuels }: Props) {
  const { lang } = useLanguage();

  const ron95  = currentFuels.find(f => f.code === "RON95");
  const ron97  = currentFuels.find(f => f.code === "RON97");
  const diesel = currentFuels.find(f => f.code === "DIESEL");
  const b10    = currentFuels.find(f => f.code === "DIESEL_B10");

  const curRon95Market  = ron95?.market_price  ?? ron95Market(ron97?.price ?? 3.38);
  const curRon97        = ron97?.price  ?? 3.38;
  const curDiesel       = diesel?.price ?? 3.35;
  const curB10Market    = b10?.market_price ?? curDiesel;

  const prevRon95Market = ron95Market(history[0].ron97);
  const prevRon97       = history[0].ron97;
  const prevDiesel      = history[0].diesel;
  const prevB10Market   = history[0].diesel; // B10 market = Euro5 diesel price

  const rows = [
    {
      date: lang === "bm" ? "Minggu ini" : "This week",
      ron95Market: curRon95Market,
      ron97:       curRon97,
      diesel:      curDiesel,
      b10Market:   curB10Market,
      isCurrent: true,
    },
    ...history.map(h => ({
      date: new Date(h.date).toLocaleDateString(lang === "bm" ? "ms-MY" : "en-MY", {
        day: "numeric", month: "short", year: "numeric",
      }),
      ron95Market: ron95Market(h.ron97),
      ron97:       h.ron97,
      diesel:      h.diesel,
      b10Market:   h.diesel,
      isCurrent: false,
    })),
  ];

  const trendItems = [
    { label: "RON95",         sublabel: lang === "bm" ? "tanpa subsidi" : "unsubsidised", cur: curRon95Market,  prev: prevRon95Market, color: "text-yellow-300" },
    { label: "RON97",         sublabel: lang === "bm" ? "harga pasaran" : "market price", cur: curRon97,         prev: prevRon97,        color: "text-green-300"  },
    { label: "Diesel Euro 5", sublabel: lang === "bm" ? "harga pasaran" : "market price", cur: curDiesel,        prev: prevDiesel,       color: "text-blue-300"   },
    { label: "Diesel B10",    sublabel: lang === "bm" ? "tanpa subsidi" : "unsubsidised", cur: curB10Market,     prev: prevB10Market,    color: "text-gray-300"   },
  ];

  return (
    <div className="card-glass rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-white/10">
        <h2 className="font-bold text-white text-base">
          📊 {lang === "bm" ? "Sejarah Harga Pasaran / Trend Mingguan" : "Market Price History / Weekly Trend"}
        </h2>
        <p className="text-xs text-white/40 mt-0.5">
          {lang === "bm"
            ? "Harga pasaran (tanpa subsidi) — penting untuk pengguna yang telah melebihi had subsidi."
            : "Unsubsidised market prices — important for users who have exceeded their subsidy quota."}
        </p>
      </div>

      {/* Subsidised fixed price info bar */}
      <div className="px-5 py-2.5 bg-yellow-500/10 border-b border-yellow-400/20 flex flex-wrap gap-x-6 gap-y-1 text-xs">
        <span className="text-yellow-300/70 font-semibold">
          🔒 {lang === "bm" ? "Harga siling bersubsidi (tetap):" : "Fixed subsidised ceiling price:"}
        </span>
        <span className="text-white/60">🟡 RON95 — <strong className="text-white">RM 2.05</strong>/L</span>
        <span className="text-white/60">⚫ Diesel B10 — <strong className="text-white">RM 2.15</strong>/L</span>
      </div>

      {/* Trend summary */}
      <div className="px-5 py-3 grid grid-cols-4 gap-2 border-b border-white/5 text-xs">
        {trendItems.map(f => {
          const diff = parseFloat((f.cur - f.prev).toFixed(2));
          return (
            <div key={f.label} className="text-center">
              <div className={`font-bold ${f.color} leading-tight`}>{f.label}</div>
              <div className="text-white/25 text-[10px] mb-1">{f.sublabel}</div>
              <div className={`text-base font-black ${trendClass(f.cur, f.prev)}`}>
                {trendArrow(f.cur, f.prev)}
              </div>
              <div className={`font-semibold ${trendClass(f.cur, f.prev)}`}>
                {diff === 0
                  ? (lang === "bm" ? "Sama" : "Same")
                  : `${diff > 0 ? "+" : ""}RM${Math.abs(diff).toFixed(2)}`}
              </div>
              <div className="text-white/25 text-[10px]">{lang === "bm" ? "vs minggu lalu" : "vs last week"}</div>
            </div>
          );
        })}
      </div>

      {/* History table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-white/30 uppercase tracking-wide border-b border-white/10">
              <th className="text-left px-4 py-2">{lang === "bm" ? "Tarikh" : "Date"}</th>
              <th className="text-right px-3 py-2">
                <div className="text-yellow-300">RON95</div>
                <div className="text-white/25 normal-case font-normal">{lang === "bm" ? "tanpa subsidi" : "unsubsidised"}</div>
              </th>
              <th className="text-right px-3 py-2">
                <div className="text-green-300">RON97</div>
                <div className="text-white/25 normal-case font-normal">{lang === "bm" ? "harga pasaran" : "market"}</div>
              </th>
              <th className="text-right px-3 py-2">
                <div className="text-blue-300">Diesel</div>
                <div className="text-white/25 normal-case font-normal">{lang === "bm" ? "Euro 5" : "Euro 5"}</div>
              </th>
              <th className="text-right px-3 py-2">
                <div className="text-gray-300">B10</div>
                <div className="text-white/25 normal-case font-normal">{lang === "bm" ? "tanpa subsidi" : "unsubsidised"}</div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((row, i) => (
              <tr
                key={i}
                className={row.isCurrent
                  ? "bg-yellow-500/10 font-semibold"
                  : "hover:bg-white/5 transition-colors"}
              >
                <td className="px-4 py-2.5 text-white text-xs">
                  {row.date}
                  {row.isCurrent && (
                    <span className="ml-1.5 text-[10px] bg-yellow-500 text-black px-1.5 py-0.5 rounded-full font-bold">
                      {lang === "bm" ? "Terkini" : "Latest"}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2.5 text-right text-yellow-300 font-mono">RM {fmt(row.ron95Market)}</td>
                <td className="px-3 py-2.5 text-right text-green-300 font-mono">RM {fmt(row.ron97)}</td>
                <td className="px-3 py-2.5 text-right text-blue-300 font-mono">RM {fmt(row.diesel)}</td>
                <td className="px-3 py-2.5 text-right text-gray-300 font-mono">RM {fmt(row.b10Market)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-2.5 text-[10px] text-white/20 border-t border-white/5">
        {lang === "bm"
          ? "* Harga tanpa subsidi adalah anggaran. RON95 ≈ RON97 × 0.92. Sahkan di KPDNHEP."
          : "* Unsubsidised prices are estimates. RON95 ≈ RON97 × 0.92. Verify at KPDNHEP."}
      </div>
    </div>
  );
}
