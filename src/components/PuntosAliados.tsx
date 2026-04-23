import Image from "next/image";
import Link from "next/link";

/**
 * Sección "Puntos Aliados"
 * - Izquierda: título verde cursivo + subtítulo azul marino + descripción + CTA morado
 * - Derecha: pan con forma del mapa de Colombia y pin verde (con animación sealFloat)
 * - Arco verde fino en la parte inferior
 */
export function PuntosAliados() {
  return (
    <section
      id="puntos-aliados"
      className="relative overflow-hidden bg-white pb-20 pt-0 md:pb-8 md:pt-0"
    >
      <div className="container-site grid items-center gap-10 lg:grid-cols-[1fr_1.4fr]">
        {/* Columna izquierda - texto (arriba en móvil) */}
        <div className="text-center lg:text-left">
          <h2 className="text-4xl font-extrabold italic leading-none text-brand-green md:text-5xl lg:text-6xl">
            Puntos aliados
          </h2>

          <p className="mt-3 text-lg font-bold italic text-gov-blue md:text-xl">
            Aquí esta tu próxima panadería favorita.
          </p>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-neutral-600 md:text-lg lg:mx-0">
            Explora nuestro mapa de panaderías aliadas y encuentra la masa
            madre cerca de ti. Tradición ancestral, dale a tu cuerpo un pan
            más auténtico, más natural y lleno de sabor.
          </p>

          <Link
            href="#mapa"
            className="mt-10 inline-flex items-center gap-3 rounded-2xl bg-brand-purple px-8 py-4 text-base font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-brand-purple-mid hover:shadow-lg"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
              <path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            Ver mapa de panaderías
          </Link>
        </div>

        {/* Columna derecha - mapa (abajo en móvil, derecha en desktop) */}
        <div className="flex justify-center lg:justify-end">
          <div className="animate-seal-float w-full max-w-[500px] lg:max-w-[840px]">
            <Image
              src="/assets/mapa-puntos-aliados.svg"
              alt="Mapa de panaderías aliadas en Colombia"
              width={840}
              height={693}
              className="h-auto w-full drop-shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Arco verde fino inferior (solo la línea, no área rellena) */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-20"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <path
            d="M0,70 C360,10 1080,10 1440,70"
            fill="none"
            stroke="var(--color-brand-green)"
            strokeWidth="20"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </section>
  );
}