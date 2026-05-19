"use client";

import Image from "next/image";
import type { Panaderia } from "@/data/panaderias";

type Props = {
  panaderia: Panaderia;
  onClick?: (p: Panaderia) => void;
};

/**
 * Card individual de una panadería en el panel de búsqueda.
 * Misma estructura visual que DepartamentoCard pero con subtítulo "Panadería aliada".
 */
export function PanaderiaCard({ panaderia, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(panaderia)}
      className="group flex w-full items-center gap-4 rounded-2xl bg-white px-3 py-3 text-left transition hover:bg-neutral-50"
    >
      {/* Foto circular de la panadería */}
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-neutral-200 ring-2 ring-brand-green/30">
        <Image
          src={panaderia.imagen}
          alt={panaderia.nombre}
          fill
          sizes="56px"
          className="object-cover"
        />
      </div>

      {/* Texto */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-bold italic text-support-navy md:text-lg">
          {panaderia.nombre}
        </h3>
        <p className="mt-0.5 text-xs text-neutral-600 md:text-sm">
          Panadería aliada
        </p>
      </div>
    </button>
  );
}