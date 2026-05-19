"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { SinResultados } from "./SinResultados";
import {
  DEPARTAMENTOS,
  buscarUbicaciones,
  getDepartamentoPorSlug,
  getDepartamentoPorNombre,
  type Departamento,
  type Ubicacion,
} from "@/data/departamentos";
import {
  buscarPanaderias,
  contarPanaderiasPorDepartamento,
  MOCK_PANADERIAS,
  type Panaderia,
} from "@/data/panaderias";
import { DepartamentoCard } from "./DepartamentoCard";
import { PanaderiaCard } from "./PanaderiaCard";
import { DepartamentoDetalle } from "./DepartamentoDetalle";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSelectDepartamento?: (depto: Departamento) => void;
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
  onSelectDepartamento,
  onSelectPanaderia,
  onAbrirChange,
  panaderiaActivaId,
}: Props) {
  const [abierto, setAbiertoLocal] = useState(false);
  const [departamentoActivo, setDepartamentoActivo] =
    useState<Departamento | null>(null);
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

  const ubicacionesResult = useMemo(() => buscarUbicaciones(value), [value]);

  const panaderiasResult = useMemo(
    () => (tieneBusqueda ? buscarPanaderias(value) : []),
    [value, tieneBusqueda],
  );

  const totalResultados = ubicacionesResult.length + panaderiasResult.length;

  const sinResultados =
    tieneBusqueda &&
    ubicacionesResult.length === 0 &&
    panaderiasResult.length === 0;

  /** Cierra al hacer click afuera */
  useEffect(() => {
    if (!panelVisible) return;

    const handleClickAfuera = (e: MouseEvent) => {
      if (
        contenedorRef.current &&
        !contenedorRef.current.contains(e.target as Node)
      ) {
        setAbierto(false);
        if (enDetalle) setDepartamentoActivo(null);
      }
    };

    document.addEventListener("mousedown", handleClickAfuera);
    return () => document.removeEventListener("mousedown", handleClickAfuera);
  }, [panelVisible, enDetalle]);

  const seleccionarDepartamento = (depto: Departamento) => {
    setDepartamentoActivo(depto);
    onSelectDepartamento?.(depto);
  };

  const seleccionarUbicacion = (u: Ubicacion) => {
    if (u.tipo === "departamento" && u.slug) {
      const depto = getDepartamentoPorSlug(u.slug);
      if (depto) seleccionarDepartamento(depto);
    } else if (u.tipo === "ciudad") {
      const ciudad = u.nombre;
      const primeraPanaderia = encontrarPanaderiaPorCiudad(ciudad);
      if (primeraPanaderia) {
        const depto = getDepartamentoPorNombre(primeraPanaderia.departamento);
        if (depto) seleccionarDepartamento(depto);
      }
    }
  };

  const cerrarDetalle = () => {
    setDepartamentoActivo(null);
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
      // Solo permitimos swipe hacia abajo (positivo)
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

    // Si arrastró más de 100px hacia abajo, cierra
    if (swipeOffset > 100) {
      setAbierto(false);
      if (enDetalle) setDepartamentoActivo(null);
    }
    setSwipeOffset(0);
  }, [isMobile, swipeOffset, enDetalle]);

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
      className={`relative flex flex-col bg-white shadow-2xl ${
        panelVisible ? "h-full md:rounded-none" : "h-auto rounded-3xl"
      } ${panelVisible && isMobile ? "rounded-t-3xl" : ""}`}
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

      {/* Header móvil: título + botón X (solo cuando panel abierto en móvil) */}
      {panelVisible && isMobile && !enDetalle && (
        <div className="flex shrink-0 items-center justify-between px-5 pb-2 pt-2">
          <h2 className="text-base font-bold italic text-support-navy">
            Seleccione un departamento
          </h2>
          <button
            type="button"
            onClick={() => {
              setAbierto(false);
              if (enDetalle) setDepartamentoActivo(null);
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
        className={`relative shrink-0 ${
          panelVisible
            ? isMobile
              ? "px-4 pb-3" // móvil con panel abierto: padding reducido
              : "border-b border-neutral-100 p-4" // desktop con panel abierto
            : "p-3" // cápsula sola
        }`}
      >
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
              : "border border-neutral-200 focus:border-brand-green focus:ring-brand-green/30"
          } ${enDetalle ? "cursor-default" : ""}`}
        />
        {/* Botón X o lupa al lado derecho del input */}
        {enDetalle ? (
          <button
            type="button"
            aria-label="Volver a la lista"
            onClick={cerrarDetalle}
            className={`absolute top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-neutral-500 transition hover:bg-neutral-100 ${
              panelVisible ? (isMobile ? "right-6" : "right-6") : "right-5"
            }`}
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
            className={`absolute top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-neutral-500 transition hover:bg-neutral-100 ${
              panelVisible ? (isMobile ? "right-6" : "right-6") : "right-5"
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

      {/* Contenido scrolleable que ocupa el resto del alto */}
      {panelVisible && (
        <div className="flex-1 overflow-y-auto">
          {enDetalle ? (
            <DepartamentoDetalle
              departamento={departamentoActivo!}
              totalPanaderias={contarPanaderiasPorDepartamento(
                departamentoActivo!.nombre,
              )}
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
                  {totalResultados}{" "}
                  {totalResultados === 1 ? "resultado" : "resultados"}
                </span>
              </div>
              <ResultadosBusqueda
                ubicaciones={ubicacionesResult}
                panaderias={panaderiasResult}
                onSelectUbicacion={seleccionarUbicacion}
                onSelectPanaderia={(p) => onSelectPanaderia?.(p)}
              />
            </>
          ) : (
            <ListaDepartamentos
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
  onSelectDepartamento,
}: {
  onSelectDepartamento: (depto: Departamento) => void;
}) {
  return (
    <>
      <div className="flex items-baseline justify-between border-t border-neutral-100 px-6 py-3">
        <h2 className="text-sm font-semibold italic text-neutral-700 md:text-base">
          Departamentos
        </h2>
        <span className="text-sm font-bold italic text-neutral-700 md:text-base">
          {DEPARTAMENTOS.length}
        </span>
      </div>

      <ul role="listbox" className="flex flex-col gap-1 px-3 pb-3">
        {DEPARTAMENTOS.map((depto) => (
          <li key={depto.slug} role="option" aria-selected={false}>
            <DepartamentoCard
              departamento={depto}
              cantidadPanaderias={contarPanaderiasPorDepartamento(depto.nombre)}
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
  onSelectUbicacion,
  onSelectPanaderia,
}: {
  ubicaciones: Ubicacion[];
  panaderias: Panaderia[];
  onSelectUbicacion: (u: Ubicacion) => void;
  onSelectPanaderia: (p: Panaderia) => void;
}) {
  // Estado vacío: sin coincidencias en ninguno de los 2 bloques
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
      className="group flex w-full items-center gap-4 rounded-2xl bg-white px-3 py-3 text-left transition hover:bg-neutral-50"
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-neutral-200 ring-2 ring-brand-green/30">
        <Image
          src={ubicacion.imagen}
          alt={ubicacion.nombre}
          fill
          sizes="56px"
          className="object-cover"
        />
      </div>

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
    </button>
  );
}

/* ─── Helper interno ──────────────────────────────────────────────── */

function encontrarPanaderiaPorCiudad(ciudad: string): Panaderia | undefined {
  return MOCK_PANADERIAS.find(
    (p) =>
      p.ciudad
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") ===
      ciudad
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""),
  );
}
