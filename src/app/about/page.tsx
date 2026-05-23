import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Harga Petrol Malaysia",
  description: "About Harga Petrol Malaysia — tracking RON95, RON97, and Diesel prices weekly.",
};

export default function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-4">
      <div className="bg-white/5 border border-orange-900/30 rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-800 text-xl shadow-md">⛽</span>
          <div>
            <h1 className="text-2xl font-bold text-white">About Harga Petrol Malaysia</h1>
            <p className="text-sm text-orange-300/60">Weekly petrol prices · Updated every Thursday</p>
          </div>
        </div>
        <p className="text-orange-100/80 leading-relaxed mb-3">
          <strong>Harga Petrol Malaysia</strong> tracks weekly petrol prices for RON95, RON97, Euro 5 Diesel, and Diesel B10 in Malaysia, sourced from KPDNHEP (Kementerian Perdagangan Dalam Negeri dan Kos Sara Hidup).
        </p>
        <p className="text-orange-100/80 leading-relaxed">
          Prices are updated every Thursday under Malaysia&apos;s Automatic Pricing Mechanism (APM), which adjusts RON97 and Diesel prices based on global crude oil prices.
        </p>
      </div>

      {[
        { icon: "📡", title: "Data Source", body: "Petrol prices are sourced from KPDNHEP (www.kpdnhep.gov.my), the government ministry responsible for price control and consumer affairs in Malaysia. Prices are updated weekly every Thursday." },
        { icon: "⚙️", title: "Automatic Pricing Mechanism (APM)", body: "Malaysia uses the APM to adjust RON97 and Diesel prices weekly based on the Mean of Platts Singapore (MOPS) benchmark crude oil price. RON95 is subsidised with a fixed government ceiling price." },
        { icon: "🟢", title: "RON95 Subsidy", body: "RON95 is a targeted subsidy product. The government maintains a ceiling price to keep costs affordable for most Malaysians. This price does not change weekly — it is set by the government." },
        { icon: "⚠️", title: "Disclaimer", body: "All prices are for informational reference only. Actual prices at petrol stations may vary slightly. Always check the price display at the pump before refuelling. We are not responsible for any discrepancies." },
      ].map((s) => (
        <div key={s.title} className="bg-white/5 border border-orange-900/30 rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">{s.icon}</span>
            <h2 className="font-bold text-white">{s.title}</h2>
          </div>
          <p className="text-sm text-orange-100/70 leading-relaxed">{s.body}</p>
        </div>
      ))}

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/" className="text-orange-400 hover:underline">← Harga Petrol</Link>
        <span className="text-orange-900">·</span>
        <Link href="/privacy-policy" className="text-orange-400 hover:underline">Privacy Policy</Link>
        <span className="text-orange-900">·</span>
        <Link href="/terms" className="text-orange-400 hover:underline">Terms</Link>
      </div>
    </main>
  );
}
