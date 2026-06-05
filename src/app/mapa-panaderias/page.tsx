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
      <div className="fixed left-0 right-0 top-0 z-50 md:static">
        <GovBar />
        <Header />
      </div>

      {/* Spacer móvil */}
      <div className="h-[120px] md:hidden" aria-hidden="true" />
      <main>
        <MapaPanaderias />
      </main>
    </>
  );
}
