"use client";

import Image from "next/image";

/**
 * Estado vacío del buscador: aparece cuando la búsqueda no devuelve
 * coincidencias (ni en ubicaciones, ni en panaderías).
 *
 * Reemplazado por un SVG único que contiene toda la ilustración:
 * chef confundido, banda verde decorativa y texto.
 *
 * La imagen ocupa el ancho completo del bloque del buscador.
 */
export function SinResultados() {
  return (
    <div className="w-full">
      <Image
        src="/assets/sin-resultados.svg"
        alt="Sin resultados · No se hallaron resultados de la búsqueda"
        width={440}
        height={510}
        className="h-auto w-full"
        priority
      />
    </div>
  );
}