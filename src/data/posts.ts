/**
 * ═══════════════════════════════════════════════════════════════════════
 *  DATOS MOCK DEL BLOG
 * ─────────────────────────────────────────────────────────────────────
 *  Este archivo centraliza los datos del blog. Cuando se integre una BD
 *  o CMS, basta con reemplazar este archivo por funciones que consulten
 *  la fuente real (getPosts, getPostBySlug) manteniendo los mismos tipos.
 * ═══════════════════════════════════════════════════════════════════════
 */

export type Categoria = "TERRITORIO" | "INGREDIENTES" | "OFICIOS" | "HISTORIA";
export type EstadoPost = "publicado" | "borrador" | "activa" | "archivado";

/** Post en versión listado (para /blog) */
export type Post = {
  id: string;
  slug: string;
  categoria: Categoria;
  titulo: string;
  descripcion: string; // usado como lead/resumen destacado en el detalle
  imagen: {
    src: string;
    alt: string;
  };
  fechaISO: string; // "2026-02-18"
  tiempoLecturaMin: number;
  // ─── Campos admin (opcionales; si no existen, se asume valores por defecto) ───
  /** Estado editorial. Default: "publicado" */
  estado?: EstadoPost;
  /** Número de visitas. Default: 0 */
  visitas?: number;
  /** Autor del artículo. Default: admin del sistema */
  autor?: {
    id: string;
    nombre: string;
  };
};

/** Tag del artículo (chips moradas al final del detalle) */
export type Tag = {
  label: string;
  icon: TagIcon;
};

export type TagIcon =
  | "fermentacion"
  | "tecnica"
  | "masa-madre"
  | "panaderia"
  | "colombia"
  | "cultivo";

/** Comentario en el detalle del post */
export type Comentario = {
  id: string;
  autor: string;
  avatar: string;
  texto: string;
  fechaISO: string;
};

/** Post completo (para /blog/[slug]) — extiende Post con contenido + metadata */
export type PostDetalle = Post & {
  /** Palabra corta que va en la píldora dorada del hero (ej: "CULTIVO") */
  keyword: string;
  /** Contenido del artículo en formato Markdown */
  contenido: string;
  /** Tags libres del artículo (diferentes a la categoría) */
  tags: Tag[];
  /** Comentarios iniciales (mock; la funcionalidad es agregar más en estado local) */
  comentarios: Comentario[];
};

/* ═══════════════════════════════════════════════════════════════════════
   CONTENIDO MARKDOWN DE EJEMPLO
   ═══════════════════════════════════════════════════════════════════════ */

const CONTENIDO_LEVADURA = `En Colombia, la masa madre lleva décadas viviendo en la memoria de los panaderos de pueblo. No como tendencia, sino como necesidad. Antes de que existieran los sobres de levadura industrial, las masas se inoculaban solas, se heredaban de generación en generación como si fueran semillas.

## El tiempo como ingrediente

A diferencia del pan industrial, que puede producirse en menos de dos horas, la masa madre exige paciencia. Los procesos de fermentación lenta, entre 12 y 24 horas, permiten que las bacterias lácticas descompongan los azúcares complejos del trigo, generando ácidos orgánicos que no solo dan sabor, sino que también mejoran la digestibilidad del pan.

> "El pan de masa madre no se hace — se cuida. Como un jardín, como un hijo."
>
> — Doña Carmen, panadera de Salento, Quindío

## Lo que transforma la tierra

La caramelización de los azúcares durante el horneado, combinada con la reacción de Maillard entre proteínas y azúcares, produce esa corteza oscura, crujiente y compleja que caracteriza al buen pan artesanal. La temperatura del horno, el vapor en los primeros minutos y la forma de la pieza son tan importantes como la masa en sí.

En la Red Masa Madre Colombia, cada panadería aliada trabaja con sus propias cepas de levadura, cultivadas con el agua, la harina y el aire de su región. Eso es, literalmente, el terroir del pan colombiano.`;

const CONTENIDO_HARINAS = `Así como el vino expresa su tierra, el pan también expresa la geografía de donde viene. Exploramos harinas de maíz, yuca y trigo de distintas regiones del país.

## Más allá del trigo

Colombia no es un país triguero. La mayor parte del trigo que consumimos es importado, lo que nos ha hecho olvidar que existen otras harinas con identidad propia. El maíz amarillo del Tolima, la yuca brava del Vichada, el achira del Huila — todas tienen historia y sabor.

> "Cuando descubrimos la harina de maíz peto del mercado local, nuestro pan cambió para siempre."
>
> — Laura Restrepo, panadería El Fogón

## Hacia una panadería con identidad

Usar harinas locales no es solo una decisión gastronómica. Es apoyar a los productores, reducir la huella ambiental y devolverle al pan su sentido de lugar.`;

