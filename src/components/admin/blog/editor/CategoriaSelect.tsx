"use client";

import { useState } from "react";
import type { Categoria } from "@/data/posts";

type Props = {
  value: Categoria | "";
  onChange: (value: Categoria) => void;
};

const OPCIONES: { valor: Categoria; label: string; color: string }[] = [
  { valor: "TERRITORIO", label: "Territorio", color: "bg-amber-500" },
  { valor: "INGREDIENTES", label: "Ingredientes", color: "bg-brand-green" },
  { valor: "OFICIOS", label: "Oficios", color: "bg-brand-purple" },
  { valor: "HISTORIA", label: "Historia", color: "bg-blue-500" },
];

/**
 * Dropdown de categoría del artículo.
 * Cada categoría tiene un punto de color para identificarla visualmente.
 * Única selección (no múltiple).
 */
export function CategoriaSelect({ value, onChange }: Props) {
  const [abierto, setAbierto] = useState(false);

  const seleccionada = OPCIONES.find((op) => op.valor === value);

  return (
    <div className="relative">
      <label
        htmlFor="categoria-button"
        className="mb-2 block text-sm font-semibold text-neutral-800"
      >
        Categoría
      </label>

      <button
        id="categoria-button"
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={abierto}
        className="flex w-full items-center justify-between rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm text-neutral-800 shadow-sm transition focus:border-brand-green focus:outline-none focus:ring-4 focus:ring-brand-green/15"
      >
        <span className="flex items-center gap-2.5">
          {seleccionada ? (
            <>
              <span
                className={`h-2 w-2 rounded-full ${seleccionada.color}`}
                aria-hidden="true"
              />
              <span className="font-medium">{seleccionada.label}</span>
            </>
          ) : (
            <span className="text-neutral-400">Selecciona una categoría</span>
          )}
        </span>

        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-4 w-4 text-neutral-500 transition-transform ${
            abierto ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {abierto && (
        <>
          {/* Backdrop para cerrar al click fuera */}
          <button
            type="button"
            aria-label="Cerrar dropdown"
            onClick={() => setAbierto(false)}
            className="fixed inset-0 z-10 cursor-default"
          />

          <ul
            role="listbox"
            aria-label="Opciones de categoría"
            className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl bg-white py-1 shadow-xl ring-1 ring-neutral-200"
          >
            {OPCIONES.map((op) => {
              const activo = op.valor === value;
              return (
                <li key={op.valor} role="option" aria-selected={activo}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(op.valor);
                      setAbierto(false);
                    }}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium transition ${
                      activo
                        ? "bg-brand-greenSoft text-brand-green"
                        : "text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className={`h-2 w-2 rounded-full ${op.color}`}
                        aria-hidden="true"
                      />
                      {op.label}
                    </span>
                    {activo && (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                        aria-hidden="true"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}