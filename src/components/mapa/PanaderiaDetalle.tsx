"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { formatearPrecio, type Panaderia } from "@/data/panaderias";

type Props = {
  panaderia: Panaderia;
  onClose: () => void;
  onShare: () => void;
};

/** Hook para detectar móvil */
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

/**
 * Tarjeta de detalle de panadería.
 * - Desktop: tarjeta flotante con imagen grande arriba
 * - Móvil: bottom sheet sin imagen grande, con drag handle + swipe-to-close
 */
export function PanaderiaDetalle({ panaderia, onClose, onShare }: Props) {
  const isMobile = useIsMobile();

  // Swipe-to-close (solo móvil)
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartY = useRef(0);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!isMobile) return;
      touchStartY.current = e.touches[0].clientY;
      setIsDragging(true);
    },
    [isMobile],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isMobile || !isDragging) return;
      const diff = e.touches[0].clientY - touchStartY.current;
      if (diff > 0) setSwipeOffset(diff);
    },
    [isMobile, isDragging],
  );

  const handleTouchEnd = useCallback(() => {
    if (!isMobile) return;
    setIsDragging(false);
    if (swipeOffset > 100) onClose();
    setSwipeOffset(0);
  }, [isMobile, swipeOffset, onClose]);

  return (
    <div
      style={{
        transform:
          isDragging && swipeOffset > 0
            ? `translateY(${swipeOffset}px)`
            : undefined,
        transition: isDragging ? "none" : "transform 300ms ease-out",
      }}
      className={`pointer-events-auto flex w-full flex-col overflow-hidden bg-white shadow-2xl ${
        isMobile
          ? "h-full rounded-t-3xl"
          : "max-h-[calc(100vh-180px)] max-w-md rounded-3xl"
      }`}
    >
      {/* MÓVIL: Drag handle */}
      {isMobile && (
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="flex shrink-0 cursor-grab justify-center pb-1 pt-3 active:cursor-grabbing"
        >
          <div className="h-1.5 w-12 rounded-full bg-neutral-300" />
        </div>
      )}

      {/* DESKTOP: Imagen grande + botón cerrar encima */}
      {!isMobile && (
        <div className="relative h-48 w-full shrink-0 overflow-hidden">
          <Image
            src={panaderia.imagen}
            alt={panaderia.nombre}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover"
            priority
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar detalle"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-neutral-700 shadow-md transition hover:bg-white hover:shadow-lg"
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

      {/* MÓVIL: Header con nombre + X */}
      {isMobile && (
        <div className="flex shrink-0 items-start justify-between px-5 pb-2 pt-2">
          <h2 className="pr-3 text-xl font-extrabold italic text-support-navy">
            {panaderia.nombre}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar detalle"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition hover:bg-neutral-200"
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

      {/* Contenido scrolleable */}
      <div className={`flex-1 overflow-y-auto ${isMobile ? "px-5 pb-5" : "p-5"}`}>
        {/* Nombre (solo desktop, en móvil ya está arriba) */}
        {!isMobile && (
          <h2 className="text-xl font-extrabold italic text-support-navy md:text-2xl">
            {panaderia.nombre}
          </h2>
        )}

        {/* Descripción */}
        <p className={`text-sm text-neutral-700 md:text-[15px] ${isMobile ? "" : "mt-2"}`}>
          {panaderia.descripcionCorta}
        </p>

        {/* Línea separadora */}
        <div className="my-4 h-px bg-neutral-200" />

        {/* Información de contacto */}
        <ul className="space-y-3">
          <InfoItem icon="phone">{panaderia.telefono}</InfoItem>
          <InfoItem icon="location">{panaderia.direccion}</InfoItem>
          <InfoItem icon="clock">{panaderia.horario}</InfoItem>
        </ul>

        {/* Botón Compartir */}
        <button
          type="button"
          onClick={onShare}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white py-3 text-sm font-semibold text-neutral-800 transition hover:border-brand-green hover:bg-brand-greenSoft/30 md:text-base"
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
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <path d="M8.59 13.51L15.42 17.49M15.41 6.51L8.59 10.49" />
          </svg>
          Compartir
        </button>

        {/* Línea separadora */}
        <div className="my-4 h-px bg-neutral-200" />

        {/* MÓVIL: aquí irá el carrusel cuando lo definas */}
        {isMobile && (
          <div className="mb-4">
            <ImagenPanaderiaMobile panaderia={panaderia} />
          </div>
        )}

        {/* Productos */}
        {panaderia.productos.length > 0 && (
          <ul className="flex flex-col gap-3">
            {panaderia.productos.map((producto) => (
              <li key={producto.id}>
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-neutral-200">
                    <Image
                      src={producto.imagen}
                      alt={producto.nombre}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-bold italic text-support-navy md:text-base">
                      {producto.nombre}
                    </h4>
                    <p className="text-xs text-neutral-600 md:text-sm">
                      {formatearPrecio(producto.precio)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ─── Subcomponente: imagen móvil (placeholder del carrusel futuro) ── */

function ImagenPanaderiaMobile({ panaderia }: { panaderia: Panaderia }) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-neutral-200">
      <Image
        src={panaderia.imagen}
        alt={panaderia.nombre}
        fill
        sizes="100vw"
        className="object-cover"
      />
    </div>
  );
}

/* ─── Subcomponente: item de info con ícono verde ─────────────────── */

function InfoItem({
  icon,
  children,
}: {
  icon: "phone" | "location" | "clock";
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-greenSoft text-brand-green ring-2 ring-brand-green/30">
        <IconoInfo tipo={icon} />
      </span>
      <span className="pt-1 text-sm text-neutral-700 md:text-[15px]">
        {children}
      </span>
    </li>
  );
}

function IconoInfo({ tipo }: { tipo: "phone" | "location" | "clock" }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-3.5 w-3.5",
    "aria-hidden": true,
  };

  if (tipo === "phone") {
    return (
      <svg {...common}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z" />
      </svg>
    );
  }
  if (tipo === "location") {
    return (
      <svg {...common}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}