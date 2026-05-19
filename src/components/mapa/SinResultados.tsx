"use client";

import Image from "next/image";

/**
 * Estado vacío del buscador: aparece cuando la búsqueda no devuelve
 * coincidencias (ni en ubicaciones, ni en panaderías).
 *
 * - Ilustración del chef confundido con banda verde decorativa
 * - Mensaje principal y descripción
 */
export function SinResultados() {
  return (
    <div className="flex flex-col items-center px-6 py-10 text-center">
      {/* Zona del chef con banda verde decorativa */}
      <div className="relative w-full max-w-xs">
        {/* Banda verde curva detrás del chef */}
        <svg
          viewBox="0 0 400 200"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 top-[55%] z-0 h-14 w-full"
          aria-hidden="true"
        >
          <path
            d="M0,30 Q200,90 400,30 L400,60 Q200,120 0,60 Z"
            fill="#39A900"
          />
        </svg>

        {/* Chef confundido — sobresale por encima de la banda */}
        <div className="relative z-10 flex justify-center">
          <Image
            src="/assets/chef-sin-resultados.svg"
            alt=""
            width={200}
            height={240}
            className="h-48 w-auto drop-shadow-xl md:h-56"
            aria-hidden="true"
            priority
          />
        </div>
      </div>

      {/* Texto */}
      <h3 className="mt-6 text-xl font-extrabold italic text-support-navy md:text-2xl">
        Sin resultados
      </h3>
      <p className="mt-2 text-sm italic text-neutral-600 md:text-base">
        No se hallaron resultados de la búsqueda
      </p>
    </div>
  );
}