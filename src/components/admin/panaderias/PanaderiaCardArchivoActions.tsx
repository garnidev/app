"use client";

import { useState } from "react";
import type { Panaderia } from "@/data/panaderias";

type Props = {
  panaderia: Panaderia;
  onEditar?: (panaderia: Panaderia) => void;
  onCambio?: () => void;
};

export function PanaderiaCardArchivoActions({
  panaderia,
  onEditar,
  onCambio,
}: Props) {
  const [accion, setAccion] = useState<"" | "restaurando" | "eliminando">("");

  const handleRestaurar = async () => {
    const mensaje =
      '¿Restaurar "' +
      panaderia.nombre +
      '"? Volverá a estado ACTIVA en el mapa público.';
    if (!confirm(mensaje)) return;

    setAccion("restaurando");
    try {
      const res = await fetch(`/api/panaderias/${panaderia.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "ACTIVA" }),
      });
      if (!res.ok) throw new Error("Error al restaurar");
      onCambio?.();
    } catch (error) {
      console.error("Error restaurando:", error);
      alert("No se pudo restaurar la panadería");
    } finally {
      setAccion("");
    }
  };

  const handleEliminar = async () => {
    const mensaje =
      '¿Eliminar "' +
      panaderia.nombre +
      '" PERMANENTEMENTE? Esta acción no se puede deshacer.';
    if (!confirm(mensaje)) return;

    setAccion("eliminando");
    try {
      const res = await fetch(`/api/panaderias/${panaderia.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar");
      onCambio?.();
    } catch (error) {
      console.error("Error eliminando:", error);
      alert("No se pudo eliminar la panadería");
    } finally {
      setAccion("");
    }
  };

  return (
    <div className="mt-auto flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onEditar?.(panaderia)}
        disabled={accion !== ""}
        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-brand-greenSoft px-3 py-2.5 text-sm font-bold text-brand-green transition hover:bg-brand-green hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
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
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        Editar
      </button>

      <button
        type="button"
        onClick={handleRestaurar}
        disabled={accion !== ""}
        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-brand-purple/40 bg-white px-3 py-2.5 text-sm font-bold text-brand-purpleDark transition hover:bg-brand-purple/5 disabled:cursor-not-allowed disabled:opacity-50"
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
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
        {accion === "restaurando" ? "Restaurando..." : "Restaurar"}
      </button>

      <button
        type="button"
        onClick={handleEliminar}
        disabled={accion !== ""}
        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-red-200 bg-white px-3 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
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
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6" />
        </svg>
        {accion === "eliminando" ? "Eliminando..." : "Eliminar"}
      </button>
    </div>
  );
}