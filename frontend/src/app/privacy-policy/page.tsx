import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Harga Petrol Malaysia",
  description: "Privacy Policy for Harga Petrol Malaysia.",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-4">
      <div className="bg-white/5 border border-orange-900/30 rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-white mb-1">Privacy Policy</h1>
        <p className="text-sm text-orange-400/60 mb-4">Last updated: 23 May 2025</p>
        <p className="text-sm text-orange-100/70 leading-relaxed">
          This Privacy Policy explains how <strong>Harga Petrol Malaysia</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;) collects and uses information when you visit this website.
        </p>
      </div>

      {[
        { title: "1. Information We Collect", body: "We do not collect personal information such as your name or email. We collect standard web usage data (IP address, browser type, pages visited) for security and analytics. No account or login is required." },
        { title: "2. Cookies", body: "We use cookies for analytics and advertising. Google AdSense uses cookies (including the DoubleClick cookie) to serve personalised ads based on your browsing history. Opt out at https://www.google.com/settings/ads or https://www.aboutads.info/choices/." },
        { title: "3. Google AdSense", body: "We display advertisements via Google AdSense. Google may use cookies to show relevant ads based on your visits to this and other sites. See https://policies.google.com/technologies/partner-sites for details." },
        { title: "4. Third-Party Data", body: "Petrol price data is scraped from the KPDNHEP website. No personal user data is sent to KPDNHEP." },
        { title: "5. Children's Privacy", body: "This site is not directed at children under 13. We do not knowingly collect data from children." },
        { title: "6. Changes", body: "We may update this policy at any time. Continued use constitutes acceptance of any changes." },
        { title: "7. Contact", body: "For privacy questions, email: jinbin@ioti.io" },
      ].map((s) => (
        <div key={s.title} className="bg-white/5 border border-orange-900/30 rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-white mb-2">{s.title}</h2>
          <p className="text-sm text-orange-100/70 leading-relaxed">{s.body}</p>
        </div>
      ))}

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/" className="text-orange-400 hover:underline">← Harga Petrol</Link>
        <span className="text-orange-900">·</span>
        <Link href="/terms" className="text-orange-400 hover:underline">Terms of Service</Link>
      </div>
    </main>
  );
}
