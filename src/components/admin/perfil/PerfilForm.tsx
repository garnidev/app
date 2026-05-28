"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  usuarioInicial: {
    id: string;
    nombre: string | null;
    email: string;
    imagen: string | null;
    rol: string;
  };
};

export function PerfilForm({ usuarioInicial }: Props) {
  const [nombre, setNombre] = useState(usuarioInicial.nombre || "");
  const [imagenUrl, setImagenUrl] = useState(usuarioInicial.imagen || "");
  const [imagenArchivo, setImagenArchivo] = useState<File | null>(null);
  const [imagenDataUrl, setImagenDataUrl] = useState<string | null>(null);
  const [arrastrando, setArrastrando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

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

  /* ─── Subir avatar al backend ─────────────────────────────────── */
  const subirAvatar = async (archivo: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", archivo);

    const res = await fetch("/api/upload/avatares", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Error al subir el avatar");
    }

    const data = await res.json();
    return data.url;
  };

  /* ─── Guardar ─────────────────────────────────────────────────── */
  const handleGuardar = async () => {
    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    setError(null);
    setExito(false);
    setEnviando(true);

    try {
      // Subir nueva imagen si existe
      let imagenFinal = imagenUrl;
      if (imagenArchivo) {
        imagenFinal = await subirAvatar(imagenArchivo);
      }

      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(),
          imagen: imagenFinal,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar");

      setImagenUrl(imagenFinal);
      setImagenArchivo(null);
      setImagenDataUrl(null);
      setExito(true);

      // Refrescar la página después de 1.5s para actualizar el avatar del sidebar
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      const mensaje =
        err instanceof Error ? err.message : "Error desconocido";
      setError(mensaje);
    } finally {
      setEnviando(false);
    }
  };

  const previewImagen = imagenDataUrl || imagenUrl;

  return (
    <div className="rounded-3xl bg-white p-6 ring-1 ring-neutral-200 md:p-8">
      <h2 className="text-lg font-bold text-neutral-900">Información personal</h2>
      <p className="mt-1 text-sm text-neutral-600">
        Actualiza tu nombre y avatar.
      </p>

      <div className="mt-6 space-y-5">
        {/* Mensajes */}
        {error && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}
        {exito && (
          <div
            role="status"
            className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            ✓ Datos actualizados. Recargando...
          </div>
        )}

        {/* Email (readonly) */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-neutral-700">
            Email
          </label>
          <input
            type="text"
            value={usuarioInicial.email}
            disabled
            className="w-full cursor-not-allowed rounded-full border border-neutral-200 bg-neutral-50 px-5 py-2.5 text-sm text-neutral-500"
          />
        </div>

        {/* Nombre */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-neutral-700">
            Nombre
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre"
            className="w-full rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
          />
        </div>

        {/* Avatar */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-neutral-700">
            Avatar
          </label>
          <label
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex cursor-pointer items-center gap-5 rounded-2xl border-2 border-dashed p-5 transition ${
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

            {/* Preview */}
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-neutral-100 ring-2 ring-white">
              {previewImagen ? (
                <Image
                  src={previewImagen}
                  alt="Avatar"
                  fill
                  sizes="80px"
                  className="object-cover"
                  unoptimized={previewImagen.startsWith("data:")}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-brand-greenSoft text-brand-greenDark">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-8 w-8"
                    aria-hidden="true"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-neutral-800">
                {previewImagen ? "Cambiar avatar" : "Subir avatar"}
              </p>
              <p className="mt-0.5 text-xs text-neutral-500">
                JPEG, PNG o WEBP. Máximo 1 MB.
              </p>
            </div>
          </label>
        </div>

        {/* Botón guardar */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleGuardar}
            disabled={enviando}
            className="inline-flex items-center gap-2 rounded-full bg-brand-green px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-greenDark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {enviando ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}