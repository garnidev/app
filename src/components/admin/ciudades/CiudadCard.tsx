import Image from "next/image";
import type { CiudadAdmin } from "@/data/ciudades";

type Props = {
  ciudad: CiudadAdmin;
  onEditar?: (ciudad: CiudadAdmin) => void;
};

export function CiudadCard({ ciudad, onEditar }: Props) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-neutral-200 transition hover:shadow-md">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100">
        <Image
          src={ciudad.imagen}
          alt={ciudad.nombre}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {ciudad.totalPanaderias > 0 && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brand-greenDark shadow-sm backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
            {ciudad.totalPanaderias}{" "}
            {ciudad.totalPanaderias === 1 ? "panadería" : "panaderías"}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold leading-snug text-neutral-900 md:text-lg">
          {ciudad.nombre}
        </h3>

        <p className="mt-1 text-sm text-neutral-600">
          {ciudad.departamento.nombre}
        </p>

        <div className="my-4 h-px bg-neutral-100" aria-hidden="true" />

        <button
          type="button"
          onClick={() => onEditar?.(ciudad)}
          className="mt-auto inline-flex items-center justify-center gap-1.5 rounded-full bg-brand-greenSoft px-4 py-2.5 text-sm font-bold text-brand-green transition hover:bg-brand-green hover:text-white"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Editar
        </button>
      </div>
    </article>
  );
}