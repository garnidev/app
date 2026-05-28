import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";

/**
 * GET /api/posts
 * ──────────────
 * Lista posts del blog con filtros y paginación.
 *
 * Query params:
 * - busqueda: string           → busca en título o descripción
 * - categoria: string          → filtra por categoría exacta
 * - estado: "PUBLICADO" | "BORRADOR" | "ARCHIVADO"  → default PUBLICADO
 * - tag: string                → filtra por tag (label)
 * - limit: number              → default 20
 * - offset: number             → default 0
 * - ordenarPor: "fecha" | "titulo"  → default fecha (más recientes primero)
 *
 * Ejemplos:
 *   GET /api/posts
 *   GET /api/posts?busqueda=masa+madre
 *   GET /api/posts?categoria=Recetas&estado=PUBLICADO
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const busqueda = searchParams.get("busqueda")?.trim() || "";
    const categoria = searchParams.get("categoria")?.trim() || "";
    const estado = searchParams.get("estado")?.toUpperCase() || "PUBLICADO";
    const tag = searchParams.get("tag")?.trim() || "";
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const ordenarPor = searchParams.get("ordenarPor") || "fecha";

    // Construir filtro
    const where: Prisma.PostWhereInput = {
      estado: estado as "BORRADOR" | "PUBLICADO" | "ARCHIVADO",
    };

    if (busqueda) {
      where.OR = [
        { titulo: { contains: busqueda, mode: "insensitive" } },
        { descripcion: { contains: busqueda, mode: "insensitive" } },
      ];
    }

    if (categoria) {
      where.categoria = categoria;
    }

    if (tag) {
      where.tags = {
        some: { label: { contains: tag, mode: "insensitive" } },
      };
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          tags: {
            select: {
              id: true,
              label: true,
              icon: true,
            },
          },
          _count: {
            select: {
              // comentarios: { where: { estado: "APROBADO" } },
              comentarios: true,
            },
          },
        },
        orderBy:
          ordenarPor === "titulo"
            ? { titulo: "asc" }
            : { fechaIso: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      posts: posts.map((p) => ({
        id: p.id,
        slug: p.slug,
        titulo: p.titulo,
        descripcion: p.descripcion,
        categoria: p.categoria,
        keyword: p.keyword,
        imagen: p.imagen,
        fechaIso: p.fechaIso,
        estado: p.estado,
        tags: p.tags,
        totalComentarios: p._count.comentarios,
        creadoEn: p.creadoEn,
      })),
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error en GET /api/posts:", error);
    return NextResponse.json(
      { error: "Error al obtener posts" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/posts
 * ───────────────
 * Crea un nuevo post. Solo admin.
 *
 * Body (JSON):
 * {
 *   "slug": "...",              // requerido, único
 *   "titulo": "...",            // requerido
 *   "descripcion": "...",       // requerido
 *   "contenido": "...",         // requerido (markdown)
 *   "categoria": "...",         // requerido
 *   "keyword": "...",           // opcional
 *   "imagen": "...",            // requerido
 *   "fechaIso": "2026-05-26",   // opcional, default hoy
 *   "estado": "BORRADOR",       // opcional, default BORRADOR
 *   "tags": [                   // opcional
 *     { "label": "Tradición", "icon": "..." }
 *   ]
 * }
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user.rol !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();

    // Validación
    const requeridos = [
      "slug",
      "titulo",
      "descripcion",
      "contenido",
      "categoria",
      "imagen",
    ];
    for (const campo of requeridos) {
      if (!body[campo]) {
        return NextResponse.json(
          { error: `Campo requerido: ${campo}` },
          { status: 400 }
        );
      }
    }

    // Verificar slug único
    const existe = await prisma.post.findUnique({ where: { slug: body.slug } });
    if (existe) {
      return NextResponse.json(
        { error: `Ya existe un post con slug '${body.slug}'` },
        { status: 409 }
      );
    }

    // Crear post (con tags si vienen)
    const post = await prisma.post.create({
      data: {
        slug: body.slug,
        titulo: body.titulo,
        descripcion: body.descripcion,
        contenido: body.contenido,
        categoria: body.categoria,
        keyword: body.keyword || null,
        imagen: body.imagen,
        fechaIso: body.fechaIso ? new Date(body.fechaIso) : new Date(),
        estado: body.estado || "BORRADOR",
        autorId: session.user.id,
        tags: body.tags
          ? {
              create: body.tags.map((t: { label: string; icon?: string }) => ({
                label: t.label,
                icon: t.icon || null,
              })),
            }
          : undefined,
      },
      include: { tags: true },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error en POST /api/posts:", error);
    return NextResponse.json(
      { error: "Error al crear el post" },
      { status: 500 }
    );
  }
}