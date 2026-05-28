"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { PanaderiaCard } from "./PanaderiaCard";
import type { Panaderia } from "@/data/panaderias";
import type { Departamento } from "@/data/departamentos";
import type { Ciudad } from "@/data/ciudades";
import { buscarPanaderiasAdmin } from "@/data/panaderias";
import { PanaderiaDrawer } from "./PanaderiaDrawer";

type Props = {
  departamentos: Departamento[];
  ciudades: Ciudad[];
};

export function PanaderiasClient({ departamentos, ciudades }: Props) {
  /* ─── Estados ───────────────────────────────────────────────────── */
  const [panaderias, setPanaderias] = useState<Panaderia[]>([]);
  const [cargando, setCargando] = useState(true);

  const [busqueda, setBusqueda] = useState("");
  const [departamentoSlug, setDepartamentoSlug] = useState<string>("");
  const [ciudadSlug, setCiudadSlug] = useState<string>("");

  const [drawerAbierto, setDrawerAbierto] = useState(false);
  const [panaderiaEditando, setPanaderiaEditando] = useState<Panaderia | null>(
    null,
  );

  /* ─── Cargar panaderías según filtros ───────────────────────────── */
  const cargarPanaderias = useCallback(async () => {
    setCargando(true);
    try {
      const resultados = await buscarPanaderiasAdmin({
        busqueda,
        departamento: departamentoSlug,
        ciudad: ciudadSlug,
      });
      setPanaderias(resultados);
    } catch (error) {
      console.error("Error cargando panaderías:", error);
      setPanaderias([]);
    } finally {
      setCargando(false);
    }
  }, [busqueda, departamentoSlug, ciudadSlug]);

  /* ─── Debounce de búsqueda (300ms) ──────────────────────────────── */
  useEffect(() => {
    const timer = setTimeout(() => {
      cargarPanaderias();
    }, 300);

    return () => clearTimeout(timer);
  }, [cargarPanaderias]);

  /* ─── Handlers del drawer ───────────────────────────────────────── */
  const handleAbrirCrear = () => {
    setPanaderiaEditando(null);
    setDrawerAbierto(true);
  };

  const handleAbrirEditar = (panaderia: Panaderia) => {
    setPanaderiaEditando(panaderia);
    setDrawerAbierto(true);
  };

  const handleCerrarDrawer = () => {
    setDrawerAbierto(false);
    setPanaderiaEditando(null);
  };

  /* ─── Ciudades filtradas por departamento seleccionado ──────────── */
  const ciudadesFiltradas = useMemo(() => {
    if (!departamentoSlug) return ciudades;
    const depto = departamentos.find((d) => d.slug === departamentoSlug);
    if (!depto) return ciudades;
    return ciudades.filter((c) => c.departamento === depto.nombre);
  }, [departamentoSlug, ciudades, departamentos]);

  /* ─── Helpers ───────────────────────────────────────────────────── */
  const departamentoNombre = useMemo(() => {
    return departamentos.find((d) => d.slug === departamentoSlug)?.nombre ?? "";
  }, [departamentoSlug, departamentos]);

  const ciudadNombre = useMemo(() => {
    return ciudades.find((c) => c.slug === ciudadSlug)?.nombre ?? "";
  }, [ciudadSlug, ciudades]);

  const limpiarDepartamento = () => {
    setDepartamentoSlug("");
    setCiudadSlug("");
  };

  const limpiarCiudad = () => setCiudadSlug("");

  return (
    <>
      {/* ═══ Barra de filtros + acciones ═══ */}
      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Filtros izquierdos */}
        <div className="flex flex-wrap items-center gap-3">
          <FiltroDropdown
            label="Departamento"
            icon="flag"
            valorActivo={departamentoNombre}
            opciones={departamentos.map((d) => ({
              valor: d.slug,
              label: d.nombre,
            }))}
            onSelect={(slug) => {
              setDepartamentoSlug(slug);
              setCiudadSlug("");
            }}
            onClear={limpiarDepartamento}
          />

          <FiltroDropdown
            label="Municipio"
            icon="pin"
            valorActivo={ciudadNombre}
            opciones={ciudadesFiltradas.map((c) => ({
              valor: c.slug,
              label: c.nombre,
            }))}
            onSelect={(slug) => setCiudadSlug(slug)}
            onClear={limpiarCiudad}
          />
        </div>

        {/* Acciones derechas */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/panaderias/archivo"
            className="inline-flex items-center gap-2 rounded-full border border-brand-purple/40 bg-white px-5 py-2.5 text-sm font-bold text-brand-purpleDark transition hover:bg-brand-purple/5"
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
          </Link>

          <button
            type="button"
            onClick={handleAbrirCrear}
            className="inline-flex items-center gap-2 rounded-full bg-brand-green px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-greenDark"
          >
            Agregar panadería
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
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </div>

      {/* ═══ Grid de panaderías ═══ */}
      <div className="mt-8">
        {cargando ? (
          <LoadingState />
        ) : panaderias.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {panaderias.map((p) => (
              <PanaderiaCard
                key={p.id}
                panaderia={p}
                onEditar={handleAbrirEditar}
                onArchivada={cargarPanaderias}
              />
            ))}
          </div>
        )}
      </div>

      {/* ═══ Drawer de crear/editar panadería ═══ */}
      <PanaderiaDrawer
        abierto={drawerAbierto}
        onClose={handleCerrarDrawer}
        onGuardar={() => {
          cargarPanaderias();
        }}
        departamentos={departamentos}
        ciudades={ciudades}
        panaderiaInicial={panaderiaEditando}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   FILTRO DROPDOWN
   ═══════════════════════════════════════════════════════════════════════ */

function FiltroDropdown({
  label,
  icon,
  valorActivo,
  opciones,
  onSelect,
  onClear,
}: {
  label: string;
  icon: "flag" | "pin";
  valorActivo: string;
  opciones: { valor: string; label: string }[];
  onSelect: (valor: string) => void;
  onClear: () => void;
}) {
  const [abierto, setAbierto] = useState(false);
  const hayValor = valorActivo.length > 0;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        className={`inline-flex items-center gap-2 rounded-full border-2 px-5 py-2.5 text-sm font-bold transition ${
          hayValor
            ? "border-brand-green bg-white text-brand-green"
            : "border-brand-green/30 bg-white text-brand-green hover:border-brand-green"
        }`}
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
          {icon === "flag" ? (
            <>
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
              <line x1="4" y1="22" x2="4" y2="15" />
            </>
          ) : (
            <>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </>
          )}
        </svg>

        <span>{label}</span>

        {hayValor && (
          <span className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-brand-green px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-white">
            {valorActivo}
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  onClear();
                }
              }}
              className="flex h-4 w-4 cursor-pointer items-center justify-center rounded-full hover:bg-white/20"
              aria-label={`Quitar filtro ${valorActivo}`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                className="h-3 w-3"
                aria-hidden="true"
              >
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </svg>
            </span>
          </span>
        )}

        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-4 w-4 transition-transform ${abierto ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {abierto && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setAbierto(false)}
            aria-hidden="true"
          />

          <div className="absolute left-0 top-full z-20 mt-2 max-h-72 w-64 overflow-y-auto rounded-2xl bg-white shadow-lg ring-1 ring-neutral-200">
            {opciones.length === 0 ? (
              <p className="px-4 py-3 text-sm text-neutral-500">
                No hay opciones disponibles
              </p>
            ) : (
              <ul role="listbox" className="py-2">
                {opciones.map((opt) => (
                  <li key={opt.valor}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(opt.valor);
                        setAbierto(false);
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-neutral-700 transition hover:bg-brand-greenSoft hover:text-brand-greenDark"
                    >
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   LOADING / EMPTY STATES
   ═══════════════════════════════════════════════════════════════════════ */

function LoadingState() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl bg-white ring-1 ring-neutral-200"
        >
          <div className="aspect-[16/9] w-full animate-pulse bg-neutral-200" />
          <div className="space-y-3 p-5">
            <div className="h-5 w-3/4 animate-pulse rounded bg-neutral-200" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-200" />
            <div className="h-3 w-full animate-pulse rounded bg-neutral-200" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-200" />
            <div className="mt-4 flex gap-2">
              <div className="h-10 flex-1 animate-pulse rounded-full bg-neutral-200" />
              <div className="h-10 flex-1 animate-pulse rounded-full bg-neutral-200" />
            </div>
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
        No se encontraron panaderías
      </h2>
      <p className="mt-2 text-sm text-neutral-600">
        Prueba cambiando los filtros o agrega una nueva panadería.
      </p>
    </div>
  );
}
