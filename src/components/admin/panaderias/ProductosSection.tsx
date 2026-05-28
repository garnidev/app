"use client";

import { useState } from "react";
import Image from "next/image";
import type { Producto } from "@/data/panaderias";

type Props = {
  panaderiaId: string;
  productos: Producto[];
  onRecargar: () => void;
};

export function ProductosSection({
  panaderiaId,
  productos,
  onRecargar,
}: Props) {
  const [expandidoId, setExpandidoId] = useState<string | null>(null);
  const [agregandoNuevo, setAgregandoNuevo] = useState(false);

  /* ─── Crear producto vacío para el form de agregar ──────────────── */
  const productoVacio: Producto = {
    id: "nuevo",
    nombre: "",
    precio: 0,
    imagen: "",
  };

  /* ─── Eliminar producto ─────────────────────────────────────────── */
  const handleEliminar = async (productoId: string, nombre: string) => {
    if (!confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/productos/${productoId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar");
      onRecargar();
    } catch (error) {
      console.error("Error eliminando producto:", error);
      alert("No se pudo eliminar el producto");
    }
  };

  return (
    <div className="mt-6">
      {/* Header con botón agregar */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-500">
          Productos
        </h3>
        {!agregandoNuevo && (
          <button
            type="button"
            onClick={() => {
              setAgregandoNuevo(true);
              setExpandidoId(null);
            }}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-greenSoft px-3 py-1.5 text-xs font-bold text-brand-greenDark transition hover:bg-brand-green hover:text-white"
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
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Agregar
          </button>
        )}
      </div>

      {/* Form de nuevo producto */}
      {agregandoNuevo && (
        <ProductoForm
          panaderiaId={panaderiaId}
          producto={productoVacio}
          esNuevo
          onCancelar={() => setAgregandoNuevo(false)}
          onGuardado={() => {
            setAgregandoNuevo(false);
            onRecargar();
          }}
        />
      )}

      {/* Lista de productos */}
      {productos.length === 0 && !agregandoNuevo ? (
        <p className="rounded-2xl bg-neutral-50 px-4 py-6 text-center text-sm text-neutral-500">
          Esta panadería aún no tiene productos.
        </p>
      ) : (
        <div className="space-y-2">
          {productos.map((p) => (
            <ProductoCard
              key={p.id}
              panaderiaId={panaderiaId}
              producto={p}
              expandido={expandidoId === p.id}
              onToggle={() =>
                setExpandidoId(expandidoId === p.id ? null : p.id)
              }
              onEliminar={() => handleEliminar(p.id, p.nombre)}
              onGuardado={() => {
                setExpandidoId(null);
                onRecargar();
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   CARD DE PRODUCTO (colapsable)
   ═══════════════════════════════════════════════════════════════════════ */

function ProductoCard({
  panaderiaId,
  producto,
  expandido,
  onToggle,
  onEliminar,
  onGuardado,
}: {
  panaderiaId: string;
  producto: Producto;
  expandido: boolean;
  onToggle: () => void;
  onEliminar: () => void;
  onGuardado: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      {/* Header colapsable */}
      <div className="flex items-center gap-3 p-3">
        {/* Miniatura */}
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
          {producto.imagen ? (
            <Image
              src={producto.imagen}
              alt={producto.nombre}
              fill
              sizes="48px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-neutral-300">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}
        </div>

        {/* Info clickeable */}
        <button
          type="button"
          onClick={onToggle}
          className="min-w-0 flex-1 text-left"
        >
          <p className="truncate text-sm font-bold text-neutral-900">
            {producto.nombre}
          </p>
          <p className="text-xs text-neutral-500">
            ${producto.precio.toLocaleString("es-CO")}
          </p>
        </button>

        {/* Botones de acción */}
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={onToggle}
            aria-label={expandido ? "Colapsar" : "Expandir para editar"}
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition hover:bg-neutral-100"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`h-4 w-4 transition-transform ${expandido ? "rotate-180" : ""}`}
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onEliminar}
            aria-label="Eliminar producto"
            className="flex h-8 w-8 items-center justify-center rounded-full text-red-500 transition hover:bg-red-50"
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
          </button>
        </div>
      </div>

      {/* Form expandido */}
      {expandido && (
        <div className="border-t border-neutral-100 p-3">
          <ProductoForm
            panaderiaId={panaderiaId}
            producto={producto}
            onCancelar={onToggle}
            onGuardado={onGuardado}
          />
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   FORMULARIO DE PRODUCTO (crear o editar)
   ═══════════════════════════════════════════════════════════════════════ */

function ProductoForm({
  panaderiaId,
  producto,
  esNuevo = false,
  onCancelar,
  onGuardado,
}: {
  panaderiaId: string;
  producto: Producto;
  esNuevo?: boolean;
  onCancelar: () => void;
  onGuardado: () => void;
}) {
  const [nombre, setNombre] = useState(producto.nombre);
  const [precio, setPrecio] = useState(producto.precio.toString());
  const [imagenUrl, setImagenUrl] = useState(producto.imagen);
  const [imagenArchivo, setImagenArchivo] = useState<File | null>(null);
  const [imagenDataUrl, setImagenDataUrl] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ─── Manejo de archivo de imagen ───────────────────────────────── */
  const handleArchivoSeleccionado = (archivo: File) => {
    setImagenArchivo(archivo);
    const reader = new FileReader();
    reader.onload = (e) => setImagenDataUrl((e.target?.result as string) || null);
    reader.readAsDataURL(archivo);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (archivo) handleArchivoSeleccionado(archivo);
  };

  /* ─── Subir imagen al backend ───────────────────────────────────── */
  const subirImagen = async (archivo: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", archivo);

    const res = await fetch("/api/upload/productos", {
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

  /* ─── Guardar producto ──────────────────────────────────────────── */
  const handleGuardar = async () => {
    // Validaciones
    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    const precioNum = parseInt(precio.replace(/\D/g, ""), 10);
    if (isNaN(precioNum) || precioNum < 0) {
      setError("El precio debe ser un número entero válido");
      return;
    }

    if (!imagenUrl && !imagenArchivo) {
      setError("La imagen es obligatoria");
      return;
    }

    setError(null);
    setEnviando(true);

    try {
      // 1. Subir imagen si es nueva
      let urlFinal = imagenUrl;
      if (imagenArchivo) {
        urlFinal = await subirImagen(imagenArchivo);
      }

      // 2. Construir payload
      const payload = {
        nombre: nombre.trim(),
        precio: precioNum,
        imagen: urlFinal,
      };

      // 3. POST si es nuevo, PUT si es edición
      const url = esNuevo
        ? `/api/panaderias/${panaderiaId}/productos`
        : `/api/productos/${producto.id}`;
      const method = esNuevo ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al guardar");
      }

      onGuardado();
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
    <div className="space-y-3">
      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}

      {/* Imagen del producto */}
      <div>
        <label className="block cursor-pointer">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileInput}
            className="hidden"
          />
          {previewImagen ? (
            <div className="relative h-32 w-full overflow-hidden rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 transition hover:border-brand-green">
              <Image
                src={previewImagen}
                alt="Vista previa"
                fill
                className="object-cover"
                unoptimized={previewImagen.startsWith("data:")}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/30">
                <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-neutral-800 opacity-0 transition hover:opacity-100">
                  Cambiar imagen
                </span>
              </div>
            </div>
          ) : (
            <div className="flex h-24 w-full items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 transition hover:border-brand-green">
              <span className="text-xs font-semibold text-neutral-500">
                Seleccionar imagen
              </span>
            </div>
          )}
        </label>
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
          placeholder="Ej: Pan masa madre"
          className="w-full rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
        />
      </div>

      {/* Precio */}
      <div>
        <label className="mb-1 block text-xs font-semibold text-neutral-700">
          Precio (COP)
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-500">
            $
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={precio}
            onChange={(e) => {
              // Solo permitir números
              const valor = e.target.value.replace(/\D/g, "");
              setPrecio(valor);
            }}
            placeholder="10800"
            className="w-full rounded-full border border-neutral-200 bg-white py-2 pl-8 pr-4 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onCancelar}
          disabled={enviando}
          className="flex-1 rounded-full border border-neutral-200 bg-white px-3 py-2 text-xs font-bold text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleGuardar}
          disabled={enviando}
          className="flex-1 rounded-full bg-brand-green px-3 py-2 text-xs font-bold text-white transition hover:bg-brand-greenDark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {enviando ? "Guardando..." : esNuevo ? "Agregar" : "Guardar"}
        </button>
      </div>
    </div>
  );
}