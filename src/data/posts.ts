/**
 * ═══════════════════════════════════════════════════════════════════════
 *  DATOS DEL BLOG — CONECTADO AL BACKEND
 * ─────────────────────────────────────────────────────────────────────
 *  Este archivo expone las mismas funciones que antes (getPosts, etc.)
 *  pero ahora consumen el backend real vía fetch a /api/posts.
 *
 *  Los tipos del frontend se mantienen para no romper componentes.
 *  Un adapter interno transforma los datos del backend al formato local.
 * ═══════════════════════════════════════════════════════════════════════
 */

/* ═══════════════════════════════════════════════════════════════════════
   TIPOS PÚBLICOS — mantenidos para compatibilidad con componentes
   ═══════════════════════════════════════════════════════════════════════ */

export type Categoria = "TERRITORIO" | "INGREDIENTES" | "OFICIOS" | "HISTORIA";
export type EstadoPost = "publicado" | "borrador" | "activa" | "archivado";

export type Post = {
  id: string;
  slug: string;
  categoria: Categoria;
  titulo: string;
  descripcion: string;
  imagen: {
    src: string;
    alt: string;
  };
  fechaISO: string;
  tiempoLecturaMin: number;
  estado?: EstadoPost;
  visitas?: number;
  autor?: {
    id: string;
    nombre: string;
  };
  totalComentarios?: number;
};

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

export type Comentario = {
  id: string;
  autor: string;
  avatar: string;
  texto: string;
  fechaISO: string;
};

export type PostDetalle = Post & {
  keyword: string;
  contenido: string;
  tags: Tag[];
  comentarios: Comentario[];
};

/* ═══════════════════════════════════════════════════════════════════════
   ADAPTADORES — transforman datos del backend al formato del frontend
   ═══════════════════════════════════════════════════════════════════════ */

/** Tipo crudo que viene del backend (parcial, lo que nos importa) */
type PostBackend = {
  id: string;
  slug: string;
  titulo: string;
  descripcion: string;
  contenido?: string;
  categoria: string;
  keyword: string | null;
  imagen: string;
  fechaIso: string;
  estado: "BORRADOR" | "PUBLICADO" | "ARCHIVADO";
  tags?: Array<{ id: string; label: string; icon: string | null }>;
  totalComentarios?: number;
  comentarios?: Array<{
    id: string;
    autor: string;
    avatar: string | null;
    texto: string;
    fecha: string;
  }>;
};

/** Mapea estado del backend a frontend */
function adaptarEstado(estado: string): EstadoPost {
  switch (estado) {
    case "PUBLICADO":
      return "publicado";
    case "BORRADOR":
      return "borrador";
    case "ARCHIVADO":
      return "archivado";
    default:
      return "publicado";
  }
}

/** Mapea categoría del backend a frontend (mejor esfuerzo) */
function adaptarCategoria(categoria: string): Categoria {
  // Normalizar a mayúsculas y quitar acentos
  const normalizada = categoria
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const mapeo: Record<string, Categoria> = {
    TERRITORIO: "TERRITORIO",
    INGREDIENTES: "INGREDIENTES",
    OFICIOS: "OFICIOS",
    HISTORIA: "HISTORIA",
    TRADICION: "HISTORIA",
    SALUD: "INGREDIENTES",
    TECNICA: "OFICIOS",
    EMPRENDIMIENTO: "OFICIOS",
    EDUCACION: "HISTORIA",
    COMUNIDAD: "TERRITORIO",
    RECETAS: "INGREDIENTES",
  };

  return mapeo[normalizada] || "HISTORIA";
}

/** Mapea ícono del tag (intenta detectar por label) */
function adaptarTagIcon(label: string): TagIcon {
  const normalizado = label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (normalizado.includes("fermenta")) return "fermentacion";
  if (normalizado.includes("tecnica") || normalizado.includes("tutorial")) return "tecnica";
  if (normalizado.includes("masa madre")) return "masa-madre";
  if (normalizado.includes("panaderia") || normalizado.includes("pan"))
    return "panaderia";
  if (normalizado.includes("colombia") || normalizado.includes("territorio"))
    return "colombia";
  return "cultivo";
}

/** Estima el tiempo de lectura en minutos (200 palabras por minuto) */
function estimarTiempoLectura(contenido: string): number {
  const palabras = contenido.split(/\s+/).length;
  return Math.max(1, Math.ceil(palabras / 200));
}

/** Adapta un post del backend al formato de Post (listado) */
function adaptarPost(p: PostBackend): Post {
  return {
    id: p.id,
    slug: p.slug,
    categoria: adaptarCategoria(p.categoria),
    titulo: p.titulo,
    descripcion: p.descripcion,
    imagen: {
      src: p.imagen,
      alt: p.titulo,
    },
    fechaISO: typeof p.fechaIso === "string" ? p.fechaIso.split("T")[0] : "",
    tiempoLecturaMin: p.contenido ? estimarTiempoLectura(p.contenido) : 5,
    estado: adaptarEstado(p.estado),
    visitas: 0, // Por ahora 0; cuando se agregue al backend se mapea aquí
    autor: { id: "u-001", nombre: "Admin Masa Madre" }, // mock por ahora
    totalComentarios: p.totalComentarios ?? 0,
  };
}

