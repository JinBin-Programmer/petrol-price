"use client";

import { useState } from "react";
import type { FuelPrice } from "@/lib/petrol";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  fuels: FuelPrice[];
}

const TANK_PRESETS = [
  { label: "40L", value: 40 },
  { label: "45L", value: 45 },
  { label: "55L", value: 55 },
  { label: "65L", value: 65 },
  { label: "70L", value: 70 },
];

const EFFICIENCY_PRESETS = [
  { labelBm: "Axia / Bezza", labelEn: "Axia / Bezza", sublabel: "~20 km/L", value: 20 },
  { labelBm: "Vios / City",  labelEn: "Vios / City",  sublabel: "~14 km/L", value: 14 },
  { labelBm: "CR-V / Civic", labelEn: "CR-V / Civic", sublabel: "~12 km/L", value: 12 },
  { labelBm: "Hilux / 4WD",  labelEn: "Hilux / 4WD",  sublabel: "~9 km/L",  value: 9  },
];

const tx = {
  bm: {
    title: "🚗 Kalkulator Jarak & Kos",
    subtitle: "Berapa km boleh pergi? Berapa kos sebulan?",
    tankLabel: "Saiz Tangki",
    tankOther: "Lain (L)",
    litres: "liter",
    effLabel: "Penggunaan Bahan Api (km/L)",
    effOther: "Lain",
    summaryPrefix: "Anggaran dengan RON95 @",
    tankSuffix: "tangki",
    rangeLabel: "Jarak anggaran",
    costLabel: "Kos tangki penuh",
    perKmLabel: "Se-km",
    saveBm: "Jimat",
    saveEn: "per tangki berbanding harga pasaran",
    fuelHeader: "Perbandingan semua bahan api",
    colFuel: "Bahan Api",
    colRate: "RM/L",
    colFull: "Tangki penuh",
    colKm: "RM/km",
    disclaimer: "* Anggaran sahaja. Bergantung pada cara memandu, keadaan trafik & jenis kenderaan.",
    monthlyTitle: "📅 Kos Bulanan",
    monthlySubtitle: "Berapa habis sebulan untuk minyak?",
    weeklyKm: "Jarak pemanduan seminggu",
    weeklyKmPlaceholder: "cth: 300",
    kmPerWeek: "km/minggu",
    monthlyFuel: "Minyak sebulan",
    monthlyCost: "Kos minyak sebulan",
    yearlyCost: "Kos minyak setahun",
    litresPerMonth: "L/bulan",
  },
  en: {
    title: "🚗 Distance & Cost Calculator",
    subtitle: "How far can you go? What's your monthly fuel bill?",
    tankLabel: "Tank Size",
    tankOther: "Other (L)",
    litres: "litres",
    effLabel: "Fuel Consumption (km/L)",
    effOther: "Other",
    summaryPrefix: "Estimate with RON95 @",
    tankSuffix: "tank",
    rangeLabel: "Est. range",
    costLabel: "Full tank cost",
    perKmLabel: "Per km",
    saveBm: "Save",
    saveEn: "per full tank vs unsubsidised market price",
    fuelHeader: "All fuels comparison",
    colFuel: "Fuel",
    colRate: "RM/L",
    colFull: "Full tank",
    colKm: "RM/km",
    disclaimer: "* Estimates only. Depends on driving style, traffic conditions & vehicle type.",
    monthlyTitle: "📅 Monthly Cost",
    monthlySubtitle: "How much do you spend on petrol per month?",
    weeklyKm: "Weekly driving distance",
    weeklyKmPlaceholder: "e.g. 300",
    kmPerWeek: "km/week",
    monthlyFuel: "Fuel per month",
    monthlyCost: "Monthly fuel cost",
    yearlyCost: "Yearly fuel cost",
    litresPerMonth: "L/month",
  },
};

