import { NextResponse } from "next/server";
import { getPetrolData } from "@/lib/petrol";

export async function GET() {
  const data = await getPetrolData();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600" },
  });
}
