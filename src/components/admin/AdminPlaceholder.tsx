import Link from "next/link";
import { AdminIcon } from "./AdminIcon";
import type { NavIcon } from "./navigation";

type Props = {
  icon: NavIcon;
  titulo: string;
  descripcion: string;
};

/**
 * Placeholder reutilizable para subpáginas del admin en construcción.
 * Úsalo hasta que implementes la funcionalidad real de cada módulo.
 */
export function AdminPlaceholder({ icon, titulo, descripcion }: Props) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14 md:px-10 md:py-20">
      <div className="flex flex-col items-center text-center">
        {/* Icono grande */}
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-greenSoft text-brand-green">
          <AdminIcon name={icon} className="h-10 w-10" />
        </div>

        {/* Título */}
        <h1 className="mt-6 text-3xl font-extrabold italic text-support-navy md:text-4xl">
          {titulo}
        </h1>

        {/* Descripción */}
        <p className="mt-3 max-w-xl text-base text-neutral-600 md:text-lg">
          {descripcion}
        </p>

        {/* Card de "en construcción" */}
        <div className="mt-10 w-full rounded-3xl bg-white p-8 shadow-card ring-1 ring-black/5 md:p-10">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-neutral-900">
              Módulo en construcción
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-neutral-600">
              Esta sección estará disponible próximamente. Estamos trabajando
              en los flujos de gestión y la conexión con el backend.
            </p>

            <Link
              href="/admin"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-greenSoft px-5 py-2.5 text-sm font-bold text-brand-green transition hover:bg-brand-green hover:text-white"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Volver al inicio del panel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}