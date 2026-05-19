"use client";

import Image from "next/image";
import { getPanaderiasAgrupadasPorCiudad, type Panaderia } from "@/data/panaderias";
import type { Departamento } from "@/data/departamentos";

type Props = {
  departamento: Departamento;
  totalPanaderias: number;
  onSelectPanaderia?: (p: Panaderia) => void;
  panaderiaActivaId?: string;
};

export function DepartamentoDetalle({
  departamento,
  totalPanaderias,
  onSelectPanaderia,
  panaderiaActivaId,
}: Props) {
  const agrupadas = getPanaderiasAgrupadasPorCiudad(departamento.nombre);
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
        {ciudades.length === 0 ? (
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

              <ul className="flex flex-col gap-1 px-3 py-2">
                {agrupadas[ciudad].map((p) => {
                  const activa = panaderiaActivaId === p.id;
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => onSelectPanaderia?.(p)}
                        className={`group flex w-full items-center gap-4 rounded-2xl px-3 py-3 text-left transition ${
                          activa
                            ? "bg-brand-greenSoft ring-2 ring-brand-green"
                            : "bg-white hover:bg-neutral-50"
                        }`}
                      >
                        <div className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-neutral-200 ring-2 ${
                          activa ? "ring-brand-green" : "ring-brand-green/30"
                        }`}>
                          <Image
                            src={p.imagen}
                            alt={p.nombre}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-base font-bold italic text-support-navy md:text-lg">
                            {p.nombre}
                          </h4>
                          <p className="mt-0.5 text-xs text-neutral-600 md:text-sm">
                            Panadería aliada
                          </p>
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