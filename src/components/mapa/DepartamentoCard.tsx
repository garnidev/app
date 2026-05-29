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
 * - Foto circular sobresale por la izquierda del rectángulo
 * - Rectángulo blanco con sombra suave y bordes pill
 * - Trigo verde decorativo en la esquina derecha
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
      className="group relative flex w-full items-center py-2 pl-0 pr-0 text-left"
    >
      {/* Foto circular sobresaliente */}
      <div className="relative z-10 h-14 w-14 shrink-0 overflow-hidden rounded-full bg-neutral-200 shadow-md ring-2 ring-brand-green/40">
        <Image
          src={departamento.imagen}
          alt={`Departamento de ${departamento.nombre}`}
          fill
          sizes="56px"
          className="object-cover"
        />
      </div>

      {/* Rectángulo con texto + trigo */}
      <div className="relative -ml-7 flex flex-1 items-center justify-between gap-3 rounded-full bg-white py-3 pl-10 pr-3 shadow-md ring-1 ring-neutral-100 transition group-hover:ring-brand-green/30 group-hover:shadow-lg">
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

        {/* Ícono de trigo */}
        <Image
          src="/assets/trigo-verde.svg"
          alt=""
          width={28}
          height={40}
          className="h-10 w-auto shrink-0 opacity-70"
          aria-hidden="true"
        />
      </div>
    </button>
  );
}