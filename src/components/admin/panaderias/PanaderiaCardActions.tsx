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
    <div className="mt-auto flex gap-2">
      <button
        type="button"
        onClick={() => onEditar?.(panaderia)}
        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-brand-greenSoft px-3 py-2.5 text-sm font-bold text-brand-green transition hover:bg-brand-green hover:text-white"
      >
        Editar
      </button>

      
        <a href={panaderia.urlGoogleMaps || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-brand-purple/40 bg-white px-3 py-2.5 text-sm font-bold text-brand-purpleDark transition hover:bg-brand-purple/5"
      >
        Ver en Maps
      </a>

      <button
        type="button"
        onClick={handleArchivar}
        disabled={archivando}
        aria-label="Archivar panadería"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-red-200 bg-white text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        🗑
      </button>
    </div>
  );
}