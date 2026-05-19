import { CIUDADES } from "./ciudades";
import {
  contarPanaderiasPorDepartamento,
  MOCK_PANADERIAS,
} from "./panaderias";

/**
 * Los 32 departamentos de Colombia con datos para el mapa.
 */
export type Departamento = {
  slug: string;
  nombre: string;
  imagen: string;
  /** Centro del departamento para el flyTo de Mapbox [lng, lat] */
  coordsCentro: [number, number];
  /** Nivel de zoom recomendado al hacer flyTo */
  zoomNivel: number;
};

export const DEPARTAMENTOS: Departamento[] = [
  { slug: "amazonas", nombre: "Amazonas", imagen: "/assets/departamentos/amazonas.jpg", coordsCentro: [-71.5, -1.4], zoomNivel: 6 },
  { slug: "antioquia", nombre: "Antioquia", imagen: "/assets/departamentos/antioquia.jpg", coordsCentro: [-75.5, 7.0], zoomNivel: 7 },
  { slug: "arauca", nombre: "Arauca", imagen: "/assets/departamentos/arauca.jpg", coordsCentro: [-70.9, 6.8], zoomNivel: 7.5 },
  { slug: "atlantico", nombre: "Atlántico", imagen: "/assets/departamentos/atlantico.jpg", coordsCentro: [-74.9, 10.7], zoomNivel: 8.5 },
  { slug: "bolivar", nombre: "Bolívar", imagen: "/assets/departamentos/bolivar.jpg", coordsCentro: [-74.5, 9.0], zoomNivel: 7 },
  { slug: "boyaca", nombre: "Boyacá", imagen: "/assets/departamentos/boyaca.jpg", coordsCentro: [-72.6, 5.6], zoomNivel: 7.5 },
  { slug: "caldas", nombre: "Caldas", imagen: "/assets/departamentos/caldas.jpg", coordsCentro: [-75.5, 5.2], zoomNivel: 8 },
  { slug: "caqueta", nombre: "Caquetá", imagen: "/assets/departamentos/caqueta.jpg", coordsCentro: [-74.4, 1.0], zoomNivel: 6.5 },
  { slug: "casanare", nombre: "Casanare", imagen: "/assets/departamentos/casanare.jpg", coordsCentro: [-71.8, 5.7], zoomNivel: 7 },
  { slug: "cauca", nombre: "Cauca", imagen: "/assets/departamentos/cauca.jpg", coordsCentro: [-76.8, 2.5], zoomNivel: 7.5 },
  { slug: "cesar", nombre: "Cesar", imagen: "/assets/departamentos/cesar.jpg", coordsCentro: [-73.5, 9.8], zoomNivel: 7.5 },
  { slug: "choco", nombre: "Chocó", imagen: "/assets/departamentos/choco.jpg", coordsCentro: [-77.0, 6.0], zoomNivel: 7 },
  { slug: "cordoba", nombre: "Córdoba", imagen: "/assets/departamentos/cordoba.jpg", coordsCentro: [-75.8, 8.5], zoomNivel: 7.5 },
  { slug: "cundinamarca", nombre: "Cundinamarca", imagen: "/assets/departamentos/cundinamarca.jpg", coordsCentro: [-74.1, 5.0], zoomNivel: 7.5 },
  { slug: "guainia", nombre: "Guainía", imagen: "/assets/departamentos/guainia.jpg", coordsCentro: [-68.5, 2.5], zoomNivel: 6 },
  { slug: "guaviare", nombre: "Guaviare", imagen: "/assets/departamentos/guaviare.jpg", coordsCentro: [-72.0, 2.3], zoomNivel: 7 },
  { slug: "huila", nombre: "Huila", imagen: "/assets/departamentos/huila.jpg", coordsCentro: [-75.5, 2.5], zoomNivel: 7.5 },
  { slug: "la-guajira", nombre: "La Guajira", imagen: "/assets/departamentos/la-guajira.jpg", coordsCentro: [-72.5, 11.5], zoomNivel: 7.5 },
  { slug: "magdalena", nombre: "Magdalena", imagen: "/assets/departamentos/magdalena.jpg", coordsCentro: [-74.2, 10.4], zoomNivel: 7.5 },
  { slug: "meta", nombre: "Meta", imagen: "/assets/departamentos/meta.jpg", coordsCentro: [-72.9, 3.5], zoomNivel: 7 },
  { slug: "narino", nombre: "Nariño", imagen: "/assets/departamentos/narino.jpg", coordsCentro: [-77.5, 1.2], zoomNivel: 7.5 },
  { slug: "norte-de-santander", nombre: "Norte de Santander", imagen: "/assets/departamentos/norte-de-santander.jpg", coordsCentro: [-72.8, 8.0], zoomNivel: 7.5 },
  { slug: "putumayo", nombre: "Putumayo", imagen: "/assets/departamentos/putumayo.jpg", coordsCentro: [-76.0, 0.5], zoomNivel: 7 },
  { slug: "quindio", nombre: "Quindío", imagen: "/assets/departamentos/quindio.jpg", coordsCentro: [-75.7, 4.5], zoomNivel: 9 },
  { slug: "risaralda", nombre: "Risaralda", imagen: "/assets/departamentos/risaralda.jpg", coordsCentro: [-75.9, 5.2], zoomNivel: 8.5 },
  { slug: "san-andres", nombre: "San Andrés y Providencia", imagen: "/assets/departamentos/san-andres.jpg", coordsCentro: [-81.7, 12.5], zoomNivel: 9 },
  { slug: "santander", nombre: "Santander", imagen: "/assets/departamentos/santander.jpg", coordsCentro: [-73.2, 6.6], zoomNivel: 7.5 },
  { slug: "sucre", nombre: "Sucre", imagen: "/assets/departamentos/sucre.jpg", coordsCentro: [-75.0, 9.0], zoomNivel: 8 },
  { slug: "tolima", nombre: "Tolima", imagen: "/assets/departamentos/tolima.jpg", coordsCentro: [-75.2, 4.0], zoomNivel: 7.5 },
  { slug: "valle-del-cauca", nombre: "Valle del Cauca", imagen: "/assets/departamentos/valle-del-cauca.jpg", coordsCentro: [-76.5, 3.8], zoomNivel: 7.5 },
  { slug: "vaupes", nombre: "Vaupés", imagen: "/assets/departamentos/vaupes.jpg", coordsCentro: [-70.5, 0.6], zoomNivel: 6.5 },
  { slug: "vichada", nombre: "Vichada", imagen: "/assets/departamentos/vichada.jpg", coordsCentro: [-69.5, 4.5], zoomNivel: 6.5 },
];

