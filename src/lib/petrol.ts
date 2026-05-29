export interface FuelPrice {
  code: string;
  name: string;
  name_ms: string;
  price: number;
  market_price: number | null;
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

const DATA_GOV_URL =
  "https://api.data.gov.my/data-catalogue?id=fuelprice&limit=1&sort=-date";

// Next Thursday from a given date (petrol prices update every Thursday)
function nextThursday(from: Date = new Date()): string {
  const d = new Date(from);
  const day = d.getDay();
  const daysUntil = day <= 4 ? 4 - day : 7 - day + 4;
  d.setDate(d.getDate() + daysUntil);
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
    price: 1.99,
    market_price: 3.92,
    unit: "litre",
    is_subsidised: true,
    note: "BUDI95 subsidised price",
    note_ms: "Harga bersubsidi BUDI95",
  },
  {
    code: "RON97",
    name: "RON 97",
    name_ms: "Petrol RON97",
    price: 4.65,
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
    price: 4.87,
    market_price: null,
    unit: "litre",
    is_subsidised: false,
    note: "Market price · Weekly update",
    note_ms: "Harga pasaran · Kemaskini mingguan",
  },
  {
    code: "DIESEL_B10",
    name: "Diesel (East M'sia)",
    name_ms: "Diesel (Malaysia Timur)",
    price: 2.15,
    market_price: 4.87,
    unit: "litre",
    is_subsidised: true,
    note: "East Malaysia subsidised",
    note_ms: "Harga bersubsidi Malaysia Timur",
  },
];

let cache: { data: PetrolData; ts: number } | null = null;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

async function fetchFromDataGov(): Promise<{ fuels: FuelPrice[]; date: string } | null> {
  try {
    const res = await fetch(DATA_GOV_URL, { cache: "no-store" });
    if (!res.ok) return null;

    const raw: {
      date: string;
      ron95_budi95: number;
      ron95_skps: number;
      ron95: number;
      ron97: number;
      diesel: number;
      diesel_eastmsia: number;
    }[] = await res.json();

    const latest = raw[0];
    if (!latest) return null;

    const fuels: FuelPrice[] = [
      {
        code: "RON95",
        name: "RON 95",
        name_ms: "Petrol RON95",
        price: latest.ron95_budi95,
        market_price: latest.ron95,
        unit: "litre",
        is_subsidised: true,
        note: "BUDI95 subsidised price",
        note_ms: "Harga bersubsidi BUDI95",
      },
      {
        code: "RON97",
        name: "RON 97",
        name_ms: "Petrol RON97",
        price: latest.ron97,
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
        price: latest.diesel,
        market_price: null,
        unit: "litre",
        is_subsidised: false,
        note: "Market price · Weekly update",
        note_ms: "Harga pasaran · Kemaskini mingguan",
      },
      {
        code: "DIESEL_B10",
        name: "Diesel (East M'sia)",
        name_ms: "Diesel (Malaysia Timur)",
        price: latest.diesel_eastmsia,
        market_price: latest.diesel,
        unit: "litre",
        is_subsidised: true,
        note: "East Malaysia subsidised",
        note_ms: "Harga bersubsidi Malaysia Timur",
      },
    ];

    return { fuels, date: latest.date };
  } catch {
    return null;
  }
}

export async function getPetrolData(): Promise<PetrolData> {
  if (cache && Date.now() - cache.ts < CACHE_TTL_MS) return cache.data;

  const result = await fetchFromDataGov();

  const effectiveDate = result
    ? new Date(result.date).toLocaleDateString("en-MY", {
        timeZone: "Asia/Kuala_Lumpur",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-MY", {
        timeZone: "Asia/Kuala_Lumpur",
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  const data: PetrolData = {
    fuels: result?.fuels ?? FALLBACK_FUELS,
    effective_date: effectiveDate,
    next_update: nextThursday(),
    source: result ? "data.gov.my" : "Reference prices (data.gov.my)",
    is_fallback: !result,
    fetched_at: new Date().toISOString(),
  };

  cache = { data, ts: Date.now() };
  return data;
}
