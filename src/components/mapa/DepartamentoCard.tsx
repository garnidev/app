"use client";

import Image from "next/image";
import type { Departamento } from "@/data/departamentos";

type Props = {
  departamento: Departamento;
  cantidadPanaderias: number;
  onClick?: (depto: Departamento) => void;
};

/**
 * Card individual de un departamento en el panel de búsqueda.
 * - Foto circular a la izquierda
 * - Nombre del depto (italic navy)
 * - Cantidad de panaderías debajo
 * - Hover sutil + cursor pointer
 */
export function DepartamentoCard({
  departamento,
  cantidadPanaderias,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(departamento)}
      className="group flex w-full items-center gap-4 rounded-2xl bg-white px-3 py-3 text-left transition hover:bg-neutral-50"
    >
      {/* Foto circular del departamento */}
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-neutral-200 ring-2 ring-brand-green/30">
        <Image
          src={departamento.imagen}
          alt={`Departamento de ${departamento.nombre}`}
          fill
          sizes="56px"
          className="object-cover"
        />
      </div>

      {/* Texto */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-bold italic text-support-navy md:text-lg">
          {departamento.nombre}
        </h3>
        <p className="mt-0.5 text-xs text-neutral-600 md:text-sm">
          {cantidadPanaderias === 1
            ? "1 panadería"
            : `${cantidadPanaderias} panaderías`}
        </p>
      </div>
    </button>
  );
}