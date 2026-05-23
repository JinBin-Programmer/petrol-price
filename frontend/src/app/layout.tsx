import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import Link from "next/link";

export const metadata: Metadata = {
  metadataBase: new URL("https://petrol.merquri.com"),
  title: {
    default: "Harga Petrol Malaysia — RON95 RON97 Diesel",
    template: "%s — Harga Petrol Malaysia",
  },
  description:
    "Semak harga petrol terkini Malaysia — RON95, RON97, dan Diesel. Harga dikemas kini setiap minggu mengikut mekanisme harga automatik (APM). Check latest Malaysia petrol prices RON95 RON97 Diesel weekly update.",
  keywords: [
    "harga petrol malaysia",
    "petrol price malaysia",
    "harga minyak malaysia",
    "RON95 price",
    "RON97 price",
    "diesel price malaysia",
    "harga RON95 minggu ini",
    "petrol price today",
  ],
  openGraph: {
    type: "website",
    locale: "ms_MY",
    siteName: "Harga Petrol Malaysia",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ms">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7019273666606982"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        {/* Navbar */}
        <nav className="sticky top-0 z-50 bg-black/50 backdrop-blur border-b border-orange-900/40 shadow-sm">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-white text-lg">
              <span className="text-2xl">⛽</span>
              <span>Harga Petrol MY</span>
            </Link>
            <div className="flex items-center gap-4 text-sm font-medium text-orange-200">
              <Link href="/" className="hover:text-white transition-colors">Harga</Link>
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
              <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-orange-900/30 bg-black/40 mt-10 py-6 text-center text-xs text-orange-200/50 space-y-1">
          <p>
            Harga petrol dari{" "}
            <a href="https://www.kpdnhep.gov.my" target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-300">
              KPDNHEP
            </a>{" "}
            · Dikemas kini setiap minggu (Khamis)
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            <Link href="/about" className="hover:text-white">About</Link>
            <span>·</span>
            <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
          <p className="mt-2">© {new Date().getFullYear()} Harga Petrol Malaysia · For reference only</p>
        </footer>
      </body>
    </html>
  );
}
