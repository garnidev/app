"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { SinResultados } from "./SinResultados";
import {
  buscarUbicaciones,
  getDepartamentoPorSlug,
  type Departamento,
  type Ubicacion,
} from "@/data/departamentos";
import {
  contarMarkersPorDepartamento,
  type Panaderia,
  type PanaderiaMarker,
} from "@/data/panaderias";
import type { Ciudad } from "@/data/ciudades";
import { DepartamentoCard } from "./DepartamentoCard";
import { PanaderiaCard } from "./PanaderiaCard";
import { DepartamentoDetalle } from "./DepartamentoDetalle";

type Props = {
  value: string;
  onChange: (v: string) => void;

  // Datos del backend (recibidos del padre)
  markers: PanaderiaMarker[];
  departamentos: Departamento[];
  ciudades: Ciudad[];

  // Estado del departamento activo (controlado desde el padre)
  departamentoActivo: Departamento | null;
  panaderiasDepto: Panaderia[];
  cargandoDepto: boolean;
  cargandoInicial: boolean;

  // Resultados de búsqueda (controlado desde el padre)
  panaderiasBusqueda: Panaderia[];
  cargandoBusqueda: boolean;

  // Callbacks
  onSelectDepartamento?: (depto: Departamento) => void;
  onCerrarDepartamento?: () => void;
  onSelectPanaderia?: (panaderia: Panaderia) => void;
  onAbrirChange?: (abierto: boolean) => void;
  panaderiaActivaId?: string;
};

/**
 * Buscador flotante del mapa con 3 estados:
 *
 * 1. SIN BÚSQUEDA: lista de los 32 departamentos
 * 2. CON BÚSQUEDA: 2 bloques (ubicaciones + panaderías)
 * 3. DEPARTAMENTO SELECCIONADO: vista detalle con panaderías agrupadas por ciudad
 */

/** Detecta si es móvil (ancho < 768px) reactivo */
function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}

