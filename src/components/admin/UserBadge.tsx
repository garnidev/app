"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ROL_LABEL, type Usuario } from "@/lib/auth";

type Props = {
  usuario: Usuario;
  /** Modo compacto (solo avatar, sin nombre ni rol) */
  colapsado?: boolean;
};

/**
 * Badge del usuario en el pie del sidebar
 * - Expandido: pill verde con avatar + nombre + rol + flecha (abre menú)
 * - Colapsado: solo el avatar circular
 * - Click abre un popover con opciones (perfil, cerrar sesión)
 */
export function UserBadge({ usuario, colapsado = false }: Props) {
  const [abierto, setAbierto] = useState(false);

  if (colapsado) {
    return (
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-label={`Menú de usuario: ${usuario.nombre}`}
        className="relative mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-brand-green ring-2 ring-brand-greenDark/40 transition hover:scale-105"
      >
        <Image
          src={usuario.avatar}
          alt=""
          width={40}
          height={40}
          className="h-10 w-10 rounded-full object-cover"
        />
        {abierto && <UserPopover onClose={() => setAbierto(false)} colapsado />}
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-label={`Menú de usuario: ${usuario.nombre}`}
        aria-expanded={abierto}
        className="flex w-full items-center gap-3 rounded-full bg-brand-green py-2 pl-2 pr-3 text-left text-white shadow-lg ring-1 ring-brand-greenDark/30 transition hover:bg-brand-greenDark"
      >
        <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-white ring-2 ring-white/30">
          <Image
            src={usuario.avatar}
            alt=""
            fill
            sizes="44px"
            className="object-cover"
          />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold">
            {usuario.nombre}
          </span>
          <span className="block truncate text-xs text-white/85">
            {ROL_LABEL[usuario.rol]}
          </span>
        </span>
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-purple text-white transition ${
            abierto ? "rotate-90" : ""
          }`}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </span>
      </button>

      {abierto && <UserPopover onClose={() => setAbierto(false)} />}
    </div>
  );
}

/* ─── Popover con opciones del usuario ────────────────────────────── */

function UserPopover({
  onClose,
  colapsado = false,
}: {
  onClose: () => void;
  colapsado?: boolean;
}) {
  return (
    <>
      {/* Backdrop para cerrar al click fuera */}
      <button
        type="button"
        aria-label="Cerrar menú"
        onClick={onClose}
        className="fixed inset-0 z-40 cursor-default"
      />
      <div
        className={`absolute bottom-full z-50 mb-2 w-56 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 ${
          colapsado ? "left-full ml-2" : "left-0"
        }`}
      >
        <div className="border-b border-neutral-100 px-4 py-3">
          <p className="text-xs font-semibold text-neutral-500">Sesión activa</p>
        </div>
        <ul className="py-1">
          <li>
            <Link
              href="/admin/perfil"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-neutral-500"
                aria-hidden="true"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Mi perfil
            </Link>
          </li>
          <li>
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-neutral-500"
                aria-hidden="true"
              >
                <path d="M3 11l9-8 9 8v9a2 2 0 0 1-2 2h-4v-6h-6v6H5a2 2 0 0 1-2-2v-9z" />
              </svg>
              Volver al sitio
            </Link>
          </li>
        </ul>
        <div className="border-t border-neutral-100">
          <Link
            href="/login"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
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
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Cerrar sesión
          </Link>
        </div>
      </div>
    </>
  );
}