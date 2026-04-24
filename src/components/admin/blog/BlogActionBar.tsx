"use client";

import Link from "next/link";
import { useState } from "react";

type Props = {
  /** Total de artículos activos (para mostrar el contador) */
  totalActivos: number;
  /** Número de archivados (para el badge del botón Archivo) */
  totalArchivados: number;
};

/**
 * Barra de acciones del gestor de blog:
 * - Izquierda: botón "Filtrar por" + contador de artículos
 * - Derecha: botón "Archivo" (con badge) + botón "Nuevo artículo"
 */
export function BlogActionBar({ totalActivos, totalArchivados }: Props) {
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-3 md:gap-4">
      {/* Botón Filtrar por */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setFiltrosAbiertos((v) => !v)}
          aria-expanded={filtrosAbiertos}
          aria-haspopup="true"
          className="inline-flex items-center gap-2 rounded-full border border-brand-green bg-white px-5 py-2.5 text-sm font-semibold text-brand-green transition hover:bg-brand-greenSoft"
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
            <path d="M12 21s-7-6-7-12a7 7 0 0 1 14 0c0 6-7 12-7 12z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          Filtrar por
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`h-4 w-4 transition-transform ${
              filtrosAbiertos ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {filtrosAbiertos && (
          <>
            <button
              type="button"
              aria-label="Cerrar filtros"
              onClick={() => setFiltrosAbiertos(false)}
              className="fixed inset-0 z-10 cursor-default"
            />
            <div className="absolute left-0 top-full z-20 mt-2 w-64 overflow-hidden rounded-2xl bg-white p-4 shadow-card ring-1 ring-neutral-200">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-neutral-500">
                Estado
              </p>
              <div className="flex flex-col gap-2">
                {["Publicado", "Borrador", "Activa"].map((op) => (
                  <label
                    key={op}
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-neutral-700 transition hover:bg-neutral-50"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-neutral-300 text-brand-green focus:ring-brand-green/30"
                    />
                    {op}
                  </label>
                ))}
              </div>
              <p className="mb-3 mt-4 text-xs font-bold uppercase tracking-wide text-neutral-500">
                Categoría
              </p>
              <div className="flex flex-col gap-2">
                {["Territorio", "Ingredientes", "Oficios", "Historia"].map(
                  (op) => (
                    <label
                      key={op}
                      className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-neutral-700 transition hover:bg-neutral-50"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-neutral-300 text-brand-green focus:ring-brand-green/30"
                      />
                      {op}
                    </label>
                  )
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Contador */}
      <span className="text-sm font-medium text-neutral-600">
        <span className="font-bold text-neutral-900">{totalActivos}</span>{" "}
        {totalActivos === 1 ? "artículo activo" : "artículos activos"}
      </span>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Botón Archivo */}
      <Link
        href="/admin/blog/archivo"
        className="inline-flex items-center gap-2 rounded-full border border-brand-purple/50 bg-white px-5 py-2.5 text-sm font-semibold text-brand-purpleDark transition hover:bg-brand-purple/5"
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
          <rect x="3" y="4" width="18" height="4" rx="1" />
          <path d="M5 8v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" />
          <path d="M10 12h4" />
        </svg>
        Archivo
        {totalArchivados > 0 && (
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-purple px-1.5 text-xs font-bold text-white">
            {totalArchivados}
          </span>
        )}
      </Link>

      {/* Botón Nuevo artículo */}
      <Link
        href="/admin/blog/crear"
        className="inline-flex items-center gap-2 rounded-full bg-brand-green px-5 py-2.5 text-sm font-bold text-white shadow-soft transition hover:bg-brand-greenDark hover:shadow-md"
      >
        Nuevo artículo
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
          <path d="M12 5v14M5 12h14" />
        </svg>
      </Link>
    </div>
  );
}