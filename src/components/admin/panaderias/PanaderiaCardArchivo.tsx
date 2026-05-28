import Image from "next/image";
import type { Panaderia } from "@/data/panaderias";
import { PanaderiaCardArchivoActions } from "./PanaderiaCardArchivoActions";

type Props = {
  panaderia: Panaderia;
  onEditar?: (panaderia: Panaderia) => void;
  onCambio?: () => void;
};

export function PanaderiaCardArchivo({
  panaderia,
  onEditar,
  onCambio,
}: Props) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-neutral-200 transition hover:shadow-md">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100">
        <Image
          src={panaderia.imagen}
          alt={panaderia.nombre}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover opacity-60"
        />
        <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 shadow-sm backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
          Archivada
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold leading-snug text-neutral-700 md:text-lg">
          {panaderia.nombre}
        </h3>

        <p className="mt-1 text-sm text-neutral-500">
          {panaderia.descripcionCorta}
        </p>

        <div className="mt-3 flex items-start gap-2.5 text-sm text-neutral-600">
          <span className="leading-tight">
            {panaderia.direccion}, {panaderia.ciudad}, {panaderia.departamento}
          </span>
        </div>

        <div className="my-4 h-px bg-neutral-100" aria-hidden="true" />

        <PanaderiaCardArchivoActions
          panaderia={panaderia}
          onEditar={onEditar}
          onCambio={onCambio}
        />
      </div>
    </article>
  );
}