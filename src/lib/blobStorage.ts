/**
 * ═══════════════════════════════════════════════════════════════════════
 * HELPER — Almacenamiento de imágenes con Vercel Blob
 * ─────────────────────────────────────────────────────────────────────
 * Reemplaza el almacenamiento en /public (que no funciona en serverless)
 * por Vercel Blob, compatible con producción.
 * ═══════════════════════════════════════════════════════════════════════
 */

import { put, del } from "@vercel/blob";

const MAX_SIZE = 2 * 1024 * 1024; // 2MB por defecto
const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp"];

export type ResultadoUpload = {
  url: string;
  filename: string;
  size: number;
  type: string;
};

/**
 * Sube un archivo a Vercel Blob dentro de una carpeta lógica.
 *
 * @param file Archivo recibido del FormData
 * @param carpeta Carpeta lógica (ej: "blog", "panaderias", "productos")
 * @param maxSize Tamaño máximo en bytes (default 2MB)
 * @returns Datos del archivo subido, incluyendo la URL pública
 */
export async function subirImagenBlob(
  file: File,
  carpeta: string,
  maxSize: number = MAX_SIZE,
): Promise<ResultadoUpload> {
  // Validar tipo
  if (!TIPOS_PERMITIDOS.includes(file.type)) {
    throw new Error(
      `Tipo no permitido. Solo se aceptan: ${TIPOS_PERMITIDOS.join(", ")}`,
    );
  }

  // Validar tamaño
  if (file.size > maxSize) {
    throw new Error(
      `Archivo demasiado grande. Máximo permitido: ${maxSize / 1024 / 1024}MB`,
    );
  }

  // Generar nombre único
  const timestamp = Date.now();
  const aleatorio = Math.random().toString(36).slice(2, 8);
  const originalName = file.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9.]/g, "-")
    .replace(/-+/g, "-");

  const pathname = `${carpeta}/${timestamp}-${aleatorio}-${originalName}`;

  // Subir a Vercel Blob
  const blob = await put(pathname, file, {
    access: "public",
    addRandomSuffix: false,
  });

  return {
    url: blob.url,
    filename: pathname,
    size: file.size,
    type: file.type,
  };
}

/**
 * Elimina una imagen de Vercel Blob.
 * No lanza error si la imagen no existe o es externa.
 *
 * @param url URL completa del blob (https://....public.blob.vercel-storage.com/...)
 */
export async function eliminarImagenBlob(
  url: string | null | undefined,
): Promise<boolean> {
  if (!url) return false;

  // Solo eliminar URLs de Vercel Blob (no las estáticas de /assets)
  if (!url.includes(".blob.vercel-storage.com")) return false;

  try {
    await del(url);
    console.log(`🗑️  Imagen eliminada de Blob: ${url}`);
    return true;
  } catch (error) {
    console.error(
      `⚠️  Error eliminando imagen de Blob ${url}:`,
      (error as Error).message,
    );
    return false;
  }
}

/**
 * Reemplaza una imagen: si la antigua está en Blob y cambió, la elimina.
 */
export async function reemplazarImagenBlob(
  imagenAntigua: string | null | undefined,
  imagenNueva: string | null | undefined,
): Promise<void> {
  if (!imagenAntigua) return;
  if (imagenAntigua === imagenNueva) return;
  await eliminarImagenBlob(imagenAntigua);
}

/**
 * Elimina múltiples imágenes de Blob.
 */
export async function eliminarImagenesBlob(
  urls: (string | null | undefined)[],
): Promise<number> {
  let eliminadas = 0;
  for (const url of urls) {
    const exito = await eliminarImagenBlob(url);
    if (exito) eliminadas++;
  }
  return eliminadas;
}