"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  slug: string;
};

export function PostActionsArchivo({ slug }: Props) {
  const router = useRouter();
  const [accion, setAccion] = useState<"" | "restaurando" | "eliminando">("");

  const handleRestaurar = async () => {
    if (!confirm("¿Restaurar este artículo? Volverá a estado de borrador.")) {
      return;
    }

    setAccion("restaurando");
    try {
      const res = await fetch(`/api/posts/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "BORRADOR" }),
      });

      if (!res.ok) throw new Error("Error al restaurar");
      router.refresh();
    } catch (error) {
      console.error("Error restaurando:", error);
      alert("No se pudo restaurar el artículo");
    } finally {
      setAccion("");
    }
  };

  const handleEliminar = async () => {
    if (
      !confirm(
        "¿Eliminar este artículo PERMANENTEMENTE? Esta acción no se puede deshacer.",
      )
    ) {
      return;
    }

    setAccion("eliminando");
    try {
      const res = await fetch(`/api/posts/${slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      router.refresh();
    } catch (error) {
      console.error("Error eliminando:", error);
      alert("No se pudo eliminar el artículo");
    } finally {
      setAccion("");
    }
  };

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2 md:flex-nowrap">
      <button
        type="button"
        onClick={handleRestaurar}
        disabled={accion !== ""}
        className="inline-flex items-center gap-2 rounded-full bg-brand-greenSoft px-4 py-2 text-sm font-bold text-brand-green transition hover:bg-brand-green hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
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
        className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
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
          <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
        </svg>
        {accion === "eliminando" ? "Eliminando..." : "Eliminar"}
      </button>
    </div>
  );
}