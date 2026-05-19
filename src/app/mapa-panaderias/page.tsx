import type { Metadata } from "next";
import { GovBar } from "@/components/GovBar";
import { Header } from "@/components/Header";
import { MapaPanaderias } from "@/components/mapa/MapaPanaderias";

export const metadata: Metadata = {
  title: "Mapa de panaderías aliadas",
  description:
    "Descubre las panaderías aliadas con masa madre en toda Colombia. Iniciativa del SENA, CampeSENA y Full Popular.",
};

export default function MapaPanaderiasPage() {
  return (
    <>
      <GovBar />
      <Header />
      <main>
        <MapaPanaderias />
      </main>
    </>
  );
}