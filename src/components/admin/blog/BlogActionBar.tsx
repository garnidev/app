"use client";

import Link from "next/link";
import { useState } from "react";

/** Tipo público para los filtros del blog admin */
export type FiltrosBlog = {
  busqueda: string;
  /** Estados marcados: subset de ["publicado", "borrador", "activa"] */
  estados: string[];
  /** Categorías marcadas: subset de ["TERRITORIO", "INGREDIENTES", "OFICIOS", "HISTORIA"] */
  categorias: string[];
};

type Props = {
  totalActivos: number;
  totalArchivados: number;
  filtros: FiltrosBlog;
  onFiltrosChange: (f: FiltrosBlog) => void;
};

/** Estados que se pueden filtrar — value = lo que se guarda en filtros.estados */
const ESTADOS = [
  { value: "publicado", label: "Publicado" },
  { value: "borrador", label: "Borrador" },
];

/** Categorías que se pueden filtrar — value coincide con el campo categoria del Post */
const CATEGORIAS = [
  { value: "TERRITORIO", label: "Territorio" },
  { value: "INGREDIENTES", label: "Ingredientes" },
  { value: "OFICIOS", label: "Oficios" },
  { value: "HISTORIA", label: "Historia" },
];

export function BlogActionBar({
  totalActivos,
  totalArchivados,
  filtros,
  onFiltrosChange,
}: Props) {
  const [dropdownAbierto, setDropdownAbierto] = useState(false);

  /* ─── Helpers para toggle de checkboxes ──────────────────────── */
  const toggleEstado = (value: string) => {
    const yaEsta = filtros.estados.includes(value);
    onFiltrosChange({
      ...filtros,
      estados: yaEsta
        ? filtros.estados.filter((e) => e !== value)
        : [...filtros.estados, value],
    });
  };

  const toggleCategoria = (value: string) => {
    const yaEsta = filtros.categorias.includes(value);
    onFiltrosChange({
      ...filtros,
      categorias: yaEsta
        ? filtros.categorias.filter((c) => c !== value)
        : [...filtros.categorias, value],
    });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({ busqueda: "", estados: [], categorias: [] });
  };

  const totalFiltrosActivos =
    filtros.estados.length + filtros.categorias.length;

  return (
    <div className="flex flex-wrap items-center gap-3 md:gap-4">
      {/* Buscador */}
      <div className="relative min-w-[200px] flex-1 md:max-w-sm">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={filtros.busqueda}
          onChange={(e) =>
            onFiltrosChange({ ...filtros, busqueda: e.target.value })
          }
          placeholder="Buscar artículo..."
          className="w-full rounded-full border border-neutral-200 bg-white py-2.5 pl-11 pr-4 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
        />
      </div>

      {/* Botón Filtrar por */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setDropdownAbierto((v) => !v)}
          aria-expanded={dropdownAbierto}
          aria-haspopup="true"
          className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
            totalFiltrosActivos > 0
              ? "border-brand-green bg-brand-green text-white hover:bg-brand-greenDark"
              : "border-brand-green bg-white text-brand-green hover:bg-brand-greenSoft"
          }`}
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
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Filtrar por
          {totalFiltrosActivos > 0 && (
            <span
              className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold ${
                totalFiltrosActivos > 0
                  ? "bg-white text-brand-greenDark"
                  : "bg-brand-green text-white"
              }`}
            >
              {totalFiltrosActivos}
            </span>
          )}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`h-4 w-4 transition-transform ${
              dropdownAbierto ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {dropdownAbierto && (
          <>
            <button
              type="button"
              aria-label="Cerrar filtros"
              onClick={() => setDropdownAbierto(false)}
              className="fixed inset-0 z-10 cursor-default"
            />
            <div className="absolute left-0 top-full z-20 mt-2 w-64 overflow-hidden rounded-2xl bg-white p-4 shadow-lg ring-1 ring-neutral-200">
              {/* Estado */}
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-neutral-500">
                Estado
              </p>
              <div className="flex flex-col gap-2">
                {ESTADOS.map((op) => (
                  <label
                    key={op.value}
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-neutral-700 transition hover:bg-neutral-50"
                  >
                    <input
                      type="checkbox"
                      checked={filtros.estados.includes(op.value)}
                      onChange={() => toggleEstado(op.value)}
                      className="h-4 w-4 rounded border-neutral-300 text-brand-green focus:ring-brand-green/30"
                    />
                    {op.label}
                  </label>
                ))}
              </div>

              {/* Categoría */}
              <p className="mb-3 mt-4 text-xs font-bold uppercase tracking-wide text-neutral-500">
                Categoría
              </p>
              <div className="flex flex-col gap-2">
                {CATEGORIAS.map((op) => (
                  <label
                    key={op.value}
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-neutral-700 transition hover:bg-neutral-50"
                  >
                    <input
                      type="checkbox"
                      checked={filtros.categorias.includes(op.value)}
                      onChange={() => toggleCategoria(op.value)}
                      className="h-4 w-4 rounded border-neutral-300 text-brand-green focus:ring-brand-green/30"
                    />
                    {op.label}
                  </label>
                ))}
              </div>

              {/* Limpiar */}
              {totalFiltrosActivos > 0 && (
                <button
                  type="button"
                  onClick={limpiarFiltros}
                  className="mt-4 w-full rounded-full border border-neutral-200 bg-white px-3 py-2 text-xs font-bold text-neutral-700 transition hover:bg-neutral-50"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Contador */}
      <span className="text-sm font-medium text-neutral-600">
        <span className="font-bold text-neutral-900">{totalActivos}</span>{" "}
        {totalActivos === 1 ? "resultado" : "resultados"}
      </span>

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
        className="inline-flex items-center gap-2 rounded-full bg-brand-green px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-greenDark"
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