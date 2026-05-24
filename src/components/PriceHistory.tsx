"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import history from "@/data/price-history.json";
import type { FuelPrice } from "@/lib/petrol";

interface Props {
  currentFuels: FuelPrice[];
}

function fmt(n: number) {
  return n.toFixed(2);
}

function trendClass(current: number, prev: number) {
  if (current > prev) return "text-red-400";
  if (current < prev) return "text-green-400";
  return "text-white/30";
}

function trendArrow(current: number, prev: number) {
  if (current > prev) return "▲";
  if (current < prev) return "▼";
  return "—";
}

export default function PriceHistory({ currentFuels }: Props) {
  const { lang } = useLanguage();

  const ron97  = currentFuels.find(f => f.code === "RON97");
  const diesel = currentFuels.find(f => f.code === "DIESEL");

  const prevRon97  = history[0].ron97;
  const prevDiesel = history[0].diesel;

  const rows = [
    {
      date: lang === "bm" ? "Minggu ini" : "This week",
      ron97:  ron97?.price  ?? 3.38,
      diesel: diesel?.price ?? 3.35,
      isCurrent: true,
    },
    ...history.map(h => ({
      date: new Date(h.date).toLocaleDateString(lang === "bm" ? "ms-MY" : "en-MY", {
        day: "numeric", month: "short", year: "numeric",
      }),
      ron97:  h.ron97,
      diesel: h.diesel,
      isCurrent: false,
    })),
  ];

  return (
    <div className="card-glass rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-white/10">
        <h2 className="font-bold text-white text-base">
          📊 {lang === "bm" ? "Sejarah Harga Pasaran / Trend Mingguan" : "Market Price History / Weekly Trend"}
        </h2>
        <p className="text-xs text-white/40 mt-0.5">
          {lang === "bm"
            ? "RON97 & Diesel Euro 5 — harga pasaran yang berubah setiap minggu. RON95 & B10 tidak disenaraikan kerana harga siling ditetapkan kerajaan."
            : "RON97 & Euro 5 Diesel — market prices that change weekly. RON95 & B10 excluded as they are government-fixed ceiling prices."}
        </p>
      </div>

      {/* Trend summary */}
      <div className="px-5 py-3 flex gap-4 border-b border-white/5 text-xs">
        {[
          { label: "RON97",       cur: ron97?.price  ?? 3.38, prev: prevRon97,  color: "text-green-300" },
          { label: "Diesel Euro 5", cur: diesel?.price ?? 3.35, prev: prevDiesel, color: "text-blue-300"  },
        ].map(f => {
          const diff = parseFloat((f.cur - f.prev).toFixed(2));
          return (
            <div key={f.label} className="flex-1 text-center">
              <div className={`font-bold ${f.color}`}>{f.label}</div>
              <div className={`text-lg font-black ${trendClass(f.cur, f.prev)}`}>
                {trendArrow(f.cur, f.prev)}
              </div>
              <div className={`font-semibold ${trendClass(f.cur, f.prev)}`}>
                {diff === 0
                  ? (lang === "bm" ? "Tiada perubahan" : "No change")
                  : `${diff > 0 ? "+" : ""}RM ${Math.abs(diff).toFixed(2)}`}
              </div>
              <div className="text-white/30">{lang === "bm" ? "vs minggu lalu" : "vs last week"}</div>
            </div>
          );
        })}
      </div>

      {/* History table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-white/30 uppercase tracking-wide border-b border-white/10">
              <th className="text-left px-4 py-2">{lang === "bm" ? "Tarikh" : "Date"}</th>
              <th className="text-right px-4 py-2">RON97</th>
              <th className="text-right px-4 py-2">Diesel Euro 5</th>
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
                <td className="px-4 py-2.5 text-white">
                  {row.date}
                  {row.isCurrent && (
                    <span className="ml-2 text-[10px] bg-yellow-500 text-black px-1.5 py-0.5 rounded-full font-bold">
                      {lang === "bm" ? "Terkini" : "Latest"}
                    </span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-right text-green-300 font-mono">
                  RM {fmt(row.ron97)}
                </td>
                <td className="px-4 py-2.5 text-right text-blue-300 font-mono">
                  RM {fmt(row.diesel)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
