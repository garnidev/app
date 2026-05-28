/**
 * ═══════════════════════════════════════════════════════════════════════
 * HELPER — Almacenamiento de imágenes (híbrido: filesystem + Vercel Blob)
 * ─────────────────────────────────────────────────────────────────────
 * Detecta automáticamente el origen de cada imagen:
 * - URLs de Vercel Blob (*.blob.vercel-storage.com) → elimina vía @vercel/blob
 * - Rutas internas (/assets/...) → elimina del filesystem (solo dev/legacy)
 * - Rutas protegidas o externas → se omiten
 * ═══════════════════════════════════════════════════════════════════════
 */

import { unlink, access } from "fs/promises";
import path from "path";
import { del } from "@vercel/blob";

/**
 * Rutas protegidas que NUNCA deben eliminarse aunque dejen de usarse.
 */
const RUTAS_PROTEGIDAS = new Set<string>([
  "/assets/ciudades/default.jpg",
  "/assets/blog/avatar-default.jpg",
  "/assets/avatares/avatar-default.jpg",
]);

/* ─── Detección de origen ──────────────────────────────────────── */

function esImagenBlob(url: string): boolean {
  return url.includes(".blob.vercel-storage.com");
}

function esImagenInternaEliminable(rutaImagen: string): boolean {
  if (!rutaImagen) return false;
  if (!rutaImagen.startsWith("/assets/")) return false;
  if (RUTAS_PROTEGIDAS.has(rutaImagen)) return false;
  if (rutaImagen.includes("..")) return false;
  return true;
}

/* ─── Eliminación en Blob ──────────────────────────────────────── */

async function eliminarDeBlob(url: string): Promise<boolean> {
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

/* ─── Eliminación en filesystem (legacy/dev) ───────────────────── */

async function archivoExiste(rutaAbsoluta: string): Promise<boolean> {
  try {
    await access(rutaAbsoluta);
    return true;
  } catch {
    return false;
  }
}

async function eliminarDelFilesystem(rutaImagen: string): Promise<boolean> {
  if (!esImagenInternaEliminable(rutaImagen)) return false;

  const rutaAbsoluta = path.join(process.cwd(), "public", rutaImagen);

  try {
    const existe = await archivoExiste(rutaAbsoluta);
    if (!existe) return false;

    await unlink(rutaAbsoluta);
    console.log(`🗑️  Imagen eliminada: ${rutaImagen}`);
    return true;
  } catch (error) {
    console.error(
      `⚠️  Error eliminando imagen ${rutaImagen}:`,
      (error as Error).message,
    );
    return false;
  }
}

/* ─── API pública (misma firma de siempre) ─────────────────────── */

/**
 * Elimina una imagen del lugar correcto según su origen.
 * - Blob → @vercel/blob del()
 * - Filesystem → unlink()
 * No lanza error si no existe o no es eliminable.
 */
export async function eliminarImagenInterna(
  rutaImagen: string | null | undefined,
): Promise<boolean> {
  if (!rutaImagen) return false;

  // Es una URL de Vercel Blob
  if (esImagenBlob(rutaImagen)) {
    return eliminarDeBlob(rutaImagen);
  }

  // Es una ruta interna del filesystem (legacy/dev)
  return eliminarDelFilesystem(rutaImagen);
}

/**
 * Reemplaza una imagen: si la antigua cambió, la elimina de su origen.
 */
export async function reemplazarImagen(
  imagenAntigua: string | null | undefined,
  imagenNueva: string | null | undefined,
): Promise<void> {
  if (!imagenAntigua) return;
  if (imagenAntigua === imagenNueva) return;

  await eliminarImagenInterna(imagenAntigua);
}

/**
 * Elimina múltiples imágenes (carruseles, registros con varias imágenes).
 */
export async function eliminarImagenes(
  rutas: (string | null | undefined)[],
): Promise<number> {
  let eliminadas = 0;
  for (const ruta of rutas) {
    const exito = await eliminarImagenInterna(ruta);
    if (exito) eliminadas++;
  }
  return eliminadas;
}