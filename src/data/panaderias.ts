/**
 * Tipos y datos mock de panaderías aliadas.
 * Cuando llegue el backend, mantén la forma del tipo Panaderia
 * y reemplaza el array MOCK_PANADERIAS por una llamada async.
 */

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
  /** Horario de atención (texto libre) */
  horario: string;
  /** Productos destacados */
  productos: Producto[];
  /** Coordenadas en formato [longitud, latitud] — orden de Mapbox */
  coords: [number, number];
};

export const MOCK_PANADERIAS: Panaderia[] = [
  {
    id: "p-001",
    nombre: "Panadería La Esquina del Trigo",
    descripcionCorta:
      "Pan artesanal con masa madre cultivada por más de 5 años.",
    telefono: "+57 1 234 5678",
    email: "contacto@esquinadeltrigo.co",
    direccion: "Cra. 13 #45-67, Chapinero",
    ciudad: "Bogotá",
    departamento: "Cundinamarca",
    urlGoogleMaps: "https://maps.app.goo.gl/PU15qRLKnANgZ",
    imagen: "/assets/panaderias/panaderia-1.jpg",
    horario: "Abre: 7:00 AM - Cierra: 10:00 PM",
    coords: [-74.0721, 4.7110],
    productos: [
      { id: "pr-1-1", nombre: "Pan masa madre", precio: 10800, imagen: "/assets/productos/pan-masa-madre.jpg" },
      { id: "pr-1-2", nombre: "Croissant masa madre", precio: 15800, imagen: "/assets/productos/croissant.jpg" },
      { id: "pr-1-3", nombre: "Pan con queso y mermelada", precio: 6800, imagen: "/assets/productos/pan-queso.jpg" },
      { id: "pr-1-4", nombre: "Pan casero masa madre", precio: 10800, imagen: "/assets/productos/pan-casero.jpg" },
    ],
  },
  {
    id: "p-002",
    nombre: "El Horno del Barrio",
    descripcionCorta:
      "Hornadas tradicionales todas las mañanas a las 5 a.m.",
    telefono: "+57 4 444 5678",
    email: "info@elhornodelbarrio.co",
    direccion: "Cl. 70 #45-12, Laureles",
    ciudad: "Medellín",
    departamento: "Antioquia",
    urlGoogleMaps: "https://maps.app.goo.gl/medellin-horno",
    imagen: "/assets/panaderias/panaderia-2.jpg",
    horario: "Abre: 5:00 AM - Cierra: 9:00 PM",
    coords: [-75.5636, 6.2476],
    productos: [
      { id: "pr-2-1", nombre: "Pan campesino", precio: 8500, imagen: "/assets/productos/pan-campesino.jpg" },
      { id: "pr-2-2", nombre: "Mogollas integrales", precio: 4200, imagen: "/assets/productos/mogollas.jpg" },
      { id: "pr-2-3", nombre: "Almojábanas", precio: 3500, imagen: "/assets/productos/almojabanas.jpg" },
    ],
  },
  {
    id: "p-003",
    nombre: "Trigo y Madera",
    descripcionCorta:
      "Especialidad en panes integrales y fermentación natural.",
    telefono: "+57 2 555 1234",
    direccion: "Av. 6N #25-30, Granada",
    ciudad: "Cali",
    departamento: "Valle del Cauca",
    urlGoogleMaps: "https://maps.app.goo.gl/cali-trigo",
    imagen: "/assets/panaderias/panaderia-3.jpg",
    horario: "Abre: 6:30 AM - Cierra: 8:00 PM",
    coords: [-76.5320, 3.4516],
    productos: [
      { id: "pr-3-1", nombre: "Pan de centeno", precio: 12000, imagen: "/assets/productos/pan-centeno.jpg" },
      { id: "pr-3-2", nombre: "Baguette tradicional", precio: 7500, imagen: "/assets/productos/baguette.jpg" },
      { id: "pr-3-3", nombre: "Focaccia con romero", precio: 18500, imagen: "/assets/productos/focaccia.jpg" },
      { id: "pr-3-4", nombre: "Pan brioche", precio: 14000, imagen: "/assets/productos/brioche.jpg" },
    ],
  },
  {
    id: "p-004",
    nombre: "Masa Viva Cartagena",
    descripcionCorta: "Pan artesanal con harinas locales del Caribe.",
    telefono: "+57 5 660 7890",
    email: "hola@masaviva.co",
    direccion: "Centro histórico, Cl. Don Sancho #36-50",
    ciudad: "Cartagena",
    departamento: "Bolívar",
    urlGoogleMaps: "https://maps.app.goo.gl/cartagena-viva",
    imagen: "/assets/panaderias/panaderia-4.jpg",
    horario: "Abre: 7:00 AM - Cierra: 9:00 PM",
    coords: [-75.5147, 10.3910],
    productos: [
      { id: "pr-4-1", nombre: "Pan de yuca", precio: 5500, imagen: "/assets/productos/pan-yuca.jpg" },
      { id: "pr-4-2", nombre: "Pan de bono", precio: 4000, imagen: "/assets/productos/pan-bono.jpg" },
      { id: "pr-4-3", nombre: "Arepa de huevo dulce", precio: 6800, imagen: "/assets/productos/arepa-huevo.jpg" },
    ],
  },
  {
    id: "p-005",
    nombre: "Tostipan",
    descripcionCorta:
      "Pan artesanal con masa madre cultivada por más de 5 años.",
    telefono: "3146228909 - 3276549087",
    direccion: "Av. 6N #23-52 Pereira, Risaralda",
    ciudad: "Pereira",
    departamento: "Risaralda",
    urlGoogleMaps: "https://maps.app.goo.gl/PU15qRLKnANgZ",
    imagen: "/assets/panaderias/panaderia-5.jpg",
    horario: "Abre: 7:30 AM - Cierra: 10:30 PM",
    coords: [-75.6906, 4.8133],
    productos: [
      { id: "pr-4-1", nombre: "Pan masa madre", precio: 10800, imagen: "/assets/productos/pan-masa-madre.jpg" },
      { id: "pr-5-2", nombre: "Croissant masa madre", precio: 15800, imagen: "/assets/productos/croissant.jpg" },
      { id: "pr-5-3", nombre: "Pan con queso y mermelada", precio: 6800, imagen: "/assets/productos/pan-queso.jpg" },
      { id: "pr-5-4", nombre: "Pan casero masa madre", precio: 10800, imagen: "/assets/productos/pan-casero.jpg" },
    ],
  },
  {
    id: "p-006",
    nombre: "Panadería La Estrella",
    descripcionCorta:
      "Pan artesanal con masa madre cultivada por más de 5 años.",
    telefono: "+57 1 234 5678",
    email: "contacto@esquinadeltrigo.co",
    direccion: "Cra. 13 #45-67, Chapinero",
    ciudad: "Medellín",
    departamento: "Antioquia",
    urlGoogleMaps: "https://maps.app.goo.gl/aBprmsWMFVnk2nht6",
    imagen: "/assets/panaderias/panaderia-5.jpg",
    horario: "Abre: 7:00 AM - Cierra: 10:00 PM",
    coords: [-75.5843295, 6.213122],
    productos: [
      { id: "pr-6-1", nombre: "Pan masa madre", precio: 10800, imagen: "/assets/productos/pan-masa-madre.jpg" },
      { id: "pr-6-2", nombre: "Croissant masa madre", precio: 15800, imagen: "/assets/productos/croissant.jpg" },
      { id: "pr-6-3", nombre: "Pan con queso y mermelada", precio: 6800, imagen: "/assets/productos/pan-queso.jpg" },
      { id: "pr-6-4", nombre: "Pan casero masa madre", precio: 10800, imagen: "/assets/productos/pan-casero.jpg" },
    ],
  },
];

/* ─── Helpers ─────────────────────────────────────────────────────── */

export function getPanaderias(): Panaderia[] {
  return MOCK_PANADERIAS;
}

export function contarPanaderiasPorDepartamento(departamento: string): number {
  return MOCK_PANADERIAS.filter(
    (p) => normalizar(p.departamento) === normalizar(departamento)
  ).length;
}

export function getPanaderiasPorDepartamento(
  departamento: string
): Panaderia[] {
  return MOCK_PANADERIAS.filter(
    (p) => normalizar(p.departamento) === normalizar(departamento)
  );
}

export function buscarPanaderias(query: string): Panaderia[] {
  const q = normalizar(query);
  if (!q) return MOCK_PANADERIAS;

  return MOCK_PANADERIAS.filter((p) => {
    const haystack = normalizar(
      `${p.nombre} ${p.ciudad} ${p.departamento} ${p.descripcionCorta} ${p.direccion}`
    );
    return haystack.includes(q);
  });
}

export function getPanaderiasAgrupadasPorCiudad(
  departamento: string
): Record<string, Panaderia[]> {
  const panaderias = MOCK_PANADERIAS.filter(
    (p) => normalizar(p.departamento) === normalizar(departamento)
  );

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

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}