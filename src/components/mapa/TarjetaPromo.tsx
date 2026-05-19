import Image from "next/image";

/**
 * Tarjeta promocional del mapa con el chef ilustrado.
 * - El panadero sobresale por arriba de la tarjeta
 * - Línea verde curva decorativa que atraviesa horizontalmente
 * - Diseño tipo "tarjeta gourmet"
 */
export function TarjetaPromo() {
  return (
    <div className="relative w-full max-w-sm">
      {/* Tarjeta con curva interna */}
      <div className="relative overflow-hidden rounded-3xl bg-white pt-24 pb-6 px-6 shadow-2xl ring-1 ring-black/5">
        {/* Curva verde decorativa que atraviesa la tarjeta */}
        <svg
          viewBox="0 0 400 200"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 top-[45%] z-0 h-12 w-full"
          aria-hidden="true"
        >
          <path
            d="M0,30 Q200,120 400,30 L400,60 Q200,150 0,60 Z"
            fill="#39A900"
          />
        </svg>

        {/* Contenido principal (encima de la curva) */}
        <div className="relative z-10 mt-2 text-center">
          <h2 className="text-xl font-extrabold italic text-support-navy md:text-2xl">
            Encuentra tu panadería
          </h2>
          <p className="mt-2 text-sm italic text-neutral-600 md:text-[15px]">
            Descubre las mejores panaderías cerca de ti
          </p>
        </div>
      </div>

      {/* Panadero ilustrado — sobresale por arriba de la tarjeta */}
      <div className="pointer-events-none absolute -top-16 left-1/2 z-20 -translate-x-1/2">
        <Image
          src="/assets/chef-mapa.svg"
          alt=""
          width={180}
          height={220}
          className="h-36 w-auto drop-shadow-xl md:h-40"
          aria-hidden="true"
          priority
        />
      </div>
    </div>
  );
}