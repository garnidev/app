"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { Panaderia } from "@/data/panaderias";
import type { Departamento } from "@/data/departamentos";
import type { Ciudad } from "@/data/ciudades";
import { obtenerPanaderiasArchivadas } from "@/data/panaderias";
import { PanaderiaCardArchivo } from "./PanaderiaCardArchivo";
import { PanaderiaDrawer } from "./PanaderiaDrawer";

type Props = {
  departamentos: Departamento[];
  ciudades: Ciudad[];
};

export function PanaderiasArchivoClient({ departamentos, ciudades }: Props) {
  const [panaderias, setPanaderias] = useState<Panaderia[]>([]);
  const [cargando, setCargando] = useState(true);

  const [drawerAbierto, setDrawerAbierto] = useState(false);
  const [panaderiaEditando, setPanaderiaEditando] = useState<Panaderia | null>(
    null,
  );

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const resultados = await obtenerPanaderiasArchivadas();
      setPanaderias(resultados);
    } catch (error) {
      console.error("Error cargando archivadas:", error);
      setPanaderias([]);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const handleAbrirEditar = (panaderia: Panaderia) => {
    setPanaderiaEditando(panaderia);
    setDrawerAbierto(true);
  };

  const handleCerrarDrawer = () => {
    setDrawerAbierto(false);
    setPanaderiaEditando(null);
  };

  return (
    <>
      <div className="mt-6">
        <Link
          href="/admin/panaderias"
          className="inline-flex items-center gap-2 rounded-full border border-brand-purple/40 bg-white px-4 py-2 text-sm font-semibold text-brand-purpleDark transition hover:bg-brand-purple/5"
        >
          Volver al listado
        </Link>
      </div>

      <div className="mt-6">
        {cargando ? (
          <LoadingState />
        ) : panaderias.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {panaderias.map((p) => (
              <PanaderiaCardArchivo
                key={p.id}
                panaderia={p}
                onEditar={handleAbrirEditar}
                onCambio={cargar}
              />
            ))}
          </div>
        )}
      </div>

      {/* Drawer de edición */}
      <PanaderiaDrawer
        abierto={drawerAbierto}
        onClose={handleCerrarDrawer}
        onGuardar={cargar}
        departamentos={departamentos}
        ciudades={ciudades}
        panaderiaInicial={panaderiaEditando}
      />
    </>
  );
}

function LoadingState() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl bg-white ring-1 ring-neutral-200"
        >
          <div className="aspect-[16/9] w-full animate-pulse bg-neutral-200" />
          <div className="space-y-3 p-5">
            <div className="h-5 w-3/4 animate-pulse rounded bg-neutral-200" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-200" />
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
          <rect x="3" y="4" width="18" height="4" rx="1" />
          <path d="M5 8v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" />
          <path d="M10 12h4" />
        </svg>
      </div>
      <h2 className="mt-4 text-lg font-bold text-neutral-900">
        No hay panaderías archivadas
      </h2>
      <p className="mt-2 text-sm text-neutral-600">
        Las panaderías que archives aparecerán aquí.
      </p>
    </div>
  );
}