import Image from "next/image";

/**
 * Sección "Beneficios del pan con masa madre"
 *
 * Reemplazada por SVGs que contienen toda la composición:
 * - Desktop: SVG horizontal con beneficios alrededor del pan
 * - Móvil: SVG vertical con beneficios apilados arriba y abajo del pan
 *
 * Ambos SVGs ocupan el ancho completo del viewport (edge-to-edge).
 */
export function Beneficios() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* SVG móvil — visible solo < lg */}
      <Image
        src="/assets/beneficios-pan-movil.svg"
        alt="Beneficios del pan con masa madre"
        width={440}
        height={1061}
        className="block h-auto w-full lg:hidden"
        priority
      />

      {/* SVG desktop — visible solo en lg+ */}
      <Image
        src="/assets/beneficios-pan-desktop.svg"
        alt="Beneficios del pan con masa madre"
        width={1440}
        height={816}
        className="hidden h-auto w-full lg:block"
        priority
      />
    </section>
  );
}