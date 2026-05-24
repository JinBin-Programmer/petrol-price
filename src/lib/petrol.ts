import axios from "axios";
import * as cheerio from "cheerio";
import https from "https";

export interface FuelPrice {
  code: string;
  name: string;
  name_ms: string;
  price: number;
  market_price: number | null; // estimated unsubsidised price, null if already market
  unit: string;
  is_subsidised: boolean;
  note: string;
  note_ms: string;
}

export interface PetrolData {
  fuels: FuelPrice[];
  effective_date: string;
  next_update: string;
  source: string;
  is_fallback: boolean;
  fetched_at: string;
}

// Next Thursday from a given date (petrol prices update every Thursday)
function nextThursday(from: Date = new Date()): string {
  const d = new Date(from);
  const day = d.getDay(); // 0=Sun, 4=Thu
  const daysUntil = day <= 4 ? 4 - day : 7 - day + 4;
  d.setDate(d.getDate() + daysUntil);
  return d.toLocaleDateString("en-MY", {
    timeZone: "Asia/Kuala_Lumpur",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Last Thursday (current effective date)
function lastThursday(from: Date = new Date()): string {
  const d = new Date(from);
  const day = d.getDay();
  const daysSince = day >= 4 ? day - 4 : day + 3;
  d.setDate(d.getDate() - daysSince);
  return d.toLocaleDateString("en-MY", {
    timeZone: "Asia/Kuala_Lumpur",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const FALLBACK_FUELS: FuelPrice[] = [
  {
    code: "RON95",
    name: "RON 95",
    name_ms: "Petrol RON95",
    price: 2.05,
    market_price: 3.11, // estimated ~RON97 × 0.92
    unit: "litre",
    is_subsidised: true,
    note: "Subsidised ceiling price",
    note_ms: "Harga siling bersubsidi",
  },
  {
    code: "RON97",
    name: "RON 97",
    name_ms: "Petrol RON97",
    price: 3.38,
    market_price: null,
    unit: "litre",
    is_subsidised: false,
    note: "Market price · Weekly update",
    note_ms: "Harga pasaran · Kemaskini mingguan",
  },
  {
    code: "DIESEL",
    name: "Euro 5 Diesel",
    name_ms: "Diesel Euro 5",
    price: 3.35,
    market_price: null,
    unit: "litre",
    is_subsidised: false,
    note: "Market price · Weekly update",
    note_ms: "Harga pasaran · Kemaskini mingguan",
  },
  {
    code: "DIESEL_B10",
    name: "Diesel B10",
    name_ms: "Diesel B10",
    price: 2.15,
    market_price: 3.35, // same as Euro 5 diesel without subsidy
    unit: "litre",
    is_subsidised: true,
    note: "Subsidised ceiling price",
    note_ms: "Harga siling bersubsidi",
  },
];

let cache: { data: PetrolData; ts: number } | null = null;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

async function scrapeKPDNHEP(): Promise<FuelPrice[] | null> {
  try {
    const agent = new https.Agent({ rejectUnauthorized: false });
    const res = await axios.get(
      "https://harga.kpdnhep.gov.my/",
      {
        httpsAgent: agent,
        timeout: 8000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      }
    );

    const $ = cheerio.load(res.data as string);
    const fuels: FuelPrice[] = [];

    // Try to find price table rows
    $("table tr, .price-item, .harga-item").each((_, el) => {
      const text = $(el).text();

      const ron95Match = text.match(/RON\s*95[^0-9]*([0-9]+\.[0-9]{2})/i);
      const ron97Match = text.match(/RON\s*97[^0-9]*([0-9]+\.[0-9]{2})/i);
      const dieselMatch = text.match(/[Dd]iesel[^0-9]*([0-9]+\.[0-9]{2})/i);

      if (ron95Match && !fuels.find((f) => f.code === "RON95")) {
        const price = parseFloat(ron95Match[1]);
        if (price > 1 && price < 5) {
          fuels.push({ ...FALLBACK_FUELS[0], price });
        }
      }
      if (ron97Match && !fuels.find((f) => f.code === "RON97")) {
        const price = parseFloat(ron97Match[1]);
        if (price > 1 && price < 6) {
          fuels.push({ ...FALLBACK_FUELS[1], price });
        }
      }
      if (dieselMatch && !fuels.find((f) => f.code === "DIESEL")) {
        const price = parseFloat(dieselMatch[1]);
        if (price > 1 && price < 6) {
          fuels.push({ ...FALLBACK_FUELS[2], price });
        }
      }
    });

    // Also try body text regex as backup
    const bodyText = $("body").text();
    if (!fuels.find((f) => f.code === "RON95")) {
      const m = bodyText.match(/RON\s*95[^0-9]{0,20}(RM\s*)?([0-9]+\.[0-9]{2})/i);
      if (m) {
        const price = parseFloat(m[2]);
        if (price > 1 && price < 5) fuels.push({ ...FALLBACK_FUELS[0], price });
      }
    }
    if (!fuels.find((f) => f.code === "RON97")) {
      const m = bodyText.match(/RON\s*97[^0-9]{0,20}(RM\s*)?([0-9]+\.[0-9]{2})/i);
      if (m) {
        const price = parseFloat(m[2]);
        if (price > 1 && price < 6) fuels.push({ ...FALLBACK_FUELS[1], price });
      }
    }

    return fuels.length >= 2 ? fuels : null;
  } catch {
    return null;
  }
}

export async function getPetrolData(): Promise<PetrolData> {
  if (cache && Date.now() - cache.ts < CACHE_TTL_MS) return cache.data;

  const scraped = await scrapeKPDNHEP();

  const fuels = scraped ?? FALLBACK_FUELS;
  const fullFuels = FALLBACK_FUELS.map((fb) => {
    const found = fuels.find((f) => f.code === fb.code) ?? fb;
    // Recompute market price estimates from live scraped data
    if (found.code === "RON95") {
      const ron97 = fuels.find((f) => f.code === "RON97");
      const marketEst = ron97 ? parseFloat((ron97.price * 0.92).toFixed(2)) : fb.market_price;
      return { ...found, market_price: marketEst };
    }
    if (found.code === "DIESEL_B10") {
      const diesel = fuels.find((f) => f.code === "DIESEL");
      return { ...found, market_price: diesel ? diesel.price : fb.market_price };
    }
    return found;
  });
  const isFallback = !scraped;

  const data: PetrolData = {
    fuels: fullFuels,
    effective_date: lastThursday(),
    next_update: nextThursday(),
    source: isFallback
      ? "Reference prices (KPDNHEP)"
      : "KPDNHEP harga.kpdnhep.gov.my",
    is_fallback: isFallback,
    fetched_at: new Date().toISOString(),
  };

  cache = { data, ts: Date.now() };
  return data;
}
