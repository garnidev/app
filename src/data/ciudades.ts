/**
 * ═══════════════════════════════════════════════════════════════════════
 *  CIUDADES — CONECTADO AL BACKEND
 * ═══════════════════════════════════════════════════════════════════════
 */

export type Ciudad = {
  slug: string;
  nombre: string;
  departamento: string;
  imagen: string;
  totalPanaderias?: number;
};

/** Versión extendida para admin (incluye id y slug del departamento) */
export type CiudadAdmin = {
  id: string;
  slug: string;
  nombre: string;
  imagen: string;
  departamento: { nombre: string; slug: string };
  totalPanaderias: number;
};

type CiudadBackend = {
  id: string;
  slug: string;
  nombre: string;
  imagen: string;
  departamento: { nombre: string; slug: string };
  totalPanaderias: number;
};

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

function adaptarCiudad(c: CiudadBackend): Ciudad {
  return {
    slug: c.slug,
    nombre: c.nombre,
    departamento: c.departamento.nombre,
    imagen: c.imagen,
    totalPanaderias: c.totalPanaderias,
  };
}

/** Obtiene todas las ciudades (público, sin id) */
export async function obtenerCiudades(): Promise<Ciudad[]> {
  try {
    const res = await fetch(apiUrl("/api/ciudades"), { cache: "no-store" });
    if (!res.ok) return [];

    const data = await res.json();
    return data.ciudades.map(adaptarCiudad);
  } catch (error) {
    console.error("Error en obtenerCiudades:", error);
    return [];
  }
}

/**
 * Búsqueda admin con paginación.
 * Devuelve ciudades con id, slug, imagen y conteo de panaderías.
 */
export async function buscarCiudadesAdmin(filtros: {
  busqueda?: string;
  departamento?: string;
  ordenarPor?: "nombre" | "panaderias";
  limit?: number;
  offset?: number;
}): Promise<{ ciudades: CiudadAdmin[]; total: number }> {
  try {
    const params = new URLSearchParams();
    if (filtros.busqueda?.trim())
      params.set("busqueda", filtros.busqueda.trim());
    if (filtros.departamento) params.set("departamento", filtros.departamento);
    if (filtros.ordenarPor) params.set("ordenarPor", filtros.ordenarPor);
    if (filtros.limit !== undefined) params.set("limit", String(filtros.limit));
    if (filtros.offset !== undefined)
      params.set("offset", String(filtros.offset));

    const res = await fetch(apiUrl(`/api/ciudades?${params}`), {
      cache: "no-store",
    });
    if (!res.ok) return { ciudades: [], total: 0 };

    const data = await res.json();
    return {
      ciudades: data.ciudades as CiudadAdmin[],
      total: data.total,
    };
  } catch (error) {
    console.error("Error en buscarCiudadesAdmin:", error);
    return { ciudades: [], total: 0 };
  }
}

/** Busca ciudades por nombre o departamento (en memoria) */
export function buscarCiudades(ciudades: Ciudad[], query: string): Ciudad[] {
  const q = normalizar(query);
  if (!q) return [];

  return ciudades.filter((c) => {
    const haystack = normalizar(`${c.nombre} ${c.departamento}`);
    return haystack.includes(q);
  });
}

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}