import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Harga Petrol Malaysia",
  description: "Terms of Service for Harga Petrol Malaysia.",
};

export default function TermsPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-4">
      <div className="bg-white/5 border border-orange-900/30 rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-white mb-1">Terms of Service</h1>
        <p className="text-sm text-orange-400/60 mb-4">Last updated: 23 May 2025</p>
        <p className="text-sm text-orange-100/70 leading-relaxed">
          By using Harga Petrol Malaysia, you agree to these terms.
        </p>
      </div>

      {[
        { title: "1. Informational Use Only", body: "All petrol prices shown are reference prices sourced from KPDNHEP for informational purposes only. Always verify the posted price at the fuel pump before refuelling. We are not responsible for any discrepancies between displayed and actual prices." },
        { title: "2. Accuracy", body: "We strive to display accurate, up-to-date prices but cannot guarantee accuracy at all times. Prices are updated weekly and may be delayed. We are not liable for any loss arising from reliance on information on this site." },
        { title: "3. Acceptable Use", body: "You may use this site for personal, non-commercial purposes. You may not scrape, copy, or redistribute data without permission." },
        { title: "4. Advertising", body: "This site displays ads via Google AdSense. We are not responsible for third-party advertisement content." },
        { title: "5. Limitation of Liability", body: "To the maximum extent permitted by law, Harga Petrol Malaysia is not liable for any direct or indirect damages arising from your use of this site." },
        { title: "6. Governing Law", body: "These terms are governed by the laws of Malaysia. Disputes are subject to Malaysian jurisdiction." },
        { title: "7. Contact", body: "Questions: jinbin@ioti.io" },
      ].map((s) => (
        <div key={s.title} className="bg-white/5 border border-orange-900/30 rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-white mb-2">{s.title}</h2>
          <p className="text-sm text-orange-100/70 leading-relaxed">{s.body}</p>
        </div>
      ))}

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/" className="text-orange-400 hover:underline">← Harga Petrol</Link>
        <span className="text-orange-900">·</span>
        <Link href="/privacy-policy" className="text-orange-400 hover:underline">Privacy Policy</Link>
      </div>
    </main>
  );
}