/** Adapta un post del backend al formato de PostDetalle (con contenido) */
function adaptarPostDetalle(p: PostBackend): PostDetalle {
  const base = adaptarPost(p);
  return {
    ...base,
    keyword: p.keyword?.toUpperCase() || base.categoria,
    contenido: p.contenido || "",
    tags: (p.tags || []).map((t) => ({
      label: t.label,
      icon: adaptarTagIcon(t.label),
    })),
    comentarios: (p.comentarios || []).map((c) => ({
      id: c.id,
      autor: c.autor,
      avatar: c.avatar || "/assets/blog/avatar-default.jpg",
      texto: c.texto,
      fechaISO: c.fecha.split("T")[0],
    })),
  };
}

/* ═══════════════════════════════════════════════════════════════════════
   HELPER — construir URL del API
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
   FUNCIONES DE ACCESO — todas async ahora
   ═══════════════════════════════════════════════════════════════════════ */

/** Devuelve la lista de posts publicados (para el listado /blog público) */
export async function getPosts(): Promise<Post[]> {
  try {
    const res = await fetch(apiUrl("/api/posts?estado=PUBLICADO"), {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Error en getPosts:", res.status);
      return [];
    }

    const data = await res.json();
    return data.posts.map(adaptarPost);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

/** Busca un post por su slug (para el detalle /blog/[slug]) */
export async function getPostBySlug(
  slug: string
): Promise<PostDetalle | undefined> {
  try {
    const res = await fetch(apiUrl(`/api/posts/${slug}`), {
      cache: "no-store",
    });

    if (!res.ok) {
      return undefined;
    }

    const post = await res.json();
    return adaptarPostDetalle(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return undefined;
  }
}

/** Devuelve todos los slugs (útil para generateStaticParams) */
export async function getAllSlugs(): Promise<string[]> {
  try {
    const res = await fetch(apiUrl("/api/posts?limit=1000"), {
      cache: "no-store",
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.posts.map((p: { slug: string }) => p.slug);
  } catch (error) {
    console.error("Error fetching slugs:", error);
    return [];
  }
}

/**
 * Devuelve TODOS los posts (incluye borradores y archivados) para el admin.
 */
export async function getPostsActivos(): Promise<PostDetalle[]> {
  try {
    const res = await fetch(
      apiUrl("/api/posts?estado=PUBLICADO&limit=1000"),
      { cache: "no-store" }
    );

    if (!res.ok) return [];

    const data = await res.json();
    // Para activos pedimos PUBLICADO + BORRADOR (los no archivados)
    const borradoresRes = await fetch(
      apiUrl("/api/posts?estado=BORRADOR&limit=1000"),
      { cache: "no-store" }
    );

    let borradores: PostBackend[] = [];
    if (borradoresRes.ok) {
      const borradoresData = await borradoresRes.json();
      borradores = borradoresData.posts;
    }

    return [...data.posts, ...borradores].map(adaptarPostDetalle);
  } catch (error) {
    console.error("Error fetching posts activos:", error);
    return [];
  }
}

/** Devuelve los posts archivados */
export async function getPostsArchivados(): Promise<PostDetalle[]> {
  try {
    const res = await fetch(
      apiUrl("/api/posts?estado=ARCHIVADO&limit=1000"),
      { cache: "no-store" }
    );

    if (!res.ok) return [];

    const data = await res.json();
    return data.posts.map(adaptarPostDetalle);
  } catch (error) {
    console.error("Error fetching archivados:", error);
    return [];
  }
}

/** Cuenta posts por estado (para badges del admin) */
export async function contarPostsPorEstado(): Promise<{
  total: number;
  activos: number;
  archivados: number;
  publicados: number;
  borradores: number;
}> {
  try {
    // Hacer las 3 queries en paralelo
    const [publicadosRes, borradoresRes, archivadosRes] = await Promise.all([
      fetch(apiUrl("/api/posts?estado=PUBLICADO&limit=1"), {
        cache: "no-store",
      }),
      fetch(apiUrl("/api/posts?estado=BORRADOR&limit=1"), {
        cache: "no-store",
      }),
      fetch(apiUrl("/api/posts?estado=ARCHIVADO&limit=1"), {
        cache: "no-store",
      }),
    ]);

    const [publicados, borradores, archivados] = await Promise.all([
      publicadosRes.ok
        ? publicadosRes.json()
        : { total: 0 },
      borradoresRes.ok
        ? borradoresRes.json()
        : { total: 0 },
      archivadosRes.ok
        ? archivadosRes.json()
        : { total: 0 },
    ]);

    return {
      total: publicados.total + borradores.total + archivados.total,
      activos: publicados.total + borradores.total,
      archivados: archivados.total,
      publicados: publicados.total,
      borradores: borradores.total,
    };
  } catch (error) {
    console.error("Error contando posts:", error);
    return {
      total: 0,
      activos: 0,
      archivados: 0,
      publicados: 0,
      borradores: 0,
    };
  }
}