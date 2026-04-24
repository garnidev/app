"use client";

import { Breadcrumbs, type BreadcrumbItem } from "./Breadcrumbs";

type Props = {
  breadcrumbs: BreadcrumbItem[];
  /** Placeholder del buscador. Default: "Buscar" */
  placeholderBuscar?: string;
  /** Callback opcional para el submit del buscador */
  onBuscar?: (valor: string) => void;
};

/**
 * Topbar del admin con breadcrumbs a la izquierda y buscador a la derecha.
 * Reutilizable en todas las subpáginas del admin.
 */
export function AdminTopbar({
  breadcrumbs,
  placeholderBuscar = "Buscar",
  onBuscar,
}: Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const valor = String(formData.get("q") ?? "");
    onBuscar?.(valor);
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <Breadcrumbs items={breadcrumbs} />

      <form
        role="search"
        onSubmit={handleSubmit}
        className="relative w-full md:max-w-sm"
      >
        <input
          type="search"
          name="q"
          placeholder={placeholderBuscar}
          aria-label="Buscar"
          className="w-full rounded-full border border-neutral-200 bg-white py-2.5 pl-5 pr-12 text-sm text-neutral-800 shadow-sm transition placeholder:text-neutral-400 focus:border-brand-green focus:outline-none focus:ring-4 focus:ring-brand-green/15"
        />
        <button
          type="submit"
          aria-label="Buscar"
          className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-neutral-500 transition hover:text-brand-green"
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
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </button>
      </form>
    </div>
  );
}