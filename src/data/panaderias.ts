/**
 * ═══════════════════════════════════════════════════════════════════════
 *  PANADERÍAS — CONECTADO AL BACKEND
 * ─────────────────────────────────────────────────────────────────────
 *  Estrategia: carga híbrida optimizada para escalar a 10.000+ panaderías
 *
 *  • obtenerMarkers()          → datos mínimos para markers del mapa
 *  • buscarPanaderias(q)       → búsqueda server-side con debounce
 *  • obtenerPanaderiaPorId(id) → detalle bajo demanda
 *  • obtenerPanaderiasPorDepartamento → al hacer click en un depto
 * ═══════════════════════════════════════════════════════════════════════
 */

/* ═══════════════════════════════════════════════════════════════════════
   TIPOS PÚBLICOS
   ═══════════════════════════════════════════════════════════════════════ */

export type Producto = {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
};

export type Panaderia = {
  id: string;
  nombre: string;
  descripcionCorta: string;
  telefono: string;
  email?: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  urlGoogleMaps: string;
  imagen: string;
  horario: string;
  productos: Producto[];
  imagenesCarrusel?: string[];
  coords: [number, number];
};

/** Tipo ligero para markers del mapa (sin detalles) */
export type PanaderiaMarker = {
  id: string;
  nombre: string;
  coords: [number, number];
  ciudad: string;
  ciudadSlug: string;
  departamento: string;
  departamentoSlug: string;
};

/* ═══════════════════════════════════════════════════════════════════════
   TIPO CRUDO DEL BACKEND
   ═══════════════════════════════════════════════════════════════════════ */

type PanaderiaBackend = {
  id: string;
  nombre: string;
  descripcionCorta: string;
  telefono: string;
  email: string | null;
  direccion: string;
  urlGoogleMaps: string;
  imagen: string;
  horario: string;
  imagenesCarrusel: string[];
  coords: [number, number];
  ciudad: { nombre: string; slug: string };
  departamento: { nombre: string; slug: string };
  productos: Array<{
    id: string;
    nombre: string;
    precio: number;
    imagen: string;
  }>;
};

/* ═══════════════════════════════════════════════════════════════════════
   ADAPTERS
   ═══════════════════════════════════════════════════════════════════════ */

function adaptarPanaderia(p: PanaderiaBackend): Panaderia {
  return {
    id: p.id,
    nombre: p.nombre,
    descripcionCorta: p.descripcionCorta,
    telefono: p.telefono,
    email: p.email || undefined,
    direccion: p.direccion,
    ciudad: p.ciudad.nombre,
    departamento: p.departamento.nombre,
    urlGoogleMaps: p.urlGoogleMaps,
    imagen: p.imagen,
    horario: p.horario,
    productos: p.productos,
    imagenesCarrusel:
      p.imagenesCarrusel && p.imagenesCarrusel.length > 0
        ? p.imagenesCarrusel
        : undefined,
    coords: p.coords,
  };
}

/* ═══════════════════════════════════════════════════════════════════════
   URL HELPER
   ═══════════════════════════════════════════════════════════════════════ */

function apiUrl(path: string): string {
  // En el cliente: URL relativa (funciona desde cualquier IP/dominio)
  if (typeof window !== "undefined") {
    return path;
  }

  // En el servidor (SSR): URL absoluta apuntando al mismo proceso
  const base =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000";
  return `${base}${path}`;
}

/* ═══════════════════════════════════════════════════════════════════════
   FUNCIONES — todas async
   ═══════════════════════════════════════════════════════════════════════ */

/**
 * Carga los markers iniciales del mapa (payload mínimo).
 * Usar UNA VEZ al montar el componente del mapa.
 */
export async function obtenerMarkers(): Promise<PanaderiaMarker[]> {
  try {
    const res = await fetch(apiUrl("/api/panaderias/markers"), {
      cache: "no-store",
    });
    if (!res.ok) return [];

    const data = await res.json();
    return data.markers;
  } catch (error) {
    console.error("Error en obtenerMarkers:", error);
    return [];
  }
}

/**
 * Búsqueda server-side. Usar con debounce en el cliente.
 * Devuelve panaderías completas (con productos).
 */
export async function buscarPanaderias(query: string): Promise<Panaderia[]> {
  const q = query.trim();
  if (!q) return [];

  try {
    const params = new URLSearchParams({ busqueda: q });
    const res = await fetch(apiUrl(`/api/panaderias?${params}`), {
      cache: "no-store",
    });
    if (!res.ok) return [];

    const data = await res.json();
    return data.panaderias.map(adaptarPanaderia);
  } catch (error) {
    console.error("Error en buscarPanaderias:", error);
    return [];
  }
}

/**
 * Obtiene panaderías de un departamento por slug.
 * Usar al hacer click en un departamento del listado.
 */
export async function obtenerPanaderiasPorDepartamento(
  departamentoSlug: string
): Promise<Panaderia[]> {
  try {
    const params = new URLSearchParams({ departamento: departamentoSlug });
    const res = await fetch(apiUrl(`/api/panaderias?${params}`), {
      cache: "no-store",
    });
    if (!res.ok) return [];

    const data = await res.json();
    return data.panaderias.map(adaptarPanaderia);
  } catch (error) {
    console.error("Error en obtenerPanaderiasPorDepartamento:", error);
    return [];
  }
}