const CONTENIDO_RED = `Cerramos el año con panaderías desde La Guajira hasta Nariño. Un recorrido por las incorporaciones más recientes a nuestra red nacional.

## El mapa crece

Cada panadería aliada representa más que un punto en el mapa: representa una comunidad, una tradición local y un compromiso con el pan artesanal.

Durante 2024 incorporamos panaderías en 18 departamentos, pasando de 22 a 48 aliados en todo el país.`;

/* ═══════════════════════════════════════════════════════════════════════
   DATOS MOCK
   ═══════════════════════════════════════════════════════════════════════ */

export const POSTS: PostDetalle[] = [
  {
    id: "1",
    slug: "mantener-levadura-madre-activa",
    categoria: "TERRITORIO",
    keyword: "CULTIVO",
    titulo: "¿Cómo mantener tu levadura madre activa todo el año?",
    descripcion:
      "La levadura madre es un ser vivo. Te enseñamos a alimentarla, almacenarla y revivirla aunque no hornees por semanas. La fermentación no es solo un proceso químico — es una conversación entre el panadero, la harina y el tiempo.",
    imagen: {
      src: "/assets/blog/levadura-madre.jpg",
      alt: "Frasco de levadura madre activa",
    },
    fechaISO: "2026-02-18",
    tiempoLecturaMin: 5,
    estado: "publicado",
    visitas: 142,
    autor: { id: "u-001", nombre: "Admin Masa Madre" },
    contenido: CONTENIDO_LEVADURA,
    tags: [
      { label: "Fermentación", icon: "fermentacion" },
      { label: "Técnica", icon: "tecnica" },
      { label: "Masa Madre", icon: "masa-madre" },
      { label: "Panadería artesanal", icon: "panaderia" },
      { label: "Colombia", icon: "colombia" },
    ],
    comentarios: [
      {
        id: "c1",
        autor: "Andrea Ruiz",
        avatar: "/assets/blog/avatar-andrea.jpg",
        texto: "Nunca había entendido tan bien el proceso de fermentación.",
        fechaISO: "2025-03-14",
      },
      {
        id: "c2",
        autor: "Andrea Ruiz",
        avatar: "/assets/blog/avatar-andrea.jpg",
        texto:
          "Nunca había logrado comprender con tanta claridad el proceso de fermentación como ahora. La forma en que lo explicaste permite entender cada etapa de manera sencilla y lógica, algo que no siempre es fácil cuando se trata de temas técnicos dentro de la panadería.",
        fechaISO: "2025-03-14",
      },
    ],
  },
  {
    id: "2",
    slug: "harinas-locales-terroir-colombiano",
    categoria: "INGREDIENTES",
    keyword: "HARINA",
    titulo: "Harinas locales: el terror del pan colombiano",
    descripcion:
      "Así como el vino expresa su tierra, el pan también. Exploramos harinas de maíz, yuca y trigo de distintas regiones del país.",
    imagen: {
      src: "/assets/blog/harinas-locales.jpg",
      alt: "Harinas de distintas regiones de Colombia",
    },
    fechaISO: "2026-02-18",
    tiempoLecturaMin: 5,
    estado: "borrador",
    visitas: 34,
    autor: { id: "u-001", nombre: "Admin Masa Madre" },
    contenido: CONTENIDO_HARINAS,
    tags: [
      { label: "Ingredientes", icon: "cultivo" },
      { label: "Colombia", icon: "colombia" },
      { label: "Panadería artesanal", icon: "panaderia" },
    ],
    comentarios: [],
  },
  {
    id: "3",
    slug: "red-crece-48-panaderias-aliadas",
    categoria: "INGREDIENTES",
    keyword: "RED",
    titulo: "La red crece: 48 panaderías aliadas en 2024",
    descripcion:
      "Cerramos el año con panaderías desde La Guajira hasta Nariño. Un recorrido por las incorporaciones más recientes a nuestra red nacional.",
    imagen: {
      src: "/assets/blog/red-panaderias.jpg",
      alt: "Mapa de panaderías aliadas en Colombia",
    },
    fechaISO: "2026-01-15",
    tiempoLecturaMin: 5,
    estado: "publicado",
    visitas: 287,
    autor: { id: "u-001", nombre: "Admin Masa Madre" },
    contenido: CONTENIDO_RED,
    tags: [
      { label: "Colombia", icon: "colombia" },
      { label: "Panadería artesanal", icon: "panaderia" },
    ],
    comentarios: [],
  },
  {
    id: "4",
    slug: "harinas-locales-variedades",
    categoria: "INGREDIENTES",
    keyword: "HARINAS",
    titulo: "Harinas locales: variedades regionales",
    descripcion:
      "Así como el vino expresa su tierra, el pan también. Exploramos harinas de maíz, yuca y trigo de distintas regiones del país.",
    imagen: {
      src: "/assets/blog/harinas-variedades.jpg",
      alt: "Diferentes variedades de harinas",
    },
    fechaISO: "2025-12-10",
    tiempoLecturaMin: 5,
    estado: "activa",
    visitas: 98,
    autor: { id: "u-001", nombre: "Admin Masa Madre" },
    contenido: CONTENIDO_HARINAS,
    tags: [
      { label: "Ingredientes", icon: "cultivo" },
      { label: "Colombia", icon: "colombia" },
    ],
    comentarios: [],
  },
  {
    id: "5",
    slug: "panaderias-del-pacifico",
    categoria: "TERRITORIO",
    keyword: "PACÍFICO",
    titulo: "Panaderías del Pacífico: tradición y resistencia",
    descripcion:
      "En el litoral colombiano, hornear pan es un acto político. Conoce a los panaderos que mantienen viva la cultura alimentaria de sus comunidades.",
    imagen: {
      src: "/assets/blog/pacifico.jpg",
      alt: "Panadería tradicional del Pacífico colombiano",
    },
    fechaISO: "2025-11-28",
    tiempoLecturaMin: 5,
    contenido: CONTENIDO_LEVADURA, // mock: usa el mismo contenido
    tags: [
      { label: "Territorio", icon: "colombia" },
      { label: "Tradición", icon: "masa-madre" },
    ],
    comentarios: [],
  },
  {
    id: "6",
    slug: "levadura-madre-guia-principiantes",
    categoria: "TERRITORIO",
    keyword: "GUÍA",
    titulo: "Levadura madre: guía para principiantes",
    descripcion:
      "La levadura madre es un ser vivo. Te enseñamos a alimentarla, almacenarla y revivirla aunque no hornees por semanas.",
    imagen: {
      src: "/assets/blog/levadura-guia.jpg",
      alt: "Principiante aprendiendo sobre levadura madre",
    },
    fechaISO: "2025-10-05",
    tiempoLecturaMin: 5,
    estado: "publicado",
    visitas: 156,
    autor: { id: "u-001", nombre: "Admin Masa Madre" },
    contenido: CONTENIDO_LEVADURA,
    tags: [
      { label: "Técnica", icon: "tecnica" },
      { label: "Masa Madre", icon: "masa-madre" },
    ],
    comentarios: [],
  },
];

