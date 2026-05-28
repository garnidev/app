/**
 * ═══════════════════════════════════════════════════════════════════════
 *  DEPARTAMENTOS — CONECTADO AL BACKEND
 * ═══════════════════════════════════════════════════════════════════════
 */

import type { PanaderiaMarker } from "./panaderias";
import type { Ciudad } from "./ciudades";

export type Departamento = {
  slug: string;
  nombre: string;
  imagen: string;
  coordsCentro: [number, number];
  zoomNivel: number;
  totalPanaderias?: number;
};

/** Tipo unificado para resultados mixtos del buscador */
export type Ubicacion = {
  id: string;
  tipo: "departamento" | "ciudad";
  nombre: string;
  imagen: string;
  cantidadPanaderias: number;
  slug?: string;
};

type DepartamentoBackend = {
  id: string;
  slug: string;
  nombre: string;
  imagen: string;
  coordsCentro: [number, number];
  zoomNivel: number;
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

function adaptarDepartamento(d: DepartamentoBackend): Departamento {
  return {
    slug: d.slug,
    nombre: d.nombre,
    imagen: d.imagen,
    coordsCentro: d.coordsCentro,
    zoomNivel: d.zoomNivel,
    totalPanaderias: d.totalPanaderias,
  };
}

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/* ═══════════════════════════════════════════════════════════════════════
   FUNCIONES — algunas async (fetch), otras sync (in-memory)
   ═══════════════════════════════════════════════════════════════════════ */

/** Obtiene los 32 departamentos con conteo de panaderías */
export async function obtenerDepartamentos(): Promise<Departamento[]> {
  try {
    const res = await fetch(apiUrl("/api/departamentos"), { cache: "no-store" });
    if (!res.ok) return [];

    const data = await res.json();
    return data.departamentos.map(adaptarDepartamento);
  } catch (error) {
    console.error("Error en obtenerDepartamentos:", error);
    return [];
  }
}

/** Busca departamentos por nombre (sobre array ya cargado) */
export function buscarDepartamentos(
  departamentos: Departamento[],
  query: string
): Departamento[] {
  const q = normalizar(query);
  if (!q) return departamentos;

  return departamentos.filter((d) => normalizar(d.nombre).includes(q));
}

/** Obtiene un departamento por su slug (in-memory) */
export function getDepartamentoPorSlug(
  departamentos: Departamento[],
  slug: string
): Departamento | undefined {
  return departamentos.find((d) => d.slug === slug);
}

/** Obtiene un departamento por su nombre (in-memory) */
export function getDepartamentoPorNombre(
  departamentos: Departamento[],
  nombre: string
): Departamento | undefined {
  return departamentos.find(
    (d) => normalizar(d.nombre) === normalizar(nombre)
  );
}

/** Búsqueda unificada de departamentos + ciudades (in-memory) */
export function buscarUbicaciones(
  departamentos: Departamento[],
  ciudades: Ciudad[],
  markers: PanaderiaMarker[],
  query: string
): Ubicacion[] {
  const q = normalizar(query);
  if (!q) return [];

  const resultados: Ubicacion[] = [];

  // Departamentos que matchean
  departamentos.forEach((d) => {
    if (normalizar(d.nombre).includes(q)) {
      const cantidad = markers.filter(
        (m) => m.departamentoSlug === d.slug
      ).length;
      resultados.push({
        id: `dep-${d.slug}`,
        tipo: "departamento",
        nombre: d.nombre,
        imagen: d.imagen,
        cantidadPanaderias: cantidad,
        slug: d.slug,
      });
    }
  });

  // Ciudades que matchean
  ciudades.forEach((c) => {
    const haystack = normalizar(`${c.nombre} ${c.departamento}`);
    if (haystack.includes(q)) {
      const cantidad = markers.filter(
        (m) => m.ciudadSlug === c.slug
      ).length;
      resultados.push({
        id: `ciu-${c.slug}`,
        tipo: "ciudad",
        nombre: c.nombre,
        imagen: c.imagen,
        cantidadPanaderias: cantidad,
      });
    }
  });

  return resultados;
}