"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import type { Panaderia, Producto } from "@/data/panaderias";
import type { Departamento } from "@/data/departamentos";
import type { Ciudad } from "@/data/ciudades";
import {
  extraerCoordsDeGoogleMaps,
  esUrlCorta,
} from "@/lib/parseGoogleMaps";
import { ProductosSection } from "./ProductosSection";

type Props = {
  abierto: boolean;
  onClose: () => void;
  onGuardar: () => void;
  departamentos: Departamento[];
  ciudades: Ciudad[];
  panaderiaInicial?: Panaderia | null;
};

type FormData = {
  nombre: string;
  descripcionCorta: string;
  telefono: string;
  direccion: string;
  departamentoSlug: string;
  ciudadSlug: string;
  urlGoogleMaps: string;
  coordsLat: number | null;
  coordsLng: number | null;
  imagen: { dataUrl: string | null; archivo: File | null };
};

export function PanaderiaDrawer({
  abierto,
  onClose,
  onGuardar,
  departamentos,
  ciudades,
  panaderiaInicial,
}: Props) {
  const esEdicion = Boolean(panaderiaInicial);

  /* ─── Estados ───────────────────────────────────────────────────── */
  const [form, setForm] = useState<FormData>({
    nombre: "",
    descripcionCorta: "",
    telefono: "",
    direccion: "",
    departamentoSlug: "",
    ciudadSlug: "",
    urlGoogleMaps: "",
    coordsLat: null,
    coordsLng: null,
    imagen: { dataUrl: null, archivo: null },
  });

  const [enviando, setEnviando] = useState(false);
  const [errores, setErrores] = useState<string[]>([]);
  const [arrastrando, setArrastrando] = useState(false);
  const [productos, setProductos] = useState<Producto[]>(
    panaderiaInicial?.productos || [],
  );

  /* ─── Cargar datos iniciales si es edición ──────────────────────── */
  useEffect(() => {
    if (!abierto) return;

    if (panaderiaInicial) {
      const deptoSlug =
        departamentos.find((d) => d.nombre === panaderiaInicial.departamento)
          ?.slug || "";
      const ciudadSlug =
        ciudades.find((c) => c.nombre === panaderiaInicial.ciudad)?.slug || "";

      setForm({
        nombre: panaderiaInicial.nombre,
        descripcionCorta: panaderiaInicial.descripcionCorta,
        telefono: panaderiaInicial.telefono,
        direccion: panaderiaInicial.direccion,
        departamentoSlug: deptoSlug,
        ciudadSlug: ciudadSlug,
        urlGoogleMaps: panaderiaInicial.urlGoogleMaps,
        coordsLat: panaderiaInicial.coords[1],
        coordsLng: panaderiaInicial.coords[0],
        imagen: {
          dataUrl: panaderiaInicial.imagen,
          archivo: null,
        },
      });
      setProductos(panaderiaInicial.productos || []);
    } else {
      setForm({
        nombre: "",
        descripcionCorta: "",
        telefono: "",
        direccion: "",
        departamentoSlug: "",
        ciudadSlug: "",
        urlGoogleMaps: "",
        coordsLat: null,
        coordsLng: null,
        imagen: { dataUrl: null, archivo: null },
      });
      setProductos([]);
    }
    setErrores([]);
  }, [abierto, panaderiaInicial, departamentos, ciudades]);

  /* ─── Bloquear scroll del body cuando el drawer está abierto ───── */
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

  /* ─── Ciudades filtradas por departamento ──────────────────────── */
  const ciudadesFiltradas = useMemo(() => {
    if (!form.departamentoSlug) return [];
    const depto = departamentos.find((d) => d.slug === form.departamentoSlug);
    if (!depto) return [];
    return ciudades.filter((c) => c.departamento === depto.nombre);
  }, [form.departamentoSlug, ciudades, departamentos]);

  /* ─── Helpers de actualización ─────────────────────────────────── */
  const actualizar = <K extends keyof FormData>(
    campo: K,
    valor: FormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  /* ─── Recargar productos desde el backend ───────────────────────── */
  const recargarProductos = async () => {
    if (!panaderiaInicial) return;
    try {
      const res = await fetch(`/api/panaderias/${panaderiaInicial.id}`);
      if (!res.ok) return;
      const data = await res.json();
      setProductos(data.productos || []);
    } catch (error) {
      console.error("Error recargando productos:", error);
    }
  };

  /* ─── Extraer coords del enlace de Google Maps ──────────────────── */
  const handleBuscarEnMaps = () => {
    if (!form.urlGoogleMaps.trim()) {
      setErrores(["Pega primero un enlace de Google Maps"]);
      return;
    }

    if (esUrlCorta(form.urlGoogleMaps)) {
      setErrores([
        "Este enlace es una URL corta. Ábrelo en Google Maps, copia la URL completa del navegador y pégala aquí.",
      ]);
      window.open(form.urlGoogleMaps, "_blank");
      return;
    }

    const coords = extraerCoordsDeGoogleMaps(form.urlGoogleMaps);
    if (!coords) {
      setErrores([
        "No se pudieron extraer las coordenadas. Verifica que el enlace sea válido.",
      ]);
      return;
    }

    setErrores([]);
    actualizar("coordsLat", coords.lat);
    actualizar("coordsLng", coords.lng);
  };

  /* ─── Upload de imagen ──────────────────────────────────────────── */
  const handleArchivoSeleccionado = (archivo: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      actualizar("imagen", {
        dataUrl: (e.target?.result as string) || null,
        archivo,
      });
    };
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

  /* ─── Subir imagen al backend ───────────────────────────────────── */
  const subirImagen = async (archivo: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", archivo);

    const res = await fetch("/api/upload/panaderias", {
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

  /* ─── Validación ────────────────────────────────────────────────── */
  const validar = (): string[] => {
    const errs: string[] = [];

    if (!form.nombre.trim()) errs.push("El nombre es obligatorio.");
    if (!form.descripcionCorta.trim())
      errs.push("La descripción corta es obligatoria.");
    if (!form.telefono.trim()) errs.push("El teléfono es obligatorio.");
    if (!form.direccion.trim()) errs.push("La dirección es obligatoria.");
    if (!form.departamentoSlug) errs.push("Selecciona un departamento.");
    if (!form.ciudadSlug) errs.push("Selecciona un municipio.");
    if (!form.urlGoogleMaps.trim())
      errs.push("El enlace de Google Maps es obligatorio.");
    if (form.coordsLat === null || form.coordsLng === null)
      errs.push(
        "Debes hacer clic en 'Buscar en Maps' para detectar las coordenadas.",
      );
    if (!form.imagen.dataUrl) errs.push("La imagen es obligatoria.");

    return errs;
  };

  /* ─── Guardar ───────────────────────────────────────────────────── */
  const handleGuardar = async () => {
    const errs = validar();
    if (errs.length > 0) {
      setErrores(errs);
      return;
    }

    setErrores([]);
    setEnviando(true);

    try {
      let imagenUrl = form.imagen.dataUrl || "";
      if (form.imagen.archivo) {
        imagenUrl = await subirImagen(form.imagen.archivo);
      }

      const depto = departamentos.find(
        (d) => d.slug === form.departamentoSlug,
      );
      const ciudad = ciudades.find((c) => c.slug === form.ciudadSlug);

      if (!depto || !ciudad) {
        throw new Error("Departamento o ciudad inválidos");
      }

      const payload = {
        nombre: form.nombre.trim(),
        descripcionCorta: form.descripcionCorta.trim(),
        telefono: form.telefono.trim(),
        direccion: form.direccion.trim(),
        departamentoSlug: form.departamentoSlug,
        ciudadSlug: form.ciudadSlug,
        urlGoogleMaps: form.urlGoogleMaps.trim(),
        coords: [form.coordsLng, form.coordsLat] as [number, number],
        imagen: imagenUrl,
        horario: "Lunes a sábado, 7:00 AM - 8:00 PM",
      };

      const url = esEdicion
        ? `/api/panaderias/${panaderiaInicial!.id}`
        : "/api/panaderias";
      const method = esEdicion ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al guardar la panadería");
      }

      onGuardar();
      onClose();
    } catch (err) {
      const mensaje =
        err instanceof Error ? err.message : "Error desconocido";
      setErrores([mensaje]);
    } finally {
      setEnviando(false);
    }
  };

  if (!abierto) return null;

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
        aria-labelledby="drawer-title"
        aria-modal="true"
        className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-6 py-5">
          <h2
            id="drawer-title"
            className="text-lg font-bold italic text-support-navy"
          >
            {esEdicion ? "Editar panadería" : "Agregar panadería"}
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

        {/* Body scrolleable */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Errores */}
          {errores.length > 0 && (
            <div
              role="alert"
              className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4"
            >
              <ul className="list-disc pl-5 text-sm text-red-700">
                {errores.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* ═══ SECCIÓN 1: Información básica ═══ */}
          <SectionTitle>Información básica</SectionTitle>

          <InputConIcono
            value={form.nombre}
            onChange={(v) => actualizar("nombre", v)}
            placeholder="Nombre de la panadería"
            icon={
              <>
                <circle cx="12" cy="7" r="4" />
                <path d="M5.5 22a9 9 0 0 1 13 0" />
              </>
            }
          />

          <textarea
            value={form.descripcionCorta}
            onChange={(e) => actualizar("descripcionCorta", e.target.value)}
            placeholder="Descripción corta"
            rows={3}
            className="mt-3 w-full rounded-2xl border border-neutral-200 px-5 py-3 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
          />

          {/* ═══ SECCIÓN 2: Información de contacto ═══ */}
          <div className="mt-6">
            <SectionTitle>Información de contacto</SectionTitle>

            <InputConIcono
              value={form.telefono}
              onChange={(v) => actualizar("telefono", v)}
              placeholder="Teléfono"
              icon={
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              }
            />

            <div className="mt-3">
              <InputConIcono
                value={form.direccion}
                onChange={(v) => actualizar("direccion", v)}
                placeholder="Dirección"
                icon={
                  <>
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </>
                }
              />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <SelectConIcono
                value={form.departamentoSlug}
                onChange={(v) => {
                  actualizar("departamentoSlug", v);
                  actualizar("ciudadSlug", "");
                }}
                placeholder="Departamento"
                opciones={departamentos.map((d) => ({
                  valor: d.slug,
                  label: d.nombre,
                }))}
              />
              <SelectConIcono
                value={form.ciudadSlug}
                onChange={(v) => actualizar("ciudadSlug", v)}
                placeholder="Municipio"
                opciones={ciudadesFiltradas.map((c) => ({
                  valor: c.slug,
                  label: c.nombre,
                }))}
                disabled={!form.departamentoSlug}
              />
            </div>
          </div>

          {/* ═══ UBICACIÓN EN MAPA ═══ */}
          <div className="mt-6">
            <SectionTitle>Ubicación en mapa</SectionTitle>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
                  aria-hidden="true"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <input
                  type="text"
                  value={form.urlGoogleMaps}
                  onChange={(e) => actualizar("urlGoogleMaps", e.target.value)}
                  placeholder="Pega aquí el enlace de Google Maps"
                  className="w-full rounded-full border border-neutral-200 bg-white py-2.5 pl-11 pr-4 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                />
              </div>
              <button
                type="button"
                onClick={handleBuscarEnMaps}
                className="shrink-0 rounded-full bg-brand-greenSoft px-4 py-2 text-xs font-bold text-brand-greenDark transition hover:bg-brand-green hover:text-white"
              >
                Buscar en Maps
              </button>
            </div>

            <p className="mt-2 text-xs text-neutral-500">
              Abre Google Maps, busca la panadería, copia el enlace y pégalo aquí.
            </p>

            {form.coordsLat !== null && form.coordsLng !== null && (
              <div className="mt-3 rounded-2xl bg-brand-greenSoft px-4 py-3">
                <p className="text-xs font-semibold text-brand-greenDark">
                  ✓ Coordenadas detectadas
                </p>
                <p className="mt-1 font-mono text-xs text-brand-greenDark">
                  Lat: {form.coordsLat.toFixed(6)}, Lng:{" "}
                  {form.coordsLng.toFixed(6)}
                </p>
              </div>
            )}
          </div>

          {/* ═══ CARGAR IMAGEN ═══ */}
          <div className="mt-6">
            <SectionTitle>Cargar imagen</SectionTitle>

            <label
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition ${
                arrastrando
                  ? "border-brand-green bg-brand-greenSoft"
                  : form.imagen.dataUrl
                    ? "border-brand-green/30 bg-white"
                    : "border-neutral-300 bg-neutral-50 hover:border-brand-green/50"
              }`}
            >
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileInput}
                className="hidden"
              />

              {form.imagen.dataUrl ? (
                <>
                  <div className="relative h-32 w-full overflow-hidden rounded-xl">
                    <Image
                      src={form.imagen.dataUrl}
                      alt="Vista previa"
                      fill
                      className="object-cover"
                      unoptimized={form.imagen.dataUrl.startsWith("data:")}
                    />
                  </div>
                  <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-green px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-greenDark">
                    Cambiar imagen
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3"
                      aria-hidden="true"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
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
                    Archivos en formato JPEG, PNG, WEBP
                    <br />
                    menor a 2 MB
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-green px-4 py-2 text-xs font-bold text-white">
                    Subir imagen
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3"
                      aria-hidden="true"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </span>
                </>
              )}
            </label>
          </div>

          {/* ═══ SECCIÓN 4: Productos (solo en edición) ═══ */}
          {esEdicion && panaderiaInicial && (
            <ProductosSection
              panaderiaId={panaderiaInicial.id}
              productos={productos}
              onRecargar={recargarProductos}
            />
          )}
        </div>

        {/* Footer fijo */}
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
            {enviando ? "Guardando..." : esEdicion ? "Guardar" : "Agregar"}
            {!enviando && (
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
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   COMPONENTES INTERNOS
   ═══════════════════════════════════════════════════════════════════════ */

function SectionTitle({
  children,
  inline,
}: {
  children: React.ReactNode;
  inline?: boolean;
}) {
  return (
    <h3
      className={`text-xs font-bold uppercase tracking-[0.15em] text-neutral-500 ${
        inline ? "" : "mb-3"
      }`}
    >
      {children}
    </h3>
  );
}

function InputConIcono({
  value,
  onChange,
  placeholder,
  icon,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
        aria-hidden="true"
      >
        {icon}
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-neutral-200 bg-white py-2.5 pl-11 pr-4 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
      />
    </div>
  );
}

function SelectConIcono({
  value,
  onChange,
  placeholder,
  opciones,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  opciones: { valor: string; label: string }[];
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
        aria-hidden="true"
      >
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" y1="22" x2="4" y2="15" />
      </svg>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full cursor-pointer appearance-none rounded-full border border-neutral-200 bg-white py-2.5 pl-11 pr-9 text-sm text-neutral-800 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">{placeholder}</option>
        {opciones.map((opt) => (
          <option key={opt.valor} value={opt.valor}>
            {opt.label}
          </option>
        ))}
      </select>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}