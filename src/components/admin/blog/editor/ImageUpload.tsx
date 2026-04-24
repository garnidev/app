"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type Props = {
  /** URL de imagen inicial (para modo edición) */
  imagenInicial?: string;
  /** Callback cuando se selecciona/quita una imagen */
  onChange?: (dataUrl: string | null, archivo: File | null) => void;
};

const FORMATOS_ACEPTADOS = ["image/jpeg", "image/png", "image/webp"];
const TAMAÑO_MAX_MB = 333;
const TAMAÑO_MAX_BYTES = TAMAÑO_MAX_MB * 1024 * 1024;

/**
 * Zona de subida de imagen destacada
 * - Drag & drop de archivos
 * - Click para abrir selector nativo
 * - Preview de la imagen seleccionada
 * - Botón para quitar/reemplazar
 * - Validación de formato y tamaño
 *
 * Por ahora la imagen se muestra como preview con data URL.
 * Cuando haya backend, el onChange recibe también el File para enviarlo al server.
 */
export function ImageUpload({ imagenInicial, onChange }: Props) {
  const [preview, setPreview] = useState<string | null>(imagenInicial ?? null);
  const [dragActivo, setDragActivo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const procesarArchivo = (archivo: File) => {
    setError(null);

    // Validar formato
    if (!FORMATOS_ACEPTADOS.includes(archivo.type)) {
      setError("Formato no válido. Usa JPEG, PNG o WEBP.");
      return;
    }

    // Validar tamaño
    if (archivo.size > TAMAÑO_MAX_BYTES) {
      setError(`La imagen supera el tamaño máximo de ${TAMAÑO_MAX_MB} MB.`);
      return;
    }

    // Generar preview con data URL
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      setPreview(dataUrl);
      onChange?.(dataUrl, archivo);
    };
    reader.readAsDataURL(archivo);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (archivo) procesarArchivo(archivo);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActivo(false);
    const archivo = e.dataTransfer.files?.[0];
    if (archivo) procesarArchivo(archivo);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActivo(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActivo(false);
  };

  const quitarImagen = () => {
    setPreview(null);
    setError(null);
    onChange?.(null, null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const abrirSelector = () => {
    inputRef.current?.click();
  };

  /* ─── Vista con preview (cuando hay imagen seleccionada) ────────── */
  if (preview) {
    return (
      <div className="space-y-3">
        <div className="group relative overflow-hidden rounded-2xl border-2 border-neutral-200 bg-neutral-50">
          <div className="relative aspect-video w-full">
            <Image
              src={preview}
              alt="Vista previa de la imagen destacada"
              fill
              sizes="400px"
              className="object-cover"
              unoptimized // data URL no necesita optimización
            />
          </div>

          {/* Overlay de acciones (aparece en hover) */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={abrirSelector}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-neutral-800 shadow-md transition hover:bg-neutral-100"
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
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Reemplazar
            </button>
            <button
              type="button"
              onClick={quitarImagen}
              className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white shadow-md transition hover:bg-red-700"
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
              </svg>
              Quitar
            </button>
          </div>
        </div>

        {/* Input oculto reutilizable */}
        <input
          ref={inputRef}
          type="file"
          accept={FORMATOS_ACEPTADOS.join(",")}
          onChange={handleInputChange}
          className="hidden"
          aria-label="Seleccionar imagen"
        />
      </div>
    );
  }

  /* ─── Vista vacía (dropzone) ────────────────────────────────────── */
  return (
    <div className="space-y-2">
      <div
        onClick={abrirSelector}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        role="button"
        tabIndex={0}
        aria-label="Subir imagen destacada"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            abrirSelector();
          }
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition ${
          dragActivo
            ? "border-brand-green bg-brand-greenSoft"
            : "border-neutral-300 bg-neutral-50 hover:border-brand-green hover:bg-brand-greenSoft/30"
        }`}
      >
        {/* Ícono */}
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-sm">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-7 w-7 text-brand-green"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>

        {/* Texto principal */}
        <p className="mt-4 text-sm font-bold text-neutral-800 md:text-base">
          Arrastra una imagen ó haz clic para seleccionar
        </p>

        {/* Texto auxiliar */}
        <p className="mt-1 text-xs text-neutral-500">
          Archivos en formato JPEG, PNG, WEBP
        </p>
        <p className="text-xs text-neutral-500">menor a {TAMAÑO_MAX_MB} MB</p>

        {/* Botón explícito */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            abrirSelector();
          }}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-green px-5 py-2.5 text-sm font-bold text-white shadow-soft transition hover:bg-brand-greenDark"
        >
          Subir imagen
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
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>

        {/* Input oculto */}
        <input
          ref={inputRef}
          type="file"
          accept={FORMATOS_ACEPTADOS.join(",")}
          onChange={handleInputChange}
          className="hidden"
          aria-label="Seleccionar imagen"
        />
      </div>

      {/* Mensaje de error */}
      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700"
        >
          {error}
        </p>
      )}
    </div>
  );
}