import type { Metadata } from "next";
import { getPetrolData } from "@/lib/petrol";
import PetrolContent from "@/components/PetrolContent";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Harga Petrol Malaysia Minggu Ini — RON95 RON97 Diesel",
  description:
    "Harga petrol Malaysia terkini minggu ini. RON95, RON97 dan Diesel dikemas kini setiap Khamis. Semak harga sebelum isi minyak!",
};

export default async function HomePage() {
  const data = await getPetrolData();
  return <PetrolContent data={data} />;
}
