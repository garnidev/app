"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { CiudadAdmin } from "@/data/ciudades";

type Props = {
  abierto: boolean;
  ciudad: CiudadAdmin | null;
  onClose: () => void;
  onGuardar: () => void;
};

export function CiudadDrawer({ abierto, ciudad, onClose, onGuardar }: Props) {
  const [nombre, setNombre] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [imagenArchivo, setImagenArchivo] = useState<File | null>(null);
  const [imagenDataUrl, setImagenDataUrl] = useState<string | null>(null);
  const [arrastrando, setArrastrando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ─── Cargar datos al abrir ───────────────────────────────────── */
  useEffect(() => {
    if (!abierto || !ciudad) return;
    setNombre(ciudad.nombre);
    setImagenUrl(ciudad.imagen);
    setImagenArchivo(null);
    setImagenDataUrl(null);
    setError(null);
  }, [abierto, ciudad]);

  /* ─── Bloquear scroll del body ──────────────────────────────── */
  useEffect(() => {
    if (abierto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [abierto]);

  /* ─── Manejo de archivo ───────────────────────────────────────── */
  const handleArchivoSeleccionado = (archivo: File) => {
    setImagenArchivo(archivo);
    const reader = new FileReader();
    reader.onload = (e) =>
      setImagenDataUrl((e.target?.result as string) || null);
    reader.readAsDataURL(archivo);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setArrastrando(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setArrastrando(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setArrastrando(false);
    const archivo = e.dataTransfer.files[0];
    if (archivo && archivo.type.startsWith("image/")) {
      handleArchivoSeleccionado(archivo);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (archivo) handleArchivoSeleccionado(archivo);
  };

  /* ─── Subir imagen ────────────────────────────────────────────── */
  const subirImagen = async (archivo: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", archivo);

    const res = await fetch("/api/upload/ciudades", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Error al subir la imagen");
    }

    const data = await res.json();
    return data.url;
  };

  /* ─── Guardar ────────────────────────────────────────────────── */
  const handleGuardar = async () => {
    if (!ciudad) return;

    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    setError(null);
    setEnviando(true);

    try {
      // 1. Subir imagen si es nueva
      let imagenFinal = imagenUrl;
      if (imagenArchivo) {
        imagenFinal = await subirImagen(imagenArchivo);
      }

      // 2. PUT a la ciudad
      const res = await fetch(`/api/ciudades/${ciudad.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(),
          imagen: imagenFinal,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar");

      onGuardar();
      onClose();
    } catch (err) {
      const mensaje =
        err instanceof Error ? err.message : "Error desconocido";
      setError(mensaje);
    } finally {
      setEnviando(false);
    }
  };

  if (!abierto || !ciudad) return null;

  const previewImagen = imagenDataUrl || imagenUrl;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-labelledby="ciudad-drawer-title"
        aria-modal="true"
        className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-6 py-5">
          <h2
            id="ciudad-drawer-title"
            className="text-lg font-bold italic text-support-navy"
          >
            Editar ciudad
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition hover:bg-neutral-100"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Departamento (readonly) */}
          <div className="mb-5 rounded-2xl bg-brand-greenSoft px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-greenDark">
              Departamento
            </p>
            <p className="mt-1 text-sm font-semibold text-brand-greenDark">
              {ciudad.departamento.nombre}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Información básica */}
          <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-neutral-500">
            Información
          </h3>

          {/* Nombre */}
          <div className="mb-3">
            <label className="mb-1 block text-xs font-semibold text-neutral-700">
              Nombre de la ciudad
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Pereira"
              className="w-full rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
            />
          </div>

          {/* Slug (preview readonly) */}
          <div className="mb-5 rounded-2xl bg-neutral-50 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-500">
              Slug (generado automáticamente)
            </p>
            <p className="mt-1 font-mono text-xs text-neutral-700">
              {nombre
                ? nombre
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/[ñ]/g, "n")
                    .replace(/[^a-z0-9\s-]/g, "")
                    .trim()
                    .replace(/\s+/g, "-")
                : ciudad.slug}
            </p>
          </div>

          {/* Imagen */}
          <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-neutral-500">
            Imagen de fondo
          </h3>

          <label
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition ${
              arrastrando
                ? "border-brand-green bg-brand-greenSoft"
                : "border-neutral-300 bg-neutral-50 hover:border-brand-green/50"
            }`}
          >
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileInput}
              className="hidden"
            />

            {previewImagen ? (
              <>
                <div className="relative h-40 w-full overflow-hidden rounded-xl">
                  <Image
                    src={previewImagen}
                    alt="Vista previa"
                    fill
                    className="object-cover"
                    unoptimized={previewImagen.startsWith("data:")}
                  />
                </div>
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-green px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-greenDark">
                  Cambiar imagen
                </span>
              </>
            ) : (
              <>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-10 w-10 text-brand-green"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <p className="mt-2 text-center text-sm font-bold text-neutral-800">
                  Arrastra una imagen ó haz clic para seleccionar
                </p>
                <p className="mt-1 text-center text-xs text-neutral-500">
                  JPEG, PNG o WEBP. Máximo 2 MB.
                </p>
              </>
            )}
          </label>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-neutral-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={enviando}
            className="rounded-full border border-neutral-200 bg-white px-6 py-2.5 text-sm font-bold text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleGuardar}
            disabled={enviando}
            className="inline-flex items-center gap-2 rounded-full bg-brand-green px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-greenDark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {enviando ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </>
  );
}