export function BuscadorMapa({
  value,
  onChange,
  markers,
  departamentos,
  ciudades,
  departamentoActivo,
  panaderiasDepto,
  cargandoDepto,
  cargandoInicial,
  panaderiasBusqueda,
  cargandoBusqueda,
  onSelectDepartamento,
  onCerrarDepartamento,
  onSelectPanaderia,
  onAbrirChange,
  panaderiaActivaId,
}: Props) {
  const [abierto, setAbiertoLocal] = useState(false);
  const contenedorRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartY = useRef<number>(0);

  const setAbierto = (v: boolean) => {
    setAbiertoLocal(v);
    onAbrirChange?.(v);
  };

  const tieneBusqueda = value.trim().length > 0;
  const enDetalle = departamentoActivo !== null;
  const panelVisible = abierto || enDetalle;

  /* ─── Búsqueda de ubicaciones (in-memory sobre deptos + ciudades) ─ */
  const ubicacionesResult = useMemo(
    () => buscarUbicaciones(departamentos, ciudades, markers, value),
    [departamentos, ciudades, markers, value],
  );

  const totalResultados = ubicacionesResult.length + panaderiasBusqueda.length;

  const sinResultados =
    tieneBusqueda &&
    !cargandoBusqueda &&
    ubicacionesResult.length === 0 &&
    panaderiasBusqueda.length === 0;

  /** Cierra al hacer click afuera */
  useEffect(() => {
    if (!panelVisible) return;

    const handleClickAfuera = (e: MouseEvent) => {
      const target = e.target as Element;

      if (contenedorRef.current && contenedorRef.current.contains(target)) {
        return;
      }

      if (
        target.closest("[data-mapa-overlay]") ||
        target.closest("[role='dialog']") ||
        target.closest(".mapboxgl-marker") ||
        target.closest(".mapboxgl-ctrl")
      ) {
        return;
      }

      setAbierto(false);
    };

    document.addEventListener("mousedown", handleClickAfuera);
    return () => document.removeEventListener("mousedown", handleClickAfuera);
  }, [panelVisible]);

  const seleccionarDepartamento = (depto: Departamento) => {
    onSelectDepartamento?.(depto);
  };

  const seleccionarUbicacion = (u: Ubicacion) => {
    if (u.tipo === "departamento" && u.slug) {
      const depto = getDepartamentoPorSlug(departamentos, u.slug);
      if (depto) seleccionarDepartamento(depto);
    } else if (u.tipo === "ciudad") {
      // Buscar el departamento al que pertenece la ciudad
      const ciudad = ciudades.find((c) => c.nombre === u.nombre);
      if (ciudad) {
        const depto = departamentos.find(
          (d) => d.nombre === ciudad.departamento,
        );
        if (depto) seleccionarDepartamento(depto);
      }
    }
  };

  const cerrarDetalle = () => {
    onCerrarDepartamento?.();
    onChange("");
  };

  /** Gesto: inicio del swipe */
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!isMobile) return;
      touchStartY.current = e.touches[0].clientY;
      setIsDragging(true);
    },
    [isMobile],
  );

  /** Gesto: durante el swipe */
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isMobile || !isDragging) return;
      const currentY = e.touches[0].clientY;
      const diff = currentY - touchStartY.current;
      if (diff > 0) {
        setSwipeOffset(diff);
      }
    },
    [isMobile, isDragging],
  );

  /** Gesto: fin del swipe */
  const handleTouchEnd = useCallback(() => {
    if (!isMobile) return;
    setIsDragging(false);

    if (swipeOffset > 100) {
      setAbierto(false);
      if (enDetalle) onCerrarDepartamento?.();
    }
    setSwipeOffset(0);
  }, [isMobile, swipeOffset, enDetalle, onCerrarDepartamento]);

  return (
    <div
      ref={contenedorRef}
      style={{
        transform:
          isDragging && swipeOffset > 0
            ? `translateY(${swipeOffset}px)`
            : undefined,
        transition: isDragging ? "none" : "transform 300ms ease-out",
      }}
      className={`relative flex flex-col transition-all ${
        panelVisible
          ? `h-full overflow-hidden bg-white shadow-2xl ${isMobile ? "rounded-t-3xl" : "rounded-3xl"}`
          : "h-auto bg-transparent"
      }`}
    >
      {/* Drag handle visible solo en móvil cuando el panel está abierto */}
      {panelVisible && isMobile && (
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="flex shrink-0 cursor-grab justify-center pt-3 pb-1 active:cursor-grabbing"
        >
          <div className="h-1.5 w-12 rounded-full bg-neutral-300" />
        </div>
      )}

      {/* Header móvil: título + botón X */}
      {panelVisible && isMobile && !enDetalle && (
        <div className="flex shrink-0 items-center justify-between px-5 pb-2 pt-2">
          <h2 className="text-base font-bold italic text-support-navy">
            Seleccione un departamento
          </h2>
          <button
            type="button"
            onClick={() => {
              setAbierto(false);
              if (enDetalle) onCerrarDepartamento?.();
            }}
            aria-label="Cerrar panel"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition hover:bg-neutral-200"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>
      )}

      {/* Input fijo arriba */}
      <div
        className={`shrink-0 ${
          panelVisible
            ? isMobile
              ? "px-4 pb-3"
              : "border-b border-neutral-100 p-4"
            : ""
        }`}
      >
        {/* Wrapper interno relativo: el input y la lupa siempre quedan centrados entre sí */}
        <div className="relative">
          <input
            type="search"
            value={enDetalle ? departamentoActivo!.nombre : value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => {
              if (!enDetalle) setAbierto(true);
            }}
            onClick={() => {
              if (!enDetalle) setAbierto(true);
            }}
            readOnly={enDetalle}
            placeholder="Buscar"
            aria-label="Buscar panaderías"
            aria-expanded={abierto}
            aria-haspopup="listbox"
            className={`w-full rounded-full bg-white py-3 pl-5 pr-14 text-sm font-medium text-neutral-800 placeholder:text-neutral-500 focus:outline-none focus:ring-2 md:text-base ${
              sinResultados
                ? "border-2 border-red-500 text-red-600 focus:ring-red-500/30"
                : panelVisible
                  ? "border border-neutral-200 focus:border-brand-green focus:ring-brand-green/30"
                  : "border-2 border-brand-green focus:ring-brand-green/30"
            } ${enDetalle ? "cursor-default" : ""}`}
          />

          {/* Botón X o lupa al lado derecho del input */}
          {enDetalle ? (
            <button
              type="button"
              aria-label="Volver a la lista"
              onClick={cerrarDetalle}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-neutral-500 transition hover:bg-neutral-100"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M6 18L18 6" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              aria-label="Buscar"
              onClick={() => setAbierto(true)}
              className={`absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full transition hover:bg-neutral-100 ${
                panelVisible ? "text-neutral-500" : "text-brand-green"
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
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Contenido scrolleable */}
      {panelVisible && (
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {enDetalle ? (
            <DepartamentoDetalle
              departamento={departamentoActivo!}
              totalPanaderias={contarMarkersPorDepartamento(
                markers,
                departamentoActivo!.slug,
              )}
              panaderias={panaderiasDepto}
              cargando={cargandoDepto}
              onSelectPanaderia={(p) => onSelectPanaderia?.(p)}
              panaderiaActivaId={panaderiaActivaId}
            />
          ) : tieneBusqueda ? (
            <>
              <div className="px-6 py-2">
                <span
                  className={`text-xs font-bold italic md:text-sm ${
                    sinResultados ? "text-red-600" : "text-neutral-700"
                  }`}
                >
                  {cargandoBusqueda
                    ? "Buscando..."
                    : `${totalResultados} ${
                        totalResultados === 1 ? "resultado" : "resultados"
                      }`}
                </span>
              </div>
              <ResultadosBusqueda
                ubicaciones={ubicacionesResult}
                panaderias={panaderiasBusqueda}
                cargando={cargandoBusqueda}
                onSelectUbicacion={seleccionarUbicacion}
                onSelectPanaderia={(p) => onSelectPanaderia?.(p)}
              />
            </>
          ) : (
            <ListaDepartamentos
              departamentos={departamentos}
              markers={markers}
              cargando={cargandoInicial}
              onSelectDepartamento={seleccionarDepartamento}
            />
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SUBCOMPONENTES
   ═══════════════════════════════════════════════════════════════════════ */

function ListaDepartamentos({
  departamentos,
  markers,
  cargando,
  onSelectDepartamento,
}: {
  departamentos: Departamento[];
  markers: PanaderiaMarker[];
  cargando: boolean;
  onSelectDepartamento: (depto: Departamento) => void;
}) {
  if (cargando) {
    return (
      <>
        <div className="flex items-baseline justify-between border-t border-neutral-100 px-6 py-3">
          <h2 className="text-sm font-semibold italic text-neutral-700 md:text-base">
            Departamentos
          </h2>
          <div className="h-4 w-8 animate-pulse rounded bg-neutral-200" />
        </div>
        <ul className="flex flex-col gap-1 px-3 pb-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <li key={i}>
              <div className="flex items-center gap-4 rounded-2xl p-3">
                <div className="h-14 w-14 shrink-0 animate-pulse rounded-full bg-neutral-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-200" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-200" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </>
    );
  }

  return (
    <>
      <div className="flex items-baseline justify-between border-t border-neutral-100 px-6 py-3">
        <h2 className="text-sm font-semibold italic text-neutral-700 md:text-base">
          Departamentos
        </h2>
        <span className="text-sm font-bold italic text-neutral-700 md:text-base">
          {departamentos.length}
        </span>
      </div>

      <ul role="listbox" className="flex flex-col gap-1 px-3 pb-3">
        {departamentos.map((depto) => (
          <li key={depto.slug} role="option" aria-selected={false}>
            <DepartamentoCard
              departamento={depto}
              cantidadPanaderias={contarMarkersPorDepartamento(
                markers,
                depto.slug,
              )}
              onClick={onSelectDepartamento}
            />
          </li>
        ))}
      </ul>
    </>
  );
}

function ResultadosBusqueda({
  ubicaciones,
  panaderias,
  cargando,
  onSelectUbicacion,
  onSelectPanaderia,
}: {
  ubicaciones: Ubicacion[];
  panaderias: Panaderia[];
  cargando: boolean;
  onSelectUbicacion: (u: Ubicacion) => void;
  onSelectPanaderia: (p: Panaderia) => void;
}) {
  if (cargando) {
    return (
      <div className="space-y-3 px-3 py-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-2xl bg-neutral-50 p-3"
          >
            <div className="h-14 w-14 shrink-0 animate-pulse rounded-full bg-neutral-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Estado vacío
  if (ubicaciones.length === 0 && panaderias.length === 0) {
    return <SinResultados />;
  }

  return (
    <>
      {ubicaciones.length > 0 && (
        <section>
          <div className="flex items-baseline justify-between border-t border-neutral-100 px-6 py-3">
            <h2 className="text-sm font-semibold italic text-neutral-700 md:text-base">
              Departamentos y/o ciudades
            </h2>
            <span className="text-sm font-bold italic text-neutral-700 md:text-base">
              {ubicaciones.length}
            </span>
          </div>

          <ul role="listbox" className="flex flex-col gap-1 px-3 pb-2">
            {ubicaciones.map((u) => (
              <li key={u.id} role="option" aria-selected={false}>
                <UbicacionCard
                  ubicacion={u}
                  onClick={() => onSelectUbicacion(u)}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {panaderias.length > 0 && (
        <section>
          <div className="flex items-baseline justify-between border-t border-neutral-100 px-6 py-3">
            <h2 className="text-sm font-semibold italic text-neutral-700 md:text-base">
              Panaderías
            </h2>
            <span className="text-sm font-bold italic text-neutral-700 md:text-base">
              {panaderias.length}
            </span>
          </div>

          <ul role="listbox" className="flex flex-col gap-1 px-3 pb-3">
            {panaderias.map((p) => (
              <li key={p.id} role="option" aria-selected={false}>
                <PanaderiaCard
                  panaderia={p}
                  onClick={() => onSelectPanaderia(p)}
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

function UbicacionCard({
  ubicacion,
  onClick,
}: {
  ubicacion: Ubicacion;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex w-full items-center py-2 pl-0 pr-0 text-left"
    >
      {/* Foto circular sobresaliente */}
      <div className="relative z-10 h-14 w-14 shrink-0 overflow-hidden rounded-full bg-neutral-200 shadow-md ring-2 ring-brand-green/40">
        <Image
          src={ubicacion.imagen}
          alt={ubicacion.nombre}
          fill
          sizes="56px"
          className="object-cover"
        />
      </div>

      {/* Rectángulo con texto + trigo */}
      <div className="relative -ml-7 flex flex-1 items-center justify-between gap-3 rounded-full bg-white py-3 pl-10 pr-3 shadow-md ring-1 ring-neutral-100 transition group-hover:ring-brand-green/30 group-hover:shadow-lg">
        {/* Texto */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-bold italic text-support-navy md:text-lg">
            {ubicacion.nombre}
          </h3>
          <p className="mt-0.5 text-xs text-neutral-600 md:text-sm">
            {ubicacion.cantidadPanaderias === 1
              ? "1 panadería"
              : `${ubicacion.cantidadPanaderias} panaderías`}
          </p>
        </div>

        {/* Ícono de trigo */}
        <Image
          src="/assets/trigo-verde.svg"
          alt=""
          width={28}
          height={40}
          className="h-10 w-auto shrink-0 opacity-70"
          aria-hidden="true"
        />
      </div>
    </button>
  );
}
