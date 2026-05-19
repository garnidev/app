/**
 * Ciudades importantes de Colombia para el buscador del mapa.
 * Se usan para filtrar y mostrar resultados de búsqueda agrupados.
 *
 * Cuando llegue el backend, este archivo puede mantenerse como
 * fuente de verdad de ciudades, o consumirse desde la BD.
 */

export type Ciudad = {
  /** Slug para matching */
  slug: string;
  /** Nombre de la ciudad con tildes */
  nombre: string;
  /** Departamento al que pertenece */
  departamento: string;
  /** URL de la imagen representativa */
  imagen: string;
};

export const CIUDADES: Ciudad[] = [
  {
    slug: "bogota",
    nombre: "Bogotá",
    departamento: "Cundinamarca",
    imagen: "/assets/ciudades/bogota.jpg",
  },
  {
    slug: "medellin",
    nombre: "Medellín",
    departamento: "Antioquia",
    imagen: "/assets/ciudades/medellin.jpg",
  },
  {
    slug: "cali",
    nombre: "Cali",
    departamento: "Valle del Cauca",
    imagen: "/assets/ciudades/cali.jpg",
  },
  {
    slug: "barranquilla",
    nombre: "Barranquilla",
    departamento: "Atlántico",
    imagen: "/assets/ciudades/barranquilla.jpg",
  },
  {
    slug: "cartagena",
    nombre: "Cartagena",
    departamento: "Bolívar",
    imagen: "/assets/ciudades/cartagena.jpg",
  },
  {
    slug: "bucaramanga",
    nombre: "Bucaramanga",
    departamento: "Santander",
    imagen: "/assets/ciudades/bucaramanga.jpg",
  },
  {
    slug: "pereira",
    nombre: "Pereira",
    departamento: "Risaralda",
    imagen: "/assets/ciudades/pereira.jpg",
  },
  {
    slug: "santa-marta",
    nombre: "Santa Marta",
    departamento: "Magdalena",
    imagen: "/assets/ciudades/santa-marta.jpg",
  },
  {
    slug: "manizales",
    nombre: "Manizales",
    departamento: "Caldas",
    imagen: "/assets/ciudades/manizales.jpg",
  },
  {
    slug: "ibague",
    nombre: "Ibagué",
    departamento: "Tolima",
    imagen: "/assets/ciudades/ibague.jpg",
  },
  {
    slug: "armenia",
    nombre: "Armenia",
    departamento: "Quindío",
    imagen: "/assets/ciudades/armenia.jpg",
  },
  {
    slug: "popayan",
    nombre: "Popayán",
    departamento: "Cauca",
    imagen: "/assets/ciudades/popayan.jpg",
  },
  {
    slug: "neiva",
    nombre: "Neiva",
    departamento: "Huila",
    imagen: "/assets/ciudades/neiva.jpg",
  },
  {
    slug: "villavicencio",
    nombre: "Villavicencio",
    departamento: "Meta",
    imagen: "/assets/ciudades/villavicencio.jpg",
  },
  {
    slug: "pasto",
    nombre: "Pasto",
    departamento: "Nariño",
    imagen: "/assets/ciudades/pasto.jpg",
  },
  {
    slug: "monteria",
    nombre: "Montería",
    departamento: "Córdoba",
    imagen: "/assets/ciudades/monteria.jpg",
  },
  {
    slug: "valledupar",
    nombre: "Valledupar",
    departamento: "Cesar",
    imagen: "/assets/ciudades/valledupar.jpg",
  },
  {
    slug: "cucuta",
    nombre: "Cúcuta",
    departamento: "Norte de Santander",
    imagen: "/assets/ciudades/cucuta.jpg",
  },
];

/* ─── Helpers ─────────────────────────────────────────────────────── */

/** Búsqueda de ciudades por nombre o departamento */
export function buscarCiudades(query: string): Ciudad[] {
  const q = normalizar(query);
  if (!q) return [];

  return CIUDADES.filter((c) => {
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