export default function TankCalculator({ fuels }: Props) {
  const { lang } = useLanguage();
  const s = tx[lang];

  const [tankSize, setTankSize] = useState(45);
  const [customTank, setCustomTank] = useState("");
  const [efficiency, setEfficiency] = useState(14);
  const [customEff, setCustomEff] = useState("");
  const [weeklyKm, setWeeklyKm] = useState("");

  const effectiveTank = parseFloat(customTank) || tankSize;
  const effectiveEff  = parseFloat(customEff)  || efficiency;

  const ron95 = fuels.find((f) => f.code === "RON95");
  const estimatedRange = effectiveTank * effectiveEff;
  const fullTankCost   = ron95 ? effectiveTank * ron95.price : 0;
  const costPerKm      = ron95 ? ron95.price / effectiveEff : 0;
  const savingPerTank  = ron95?.market_price
    ? (ron95.market_price - ron95.price) * effectiveTank
    : 0;

  // Monthly cost calculation (4.33 weeks per month average)
  const weeklyKmNum = parseFloat(weeklyKm);
  const litresPerMonth = weeklyKmNum > 0 ? (weeklyKmNum / effectiveEff) * 4.33 : null;
  const monthlyCost    = litresPerMonth && ron95 ? litresPerMonth * ron95.price : null;
  const yearlyCost     = monthlyCost ? monthlyCost * 12 : null;

  return (
    <div className="card-glass rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-white/10">
        <h2 className="font-bold text-white text-base">{s.title}</h2>
        <p className="text-xs text-white/40 mt-0.5">{s.subtitle}</p>
      </div>

      <div className="p-5 space-y-5">

        {/* Tank size */}
        <div>
          <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">
            {s.tankLabel}
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {TANK_PRESETS.map((t) => (
              <button
                key={t.value}
                onClick={() => { setTankSize(t.value); setCustomTank(""); }}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                  tankSize === t.value && !customTank
                    ? "bg-yellow-500 border-yellow-400 text-black font-bold"
                    : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder={s.tankOther}
              value={customTank}
              onChange={(e) => setCustomTank(e.target.value)}
              className="w-40 bg-white/10 border border-white/20 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-yellow-400 placeholder:text-white/30"
            />
            <span className="text-sm text-white/40">{s.litres}</span>
          </div>
        </div>

        {/* Fuel efficiency */}
        <div>
          <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">
            {s.effLabel}
          </label>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {EFFICIENCY_PRESETS.map((e) => (
              <button
                key={e.value}
                onClick={() => { setEfficiency(e.value); setCustomEff(""); }}
                className={`text-xs px-3 py-2 rounded-lg border transition-colors text-left ${
                  efficiency === e.value && !customEff
                    ? "bg-yellow-500 border-yellow-400 text-black font-bold"
                    : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                }`}
              >
                <div>{lang === "bm" ? e.labelBm : e.labelEn}</div>
                <div className={`text-xs ${efficiency === e.value && !customEff ? "text-black/60" : "text-white/40"}`}>
                  {e.sublabel}
                </div>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder={s.effOther}
              value={customEff}
              onChange={(e) => setCustomEff(e.target.value)}
              className="w-40 bg-white/10 border border-white/20 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-yellow-400 placeholder:text-white/30"
            />
            <span className="text-sm text-white/40">km/L</span>
          </div>
        </div>

        {/* Full tank results */}
        <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-700/10 border border-yellow-400/20 rounded-2xl p-5 space-y-4">
          <div className="text-xs text-yellow-300/70 uppercase tracking-wider font-semibold">
            {s.summaryPrefix} RM {ron95?.price.toFixed(2)}/L — {effectiveTank}L {s.tankSuffix}, {effectiveEff} km/L
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-2xl font-black text-white">{estimatedRange.toFixed(0)}</div>
              <div className="text-xs text-white/40 mt-0.5">km<br/>{s.rangeLabel}</div>
            </div>
            <div>
              <div className="text-2xl font-black text-yellow-300">RM {fullTankCost.toFixed(2)}</div>
              <div className="text-xs text-white/40 mt-0.5">{s.costLabel}</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">RM {costPerKm.toFixed(3)}</div>
              <div className="text-xs text-white/40 mt-0.5">{s.perKmLabel}</div>
            </div>
          </div>

          {savingPerTank > 0 && (
            <div className="bg-green-600/20 border border-green-500/30 rounded-xl px-4 py-2.5 text-sm text-green-300">
              💰 {s.saveBm} <strong>RM {savingPerTank.toFixed(2)}</strong> {s.saveEn}
            </div>
          )}
        </div>

        {/* Monthly cost calculator */}
        <div className="border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 bg-white/5 border-b border-white/10">
            <div className="font-semibold text-white text-sm">{s.monthlyTitle}</div>
            <div className="text-xs text-white/40 mt-0.5">{s.monthlySubtitle}</div>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">
                {s.weeklyKm}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder={s.weeklyKmPlaceholder}
                  value={weeklyKm}
                  onChange={(e) => setWeeklyKm(e.target.value)}
                  className="w-40 bg-white/10 border border-white/20 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-yellow-400 placeholder:text-white/30"
                />
                <span className="text-sm text-white/40">{s.kmPerWeek}</span>
              </div>
            </div>

            {monthlyCost !== null && (
              <div className="grid grid-cols-3 gap-3 text-center bg-white/5 rounded-xl p-4">
                <div>
                  <div className="text-xl font-black text-white">
                    {litresPerMonth!.toFixed(0)}
                  </div>
                  <div className="text-xs text-white/40 mt-0.5">{s.litresPerMonth}</div>
                </div>
                <div>
                  <div className="text-xl font-black text-yellow-300">
                    RM {monthlyCost.toFixed(0)}
                  </div>
                  <div className="text-xs text-white/40 mt-0.5">{s.monthlyCost}</div>
                </div>
                <div>
                  <div className="text-xl font-black text-white/70">
                    RM {yearlyCost!.toFixed(0)}
                  </div>
                  <div className="text-xs text-white/40 mt-0.5">{s.yearlyCost}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* All fuels comparison */}
        <div className="overflow-hidden rounded-xl border border-white/10">
          <div className="px-4 py-2.5 bg-white/5 text-xs text-white/40 uppercase tracking-wider font-semibold">
            {s.fuelHeader} ({effectiveTank}L, {effectiveEff} km/L)
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-white/30 uppercase tracking-wide border-b border-white/10">
                <th className="text-left px-4 py-2">{s.colFuel}</th>
                <th className="text-right px-4 py-2">{s.colRate}</th>
                <th className="text-right px-4 py-2">{s.colFull}</th>
                <th className="text-right px-4 py-2">{s.colKm}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {fuels.map((fuel) => (
                <tr key={fuel.code} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-2.5 text-white font-medium">
                    {lang === "bm" ? fuel.name_ms : fuel.name}
                  </td>
                  <td className="px-4 py-2.5 text-right text-white/60">RM {fuel.price.toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-right text-white font-bold">
                    RM {(fuel.price * effectiveTank).toFixed(2)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-white/60">
                    RM {(fuel.price / effectiveEff).toFixed(3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-white/20 text-center">{s.disclaimer}</p>
      </div>
    </div>
  );
}