/**
 * Obtiene panaderías de una ciudad por slug.
 */
export async function obtenerPanaderiasPorCiudad(
  ciudadSlug: string
): Promise<Panaderia[]> {
  try {
    const params = new URLSearchParams({ ciudad: ciudadSlug });
    const res = await fetch(apiUrl(`/api/panaderias?${params}`), {
      cache: "no-store",
    });
    if (!res.ok) return [];

    const data = await res.json();
    return data.panaderias.map(adaptarPanaderia);
  } catch (error) {
    console.error("Error en obtenerPanaderiasPorCiudad:", error);
    return [];
  }
}

/**
 * Obtiene el detalle completo de una panadería por ID.
 * Usar cuando el usuario hace click en un marker o panadería del listado.
 */
export async function obtenerPanaderiaPorId(
  id: string
): Promise<Panaderia | null> {
  try {
    const res = await fetch(apiUrl(`/api/panaderias/${id}`), {
      cache: "no-store",
    });
    if (!res.ok) return null;

    const data = await res.json();
    return adaptarPanaderia(data);
  } catch (error) {
    console.error("Error en obtenerPanaderiaPorId:", error);
    return null;
  }
}

/* ═══════════════════════════════════════════════════════════════════════
   HELPERS SÍNCRONOS — operan sobre arrays ya cargados
   ═══════════════════════════════════════════════════════════════════════ */

/** Cuenta cuántos markers hay en un departamento (sobre array en memoria) */
export function contarMarkersPorDepartamento(
  markers: PanaderiaMarker[],
  departamentoSlug: string
): number {
  return markers.filter((m) => m.departamentoSlug === departamentoSlug).length;
}

/** Cuenta cuántos markers hay en una ciudad (sobre array en memoria) */
export function contarMarkersPorCiudad(
  markers: PanaderiaMarker[],
  ciudadSlug: string
): number {
  return markers.filter((m) => m.ciudadSlug === ciudadSlug).length;
}

/** Filtra markers por departamento (en memoria, no hace fetch) */
export function filtrarMarkersPorDepartamento(
  markers: PanaderiaMarker[],
  departamentoSlug: string
): PanaderiaMarker[] {
  return markers.filter((m) => m.departamentoSlug === departamentoSlug);
}

/** Agrupa panaderías por ciudad (sobre array ya cargado) */
export function agruparPanaderiasPorCiudad(
  panaderias: Panaderia[]
): Record<string, Panaderia[]> {
  const agrupadas: Record<string, Panaderia[]> = {};
  panaderias.forEach((p) => {
    if (!agrupadas[p.ciudad]) {
      agrupadas[p.ciudad] = [];
    }
    agrupadas[p.ciudad].push(p);
  });
  return agrupadas;
}

/** Formatea precio en formato colombiano: $10.800 */
export function formatearPrecio(precio: number): string {
  return `$${precio.toLocaleString("es-CO")}`;
}

/**
 * Construye el array de imágenes del carrusel de una panadería.
 * Si la panadería tiene `imagenesCarrusel` explícitas, las usa.
 * En su defecto, las arma con imagen principal + 3 imágenes de productos.
 */
export function getImagenesCarrusel(panaderia: Panaderia): string[] {
  if (panaderia.imagenesCarrusel && panaderia.imagenesCarrusel.length > 0) {
    return panaderia.imagenesCarrusel;
  }

  const imagenes: string[] = [panaderia.imagen];
  panaderia.productos.slice(0, 3).forEach((producto) => {
    imagenes.push(producto.imagen);
  });

  return imagenes;
}

/**
 * Búsqueda admin: igual que buscarPanaderias pero acepta filtros adicionales
 * por departamento y ciudad. Devuelve panaderías completas adaptadas.
 */
export async function buscarPanaderiasAdmin(filtros: {
  busqueda?: string;
  departamento?: string;
  ciudad?: string;
}): Promise<Panaderia[]> {
  try {
    const params = new URLSearchParams();
    if (filtros.busqueda?.trim()) params.set("busqueda", filtros.busqueda.trim());
    if (filtros.departamento) params.set("departamento", filtros.departamento);
    if (filtros.ciudad) params.set("ciudad", filtros.ciudad);

    const res = await fetch(apiUrl(`/api/panaderias?${params}`), {
      cache: "no-store",
    });
    if (!res.ok) return [];

    const data = await res.json();
    return data.panaderias.map(adaptarPanaderia);
  } catch (error) {
    console.error("Error en buscarPanaderiasAdmin:", error);
    return [];
  }
}

/**
 * Obtiene panaderías en estado ARCHIVADA (para la vista de archivo del admin).
 */
export async function obtenerPanaderiasArchivadas(): Promise<Panaderia[]> {
  try {
    const params = new URLSearchParams({ estado: "ARCHIVADA", limit: "100" });
    const res = await fetch(apiUrl(`/api/panaderias?${params}`), {
      cache: "no-store",
    });
    if (!res.ok) return [];

    const data = await res.json();
    return data.panaderias.map(adaptarPanaderia);
  } catch (error) {
    console.error("Error en obtenerPanaderiasArchivadas:", error);
    return [];
  }
}