/* ═══════════════════════════════════════════════════════════════════════
   FUNCIONES DE ACCESO
   ─────────────────────────────────────────────────────────────────────
   Cuando se integre la BD, estas funciones se convierten en queries
   (async) sin cambiar la interfaz pública.
   ═══════════════════════════════════════════════════════════════════════ */

/** Devuelve la lista completa de posts (para el listado /blog) */
export function getPosts(): Post[] {
  return POSTS;
}

/** Busca un post por su slug (para el detalle /blog/[slug]) */
export function getPostBySlug(slug: string): PostDetalle | undefined {
  return POSTS.find((p) => p.slug === slug);
}

/** Devuelve todos los slugs (útil para generateStaticParams) */
export function getAllSlugs(): string[] {
  return POSTS.map((p) => p.slug);
}

/**
 * Devuelve los posts visibles en el listado público del admin
 * (todos excepto los archivados).
 */
export function getPostsActivos(): PostDetalle[] {
  return POSTS.filter((p) => (p.estado ?? "publicado") !== "archivado");
}

/** Devuelve los posts archivados */
export function getPostsArchivados(): PostDetalle[] {
  return POSTS.filter((p) => p.estado === "archivado");
}

/** Cuenta posts por estado para los badges de la UI admin */
export function contarPostsPorEstado() {
  const counts = {
    total: POSTS.length,
    activos: 0,
    archivados: 0,
    publicados: 0,
    borradores: 0,
  };
  for (const p of POSTS) {
    const estado = p.estado ?? "publicado";
    if (estado === "archivado") counts.archivados++;
    else counts.activos++;
    if (estado === "publicado" || estado === "activa") counts.publicados++;
    if (estado === "borrador") counts.borradores++;
  }
  return counts;
}