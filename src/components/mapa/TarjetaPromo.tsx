import Image from "next/image";

/**
 * Tarjeta promocional del mapa.
 * Reemplazada por un SVG único que contiene todo el diseño:
 * fondo, curva verde, panadero ilustrado y texto.
 *
 * Mantiene las mismas dimensiones que la versión anterior (max-w-sm).
 */
export function TarjetaPromo() {
  return (
    <div className="relative w-full max-w-sm">
      <Image
        src="/assets/encuentra-tu-panaderia.svg"
        alt="Encuentra tu panadería · Descubre las mejores panaderías cerca de ti"
        width={436}
        height={345}
        className="h-auto w-full"
        priority
      />
    </div>
  );
}