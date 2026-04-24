"use client";

import { useState } from "react";

type Props = {
  /** Tags actuales */
  tags: string[];
  /** Callback cuando cambia la lista */
  onChange: (tags: string[]) => void;
};

/**
 * Input de etiquetas con chips removibles.
 * - Escribe una etiqueta y presiona Enter o el botón "Agregar"
 * - Cada etiqueta se añade como chip con X para eliminarla
 * - Evita duplicados automáticamente
 * - Valida longitud mínima (1 char)
 */
export function TagsInput({ tags, onChange }: Props) {
  const [valor, setValor] = useState("");

  const agregar = () => {
    const limpia = valor.trim();
    if (!limpia) return;

    // Evitar duplicados (case-insensitive)
    const yaExiste = tags.some(
      (t) => t.toLowerCase() === limpia.toLowerCase()
    );
    if (yaExiste) {
      setValor("");
      return;
    }

    onChange([...tags, limpia]);
    setValor("");
  };

  const quitar = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Enter agrega la etiqueta
    if (e.key === "Enter") {
      e.preventDefault();
      agregar();
    }
    // Backspace en input vacío quita la última etiqueta
    if (e.key === "Backspace" && valor === "" && tags.length > 0) {
      quitar(tags[tags.length - 1]);
    }
  };

  return (
    <div>
      <label
        htmlFor="tag-input"
        className="mb-2 block text-sm font-medium text-neutral-700"
      >
        Agregar etiqueta
      </label>

      {/* Input + botón Agregar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
            aria-hidden="true"
          >
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
          <input
            id="tag-input"
            type="text"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe una etiqueta..."
            className="w-full rounded-full border border-neutral-200 bg-white py-2.5 pl-11 pr-5 text-sm text-neutral-800 transition placeholder:text-neutral-400 focus:border-brand-green focus:outline-none focus:ring-4 focus:ring-brand-green/15"
          />
        </div>

        <button
          type="button"
          onClick={agregar}
          disabled={!valor.trim()}
          className="inline-flex items-center gap-2 rounded-full bg-brand-green px-5 py-2.5 text-sm font-bold text-white shadow-soft transition hover:bg-brand-greenDark disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-brand-green"
        >
          Agregar
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
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      {/* Texto de ayuda */}
      <p className="mt-2 text-xs text-neutral-500">
        Presiona Enter o clic en Agregar. Puedes añadir tantas como necesites.
      </p>

      {/* Lista de chips */}
      {tags.length > 0 && (
        <ul
          className="mt-4 flex flex-wrap gap-2"
          aria-label="Etiquetas agregadas"
        >
          {tags.map((tag) => (
            <li key={tag}>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-purple/10 py-1.5 pl-3 pr-1.5 text-xs font-semibold text-brand-purpleDark">
                {tag}
                <button
                  type="button"
                  onClick={() => quitar(tag)}
                  aria-label={`Quitar etiqueta ${tag}`}
                  className="flex h-5 w-5 items-center justify-center rounded-full text-brand-purpleDark transition hover:bg-brand-purple/20"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3"
                    aria-hidden="true"
                  >
                    <path d="M6 6l12 12M6 18L18 6" />
                  </svg>
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}