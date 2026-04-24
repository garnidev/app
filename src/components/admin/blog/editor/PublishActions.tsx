"use client";

import Link from "next/link";
import { useState } from "react";

type Props = {
  /** Callback al guardar como borrador */
  onGuardar: () => void;
  /** Callback al publicar */
  onPublicar: () => void;
  /** Callback al publicar programado (opcional) */
  onProgramar?: () => void;
  /** Ruta del preview (preview abre en nueva pestaña) */
  previewHref?: string;
  /** Estado de envío para deshabilitar botones */
  enviando?: boolean;
};

/**
 * Barra de acciones de publicación del editor.
 * - Botón "Preview" (ícono de ojo circular)
 * - Botón "Guardar" (outline morado con ícono)
 * - Split button: "Publicar" + chevron que abre opciones (Programar, etc.)
 */
export function PublishActions({
  onGuardar,
  onPublicar,
  onProgramar,
  previewHref,
  enviando = false,
}: Props) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <div className="flex items-center gap-2 md:gap-3">
      {/* ─── Botón Preview ─── */}
      {previewHref ? (
        <Link
          href={previewHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Vista previa del artículo"
          title="Vista previa (abre en nueva pestaña)"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-purple/50 bg-white text-brand-purpleDark transition hover:bg-brand-purple/5"
        >
          <IconoOjo />
        </Link>
      ) : (
        <button
          type="button"
          disabled
          aria-label="Vista previa (guarda primero)"
          title="Guarda el artículo antes de ver vista previa"
          className="flex h-11 w-11 cursor-not-allowed items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-400"
        >
          <IconoOjo />
        </button>
      )}

      {/* ─── Botón Guardar (borrador) ─── */}
      <button
        type="button"
        onClick={onGuardar}
        disabled={enviando}
        className="inline-flex items-center gap-2 rounded-full border border-brand-purple/50 bg-white px-5 py-2.5 text-sm font-bold text-brand-purpleDark transition hover:bg-brand-purple/5 disabled:cursor-not-allowed disabled:opacity-50"
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
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </svg>
        Guardar
      </button>

      {/* ─── Split button: Publicar + chevron ─── */}
      <div className="relative flex">
        <button
          type="button"
          onClick={onPublicar}
          disabled={enviando}
          className="inline-flex items-center gap-2 rounded-l-full bg-brand-green px-5 py-2.5 text-sm font-bold text-white shadow-soft transition hover:bg-brand-greenDark disabled:cursor-not-allowed disabled:opacity-50"
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
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
          {enviando ? "Publicando..." : "Publicar"}
        </button>

        {/* Chevron ▼ (abre opciones de publicación) */}
        <button
          type="button"
          onClick={() => setMenuAbierto((v) => !v)}
          disabled={enviando}
          aria-label="Más opciones de publicación"
          aria-expanded={menuAbierto}
          aria-haspopup="menu"
          className="flex items-center justify-center rounded-r-full border-l border-brand-greenDark/30 bg-brand-green px-3 text-white shadow-soft transition hover:bg-brand-greenDark disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`h-4 w-4 transition-transform ${
              menuAbierto ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {/* Dropdown de opciones */}
        {menuAbierto && (
          <>
            <button
              type="button"
              aria-label="Cerrar menú"
              onClick={() => setMenuAbierto(false)}
              className="fixed inset-0 z-10 cursor-default"
            />
            <ul
              role="menu"
              className="absolute right-0 top-full z-20 mt-2 w-60 overflow-hidden rounded-2xl bg-white py-1 shadow-xl ring-1 ring-neutral-200"
            >
              <MenuItem
                onClick={() => {
                  setMenuAbierto(false);
                  onPublicar();
                }}
                titulo="Publicar ahora"
                descripcion="El artículo queda visible de inmediato"
                icono={<IconoRayo />}
              />
              {onProgramar && (
                <MenuItem
                  onClick={() => {
                    setMenuAbierto(false);
                    onProgramar();
                  }}
                  titulo="Programar publicación"
                  descripcion="Elige fecha y hora de publicación"
                  icono={<IconoCalendario />}
                />
              )}
              <MenuItem
                onClick={() => {
                  setMenuAbierto(false);
                  onGuardar();
                }}
                titulo="Guardar como borrador"
                descripcion="No será visible en el blog"
                icono={<IconoBorrador />}
              />
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SUBCOMPONENTES Y ICONOS
   ═══════════════════════════════════════════════════════════════════════ */

type MenuItemProps = {
  onClick: () => void;
  titulo: string;
  descripcion: string;
  icono: React.ReactNode;
};

function MenuItem({ onClick, titulo, descripcion, icono }: MenuItemProps) {
  return (
    <li role="none">
      <button
        type="button"
        role="menuitem"
        onClick={onClick}
        className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-neutral-50"
      >
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-greenSoft text-brand-green">
          {icono}
        </span>
        <span className="flex-1">
          <span className="block text-sm font-bold text-neutral-900">
            {titulo}
          </span>
          <span className="block text-xs text-neutral-500">{descripcion}</span>
        </span>
      </button>
    </li>
  );
}

function IconoOjo() {
  return (
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
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconoRayo() {
  return (
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
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function IconoCalendario() {
  return (
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
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconoBorrador() {
  return (
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
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  );
}