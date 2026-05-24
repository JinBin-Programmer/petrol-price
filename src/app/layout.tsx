import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import Link from "next/link";
import { LanguageProvider } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

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
        <LanguageProvider>
          {/* Navbar */}
          <nav className="sticky top-0 z-50 bg-black/70 backdrop-blur border-b border-white/10 shadow-sm">
            <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 font-bold text-white text-lg">
                <span className="text-2xl">⛽</span>
                <div>
                  <div className="leading-none">Harga Petrol MY</div>
                  <div className="text-[10px] text-white/40 font-normal leading-none">Malaysia Petrol Price</div>
                </div>
              </Link>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-4 text-sm font-medium text-white/60">
                  <Link href="/" className="hover:text-white transition-colors">Price</Link>
                  <Link href="/about" className="hover:text-white transition-colors">About</Link>
                </div>
                <LanguageToggle />
              </div>
            </div>
          </nav>

          {/* Main content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-white/10 bg-black/60 py-6 text-center text-xs text-white/30 space-y-1">
            <p>
              Harga petrol dari / Petrol prices from{" "}
              <a href="https://www.kpdnhep.gov.my" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/60">
                KPDNHEP
              </a>{" "}
              · Dikemas kini setiap Khamis / Updated every Thursday
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              <Link href="/about" className="hover:text-white">Tentang / About</Link>
              <span>·</span>
              <Link href="/privacy-policy" className="hover:text-white">Dasar Privasi / Privacy</Link>
              <span>·</span>
              <Link href="/terms" className="hover:text-white">Terma / Terms</Link>
            </div>
            <p className="mt-2">© {new Date().getFullYear()} Harga Petrol Malaysia · Untuk rujukan sahaja / For reference only</p>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