/* ─── Tipo unificado para resultados mixtos del buscador ──────────── */

export type Ubicacion = {
  id: string;
  tipo: "departamento" | "ciudad";
  nombre: string;
  imagen: string;
  cantidadPanaderias: number;
  /** Solo para departamentos */
  slug?: string;
};

/* ─── Helpers ─────────────────────────────────────────────────────── */

/** Búsqueda de departamentos por nombre */
export function buscarDepartamentos(query: string): Departamento[] {
  const q = normalizar(query);
  if (!q) return DEPARTAMENTOS;

  return DEPARTAMENTOS.filter((d) => normalizar(d.nombre).includes(q));
}

/** Obtiene un departamento por su slug */
export function getDepartamentoPorSlug(slug: string): Departamento | undefined {
  return DEPARTAMENTOS.find((d) => d.slug === slug);
}

/** Obtiene un departamento por su nombre */
export function getDepartamentoPorNombre(
  nombre: string
): Departamento | undefined {
  return DEPARTAMENTOS.find(
    (d) => normalizar(d.nombre) === normalizar(nombre)
  );
}

/** Búsqueda de resultados mixtos (departamentos + ciudades) */
export function buscarUbicaciones(query: string): Ubicacion[] {
  const q = normalizar(query);
  if (!q) return [];

  const resultados: Ubicacion[] = [];

  DEPARTAMENTOS.forEach((d) => {
    if (normalizar(d.nombre).includes(q)) {
      resultados.push({
        id: `dep-${d.slug}`,
        tipo: "departamento",
        nombre: d.nombre,
        imagen: d.imagen,
        cantidadPanaderias: contarPanaderiasPorDepartamento(d.nombre),
        slug: d.slug,
      });
    }
  });

  CIUDADES.forEach((c) => {
    const haystack = normalizar(`${c.nombre} ${c.departamento}`);
    if (haystack.includes(q)) {
      resultados.push({
        id: `ciu-${c.slug}`,
        tipo: "ciudad",
        nombre: c.nombre,
        imagen: c.imagen,
        cantidadPanaderias: MOCK_PANADERIAS.filter(
          (p) => normalizar(p.ciudad) === normalizar(c.nombre)
        ).length,
      });
    }
  });

  return resultados;
}

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}