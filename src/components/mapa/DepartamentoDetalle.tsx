"use client";

import Image from "next/image";
import {
  agruparPanaderiasPorCiudad,
  type Panaderia,
} from "@/data/panaderias";
import type { Departamento } from "@/data/departamentos";

type Props = {
  departamento: Departamento;
  totalPanaderias: number;
  panaderias: Panaderia[];
  cargando?: boolean;
  onSelectPanaderia?: (p: Panaderia) => void;
  panaderiaActivaId?: string;
};

export function DepartamentoDetalle({
  departamento,
  totalPanaderias,
  panaderias,
  cargando = false,
  onSelectPanaderia,
  panaderiaActivaId,
}: Props) {
  const agrupadas = agruparPanaderiasPorCiudad(panaderias);
  const ciudades = Object.keys(agrupadas).sort();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={departamento.imagen}
          alt={`Departamento de ${departamento.nombre}`}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-5">
          <h2 className="text-2xl font-extrabold italic text-white drop-shadow-lg md:text-3xl">
            {departamento.nombre}
          </h2>
          <p className="mt-1 text-sm italic text-white/90 md:text-base">
            {totalPanaderias === 1
              ? "1 panadería"
              : `${totalPanaderias} panaderías`}
          </p>
        </div>
      </div>

      {/* Lista */}
      <div className="flex flex-col">
        {cargando ? (
          <div className="space-y-3 px-3 py-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-2xl bg-neutral-50 p-3"
              >
                <div className="h-14 w-14 shrink-0 animate-pulse rounded-full bg-neutral-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-200" />
                </div>
              </div>
            ))}
          </div>
        ) : ciudades.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm italic text-neutral-500">
            Aún no hay panaderías registradas en este departamento.
          </div>
        ) : (
          ciudades.map((ciudad) => (
            <section key={ciudad}>
              <div className="flex items-baseline justify-between border-b border-neutral-100 px-6 py-3">
                <h3 className="text-sm font-semibold italic text-neutral-700 md:text-base">
                  {ciudad}
                </h3>
                <span className="text-sm font-bold italic text-neutral-700 md:text-base">
                  {agrupadas[ciudad].length}
                </span>
              </div>

              <ul className="flex flex-col gap-2 px-3 py-3">
                {agrupadas[ciudad].map((p) => {
                  const activa = panaderiaActivaId === p.id;
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => onSelectPanaderia?.(p)}
                        className="group relative flex w-full items-center py-2 pl-0 pr-0 text-left"
                      >
                        {/* Foto circular sobresaliente */}
                        <div
                          className={`relative z-10 h-14 w-14 shrink-0 overflow-hidden rounded-full bg-neutral-200 shadow-md ring-2 ${
                            activa
                              ? "ring-brand-green"
                              : "ring-brand-green/40"
                          }`}
                        >
                          <Image
                            src={p.imagen}
                            alt={p.nombre}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>

                        {/* Rectángulo con texto + trigo */}
                        <div
                          className={`relative -ml-7 flex flex-1 items-center justify-between gap-3 rounded-full py-3 pl-10 pr-3 shadow-md ring-1 transition group-hover:shadow-lg ${
                            activa
                              ? "bg-brand-greenSoft ring-brand-green"
                              : "bg-white ring-neutral-100 group-hover:ring-brand-green/30"
                          }`}
                        >
                          {/* Texto */}
                          <div className="min-w-0 flex-1">
                            <h4 className="truncate text-base font-bold italic text-support-navy md:text-lg">
                              {p.nombre}
                            </h4>
                            <p className="mt-0.5 text-xs text-neutral-600 md:text-sm">
                              Panadería aliada
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
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  );
}