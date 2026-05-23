"use client";

import { useState } from "react";
import type { FuelPrice } from "@/lib/petrol";

interface Props {
  fuels: FuelPrice[];
}

const TANK_SIZES = [
  { label: "40L (small car)", value: 40 },
  { label: "45L (sedan)", value: 45 },
  { label: "55L (SUV)", value: 55 },
  { label: "65L (MPV/4x4)", value: 65 },
  { label: "70L (pickup truck)", value: 70 },
];

export default function TankCalculator({ fuels }: Props) {
  const [tankSize, setTankSize] = useState(45);
  const [customSize, setCustomSize] = useState("");

  const effectiveTank = customSize ? parseFloat(customSize) || 45 : tankSize;

  return (
    <div className="bg-white/5 border border-orange-900/40 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-orange-900/30 bg-orange-950/30">
        <h2 className="font-bold text-white">⛽ Full Tank Cost Calculator</h2>
        <p className="text-xs text-orange-200/60 mt-0.5">How much to fill up today?</p>
      </div>

      <div className="p-5 space-y-4">
        {/* Tank size selector */}
        <div className="flex flex-wrap gap-2">
          {TANK_SIZES.map((t) => (
            <button
              key={t.value}
              onClick={() => { setTankSize(t.value); setCustomSize(""); }}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                tankSize === t.value && !customSize
                  ? "bg-orange-500 border-orange-400 text-white"
                  : "bg-white/5 border-white/10 text-orange-200 hover:bg-white/10"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Custom size */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Custom litres"
            value={customSize}
            onChange={(e) => setCustomSize(e.target.value)}
            className="w-36 bg-white/10 border border-white/20 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 placeholder:text-orange-200/40"
          />
          <span className="text-sm text-orange-200/60">litres</span>
        </div>

        {/* Results table */}
        <div className="overflow-hidden rounded-xl border border-orange-900/30">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-orange-950/50 text-xs text-orange-200/60 uppercase tracking-wide">
                <th className="text-left px-4 py-2.5">Fuel</th>
                <th className="text-right px-4 py-2.5">Per litre</th>
                <th className="text-right px-4 py-2.5">{effectiveTank}L full tank</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-900/20">
              {fuels.map((fuel) => (
                <tr key={fuel.code} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{fuel.name}</td>
                  <td className="px-4 py-3 text-right text-orange-200">
                    RM {fuel.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-white">
                    RM {(fuel.price * effectiveTank).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
