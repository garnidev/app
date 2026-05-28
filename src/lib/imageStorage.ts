/**
 * ═══════════════════════════════════════════════════════════════════════
 * HELPER — Almacenamiento de imágenes
 * ─────────────────────────────────────────────────────────────────────
 * Utilidades para gestionar imágenes en el sistema de archivos:
 * - Eliminar imágenes antiguas al reemplazar
 * - Validar si una imagen es "propia" (no externa o por defecto)
 * ═══════════════════════════════════════════════════════════════════════
 */

import { unlink, access } from "fs/promises";
import path from "path";

/**
 * Rutas protegidas que NUNCA deben eliminarse aunque dejen de usarse.
 * Son archivos compartidos o imágenes por defecto.
 */
const RUTAS_PROTEGIDAS = new Set<string>([
  "/assets/ciudades/default.jpg",
  "/assets/blog/avatar-default.jpg",
]);

/**
 * Verifica si una imagen es interna (está en /assets/) y NO es protegida.
 */
function esImagenInternaEliminable(rutaImagen: string): boolean {
  if (!rutaImagen) return false;
  if (!rutaImagen.startsWith("/assets/")) return false;
  if (RUTAS_PROTEGIDAS.has(rutaImagen)) return false;
  // Seguridad básica: prevenir path traversal
  if (rutaImagen.includes("..")) return false;
  return true;
}

/**
 * Verifica si un archivo existe en el filesystem.
 */
async function archivoExiste(rutaAbsoluta: string): Promise<boolean> {
  try {
    await access(rutaAbsoluta);
    return true;
  } catch {
    return false;
  }
}

/**
 * Elimina una imagen del disco si cumple las condiciones de seguridad.
 * No lanza error si el archivo no existe o no es eliminable.
 *
 * @param rutaImagen Ruta pública (ej: "/assets/panaderias/123-abc.jpg")
 * @returns true si se eliminó, false si se omitió
 */
export async function eliminarImagenInterna(
  rutaImagen: string | null | undefined,
): Promise<boolean> {
  if (!rutaImagen) return false;
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

/**
 * Reemplaza una imagen: si la antigua es interna y eliminable, la borra.
 * Útil cuando se actualiza un registro con una nueva imagen.
 *
 * @param imagenAntigua Ruta de la imagen previa
 * @param imagenNueva Ruta de la imagen nueva (para validar que cambió)
 */
export async function reemplazarImagen(
  imagenAntigua: string | null | undefined,
  imagenNueva: string | null | undefined,
): Promise<void> {
  // Si no hay antigua o son la misma, no hacer nada
  if (!imagenAntigua) return;
  if (imagenAntigua === imagenNueva) return;

  await eliminarImagenInterna(imagenAntigua);
}

/**
 * Elimina múltiples imágenes (útil para carruseles o al eliminar registros
 * con varias imágenes asociadas).
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