import Image from "next/image";
import type { Panaderia } from "@/data/panaderias";
import { PanaderiaCardActions } from "./PanaderiaCardActions";

type Props = {
  panaderia: Panaderia;
  onEditar?: (panaderia: Panaderia) => void;
  onArchivada?: () => void;
};

export function PanaderiaCard({
  panaderia,
  onEditar,
  onArchivada,
}: Props) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-neutral-200 transition hover:shadow-md">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100">
        <Image
          src={panaderia.imagen}
          alt={panaderia.nombre}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brand-greenDark shadow-sm backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
          Publicado
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold leading-snug text-neutral-900 md:text-lg">
          {panaderia.nombre}
        </h3>

        <p className="mt-1 text-sm text-neutral-600">
          {panaderia.descripcionCorta}
        </p>

        <div className="mt-3 flex items-start gap-2.5 text-sm text-neutral-700">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-greenSoft">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3 w-3 text-brand-green"
              aria-hidden="true"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </span>
          <span className="leading-tight">
            {panaderia.direccion}, {panaderia.ciudad}, {panaderia.departamento}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2.5 text-sm text-neutral-700">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-greenSoft">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3 w-3 text-brand-green"
              aria-hidden="true"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </span>
          <span>{panaderia.telefono}</span>
        </div>

        <div className="my-4 h-px bg-neutral-100" aria-hidden="true" />

        <PanaderiaCardActions
          panaderia={panaderia}
          onEditar={onEditar}
          onArchivada={onArchivada}
        />
      </div>
    </article>
  );
}