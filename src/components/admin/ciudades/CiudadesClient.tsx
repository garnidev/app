"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type { CiudadAdmin } from "@/data/ciudades";
import type { Departamento } from "@/data/departamentos";
import { buscarCiudadesAdmin } from "@/data/ciudades";
import { CiudadCard } from "./CiudadCard";
import { CiudadDrawer } from "./CiudadDrawer";

type Props = {
  departamentos: Departamento[];
};

const PAGE_SIZE = 24;

export function CiudadesClient({ departamentos }: Props) {
  /* ─── Estados ───────────────────────────────────────────────── */
  const [ciudades, setCiudades] = useState<CiudadAdmin[]>([]);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);

  const [busqueda, setBusqueda] = useState("");
  const [departamentoSlug, setDepartamentoSlug] = useState<string>("");
  const [pagina, setPagina] = useState(0);

  const [drawerAbierto, setDrawerAbierto] = useState(false);
  const [ciudadEditando, setCiudadEditando] = useState<CiudadAdmin | null>(
    null,
  );

  /* ─── Cargar ciudades ────────────────────────────────────────── */
  const cargarCiudades = useCallback(async () => {
    setCargando(true);
    try {
      const { ciudades: resultados, total: totalResult } =
        await buscarCiudadesAdmin({
          busqueda,
          departamento: departamentoSlug,
          limit: PAGE_SIZE,
          offset: pagina * PAGE_SIZE,
        });
      setCiudades(resultados);
      setTotal(totalResult);
    } catch (error) {
      console.error("Error cargando ciudades:", error);
      setCiudades([]);
      setTotal(0);
    } finally {
      setCargando(false);
    }
  }, [busqueda, departamentoSlug, pagina]);

  /* ─── Debounce de búsqueda ───────────────────────────────────── */
  useEffect(() => {
    const timer = setTimeout(() => {
      cargarCiudades();
    }, 300);
    return () => clearTimeout(timer);
  }, [cargarCiudades]);

  /* ─── Resetear página al cambiar filtros ─────────────────────── */
  useEffect(() => {
    setPagina(0);
  }, [busqueda, departamentoSlug]);

  /* ─── Handlers del drawer ────────────────────────────────────── */
  const handleAbrirEditar = (ciudad: CiudadAdmin) => {
    setCiudadEditando(ciudad);
    setDrawerAbierto(true);
  };

  const handleCerrarDrawer = () => {
    setDrawerAbierto(false);
    setCiudadEditando(null);
  };

  /* ─── Paginación ─────────────────────────────────────────────── */
  const totalPaginas = Math.ceil(total / PAGE_SIZE);

  const paginasVisibles = useMemo(() => {
    const paginas: (number | "ellipsis")[] = [];
    const actual = pagina;

    if (totalPaginas <= 7) {
      for (let i = 0; i < totalPaginas; i++) paginas.push(i);
    } else {
      paginas.push(0);
      if (actual > 2) paginas.push("ellipsis");

      const inicio = Math.max(1, actual - 1);
      const fin = Math.min(totalPaginas - 2, actual + 1);

      for (let i = inicio; i <= fin; i++) paginas.push(i);

      if (actual < totalPaginas - 3) paginas.push("ellipsis");
      paginas.push(totalPaginas - 1);
    }

    return paginas;
  }, [pagina, totalPaginas]);

  return (
    <>
      {/* ═══ Barra de filtros ═══ */}
      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
        {/* Búsqueda */}
        <div className="relative flex-1">
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
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar ciudad..."
            className="w-full rounded-full border border-neutral-200 bg-white py-2.5 pl-11 pr-4 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
          />
        </div>

        {/* Filtro departamento */}
        <div className="relative md:w-72">
          <select
            value={departamentoSlug}
            onChange={(e) => setDepartamentoSlug(e.target.value)}
            className="w-full cursor-pointer appearance-none rounded-full border border-neutral-200 bg-white px-5 py-2.5 pr-10 text-sm text-neutral-800 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
          >
            <option value="">Todos los departamentos</option>
            {departamentos.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.nombre}
              </option>
            ))}
          </select>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* ═══ Conteo ═══ */}
      <p className="mt-4 text-sm text-neutral-600">
        {cargando
          ? "Cargando..."
          : `${total} ${total === 1 ? "ciudad" : "ciudades"} encontrada${total === 1 ? "" : "s"}`}
      </p>

      {/* ═══ Grid ═══ */}
      <div className="mt-6">
        {cargando ? (
          <LoadingState />
        ) : ciudades.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {ciudades.map((c) => (
              <CiudadCard key={c.id} ciudad={c} onEditar={handleAbrirEditar} />
            ))}
          </div>
        )}
      </div>

      {/* ═══ Paginación ═══ */}
      {totalPaginas > 1 && (
        <div className="mt-8 flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={() => setPagina((p) => Math.max(0, p - 1))}
            disabled={pagina === 0}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition hover:border-brand-green hover:text-brand-green disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Página anterior"
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
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {paginasVisibles.map((p, idx) =>
            p === "ellipsis" ? (
              <span
                key={`ellipsis-${idx}`}
                className="px-2 text-sm text-neutral-400"
              >
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => setPagina(p)}
                className={`flex h-9 min-w-[2.25rem] items-center justify-center rounded-full px-3 text-sm font-bold transition ${
                  p === pagina
                    ? "bg-brand-green text-white"
                    : "bg-white text-neutral-700 hover:bg-brand-greenSoft hover:text-brand-greenDark"
                }`}
              >
                {p + 1}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() =>
              setPagina((p) => Math.min(totalPaginas - 1, p + 1))
            }
            disabled={pagina >= totalPaginas - 1}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition hover:border-brand-green hover:text-brand-green disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Página siguiente"
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
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}

      {/* ═══ Drawer ═══ */}
      <CiudadDrawer
        abierto={drawerAbierto}
        ciudad={ciudadEditando}
        onClose={handleCerrarDrawer}
        onGuardar={cargarCiudades}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ESTADOS DE CARGA Y VACÍO
   ═══════════════════════════════════════════════════════════════════════ */

function LoadingState() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl bg-white ring-1 ring-neutral-200"
        >
          <div className="aspect-[16/9] w-full animate-pulse bg-neutral-200" />
          <div className="space-y-3 p-5">
            <div className="h-5 w-3/4 animate-pulse rounded bg-neutral-200" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-200" />
            <div className="mt-4 h-10 w-full animate-pulse rounded-full bg-neutral-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl bg-white p-12 text-center ring-1 ring-neutral-200">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-greenSoft">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-7 w-7 text-brand-green"
          aria-hidden="true"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      </div>
      <h2 className="mt-4 text-lg font-bold text-neutral-900">
        No se encontraron ciudades
      </h2>
      <p className="mt-2 text-sm text-neutral-600">
        Prueba con otros filtros de búsqueda.
      </p>
    </div>
  );
}