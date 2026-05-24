"use client";

import { useState } from "react";
import type { FuelPrice } from "@/lib/petrol";

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
  { label: "Axia / Bezza",  sublabel: "~20 km/L", value: 20 },
  { label: "Vios / City",   sublabel: "~14 km/L", value: 14 },
  { label: "CR-V / Civic",  sublabel: "~12 km/L", value: 12 },
  { label: "Hilux / 4WD",   sublabel: "~9 km/L",  value: 9  },
];

export default function TankCalculator({ fuels }: Props) {
  const [tankSize, setTankSize] = useState(45);
  const [customTank, setCustomTank] = useState("");
  const [efficiency, setEfficiency] = useState(14);
  const [customEff, setCustomEff] = useState("");

  const effectiveTank = parseFloat(customTank) || tankSize;
  const effectiveEff  = parseFloat(customEff)  || efficiency;

  const ron95 = fuels.find((f) => f.code === "RON95");
  const estimatedRange = effectiveTank * effectiveEff;
  const fullTankCost   = ron95 ? effectiveTank * ron95.price : 0;
  const costPerKm      = ron95 ? ron95.price / effectiveEff : 0;
  const savingPerTank  = ron95?.market_price
    ? (ron95.market_price - ron95.price) * effectiveTank
    : 0;

  return (
    <div className="card-glass rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-white/10">
        <h2 className="font-bold text-white text-base">🚗 Kalkulator Jarak / Distance Calculator</h2>
        <p className="text-xs text-white/40 mt-0.5">
          Berapa km boleh pergi dengan tangki penuh? / How far can you go with a full tank?
        </p>
      </div>

      <div className="p-5 space-y-5">

        {/* Tank size */}
        <div>
          <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">
            Saiz Tangki / Tank Size
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
              placeholder="Lain / Other (L)"
              value={customTank}
              onChange={(e) => setCustomTank(e.target.value)}
              className="w-40 bg-white/10 border border-white/20 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-yellow-400 placeholder:text-white/30"
            />
            <span className="text-sm text-white/40">litres</span>
          </div>
        </div>

        {/* Fuel efficiency */}
        <div>
          <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">
            Penggunaan Bahan Api / Fuel Consumption (km/L)
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
                <div>{e.label}</div>
                <div className={`text-xs ${efficiency === e.value && !customEff ? "text-black/60" : "text-white/40"}`}>
                  {e.sublabel}
                </div>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Lain / Other"
              value={customEff}
              onChange={(e) => setCustomEff(e.target.value)}
              className="w-40 bg-white/10 border border-white/20 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-yellow-400 placeholder:text-white/30"
            />
            <span className="text-sm text-white/40">km/L</span>
          </div>
        </div>

        {/* Results panel */}
        <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-700/10 border border-yellow-400/20 rounded-2xl p-5 space-y-4">
          <div className="text-xs text-yellow-300/70 uppercase tracking-wider font-semibold">
            Anggaran dengan RON95 @ RM {ron95?.price.toFixed(2)}/L — {effectiveTank}L tangki, {effectiveEff} km/L
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-2xl font-black text-white">{estimatedRange.toFixed(0)}</div>
              <div className="text-xs text-white/40 mt-0.5">km<br/>Jarak anggaran<br/>Est. range</div>
            </div>
            <div>
              <div className="text-2xl font-black text-yellow-300">RM {fullTankCost.toFixed(2)}</div>
              <div className="text-xs text-white/40 mt-0.5">Kos tangki penuh<br/>Full tank cost</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">RM {costPerKm.toFixed(3)}</div>
              <div className="text-xs text-white/40 mt-0.5">Se-km<br/>Per km</div>
            </div>
          </div>

          {savingPerTank > 0 && (
            <div className="bg-green-600/20 border border-green-500/30 rounded-xl px-4 py-2.5 text-sm text-green-300">
              💰 Jimat <strong>RM {savingPerTank.toFixed(2)}</strong> per tangki berbanding harga pasaran
              <span className="text-green-400/50 text-xs block mt-0.5">
                You save RM {savingPerTank.toFixed(2)} per full tank vs unsubsidised market price
              </span>
            </div>
          )}
        </div>

        {/* All fuels comparison */}
        <div className="overflow-hidden rounded-xl border border-white/10">
          <div className="px-4 py-2.5 bg-white/5 text-xs text-white/40 uppercase tracking-wider font-semibold">
            Perbandingan semua bahan api / All fuels ({effectiveTank}L, {effectiveEff} km/L)
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-white/30 uppercase tracking-wide border-b border-white/10">
                <th className="text-left px-4 py-2">Bahan Api</th>
                <th className="text-right px-4 py-2">RM/L</th>
                <th className="text-right px-4 py-2">Tangki penuh</th>
                <th className="text-right px-4 py-2">RM/km</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {fuels.map((fuel) => (
                <tr key={fuel.code} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-2.5 text-white font-medium">{fuel.name}</td>
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

        <p className="text-xs text-white/20 text-center">
          * Anggaran sahaja. Bergantung pada cara memandu, keadaan trafik &amp; jenis kenderaan.
          <br />
          * Estimates only. Depends on driving style, traffic conditions &amp; vehicle type.
        </p>
      </div>
    </div>
  );
}
