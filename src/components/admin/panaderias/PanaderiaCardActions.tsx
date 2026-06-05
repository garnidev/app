"use client";

import { useState } from "react";
import type { Panaderia } from "@/data/panaderias";

type Props = {
  panaderia: Panaderia;
  onEditar?: (panaderia: Panaderia) => void;
  onArchivada?: () => void;
};

export function PanaderiaCardActions({ panaderia, onEditar, onArchivada }: Props) {
  const [archivando, setArchivando] = useState(false);

  const handleArchivar = async () => {
    const mensaje = "¿Archivar \"" + panaderia.nombre + "\"? Dejará de mostrarse en el mapa público.";
    if (!confirm(mensaje)) return;

    setArchivando(true);
    try {
      const res = await fetch(`/api/panaderias/${panaderia.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "ARCHIVADA" }),
      });
      if (!res.ok) throw new Error("Error al archivar");
      onArchivada?.();
    } catch (error) {
      console.error("Error archivando:", error);
      alert("No se pudo archivar la panadería");
    } finally {
      setArchivando(false);
    }
  };

  return (
    <div className="mt-auto flex items-center gap-2">
      {/* Editar */}
      <button
        type="button"
        onClick={() => onEditar?.(panaderia)}
        aria-label="Editar panadería"
        className="
          flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-greenSoft text-brand-green transition hover:bg-brand-green hover:text-white
          md:inline-flex md:h-auto md:w-auto md:flex-1 md:gap-1.5 md:rounded-full md:px-3 md:py-2.5 md:text-sm md:font-bold
        "
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 shrink-0"
          aria-hidden="true"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        <span className="hidden md:inline">Editar</span>
      </button>

      {/* Ver en Maps */}
      <a
        href={panaderia.urlGoogleMaps || "#"}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Ver en Maps"
        className="
          flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-purple/40 bg-white text-brand-purpleDark transition hover:bg-brand-purple/5
          md:inline-flex md:h-auto md:w-auto md:flex-1 md:gap-1.5 md:rounded-full md:px-3 md:py-2.5 md:text-sm md:font-bold
        "
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 shrink-0"
          aria-hidden="true"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span className="hidden md:inline">Ver en Maps</span>
      </a>

      {/* Archivar (eliminar) */}
      <button
        type="button"
        onClick={handleArchivar}
        disabled={archivando}
        aria-label="Archivar panadería"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-red-200 bg-white text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
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
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
        </svg>
      </button>
    </div>
  );
}