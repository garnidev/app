import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

/**
 * GET /api/posts/[slug]/comentarios
 * ─────────────────────────────────
 * Lista comentarios de un post.
 *
 * Query params:
 * - estado: "APROBADO" | "PENDIENTE" | "RECHAZADO"
 *   • Sin auth: solo se permite APROBADO (default)
 *   • Con auth admin: cualquier estado
 *
 * Ejemplo público:
 *   GET /api/posts/historia-de-la-masa-madre/comentarios
 *
 * Ejemplo admin:
 *   GET /api/posts/historia-de-la-masa-madre/comentarios?estado=PENDIENTE
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const estadoRequested = searchParams.get("estado")?.toUpperCase();

    // Verificar autenticación admin
    const session = await auth();
    const esAdmin = session?.user.rol === "ADMIN";

    // Si pide un estado distinto a APROBADO, debe ser admin
    let estado: "PENDIENTE" | "APROBADO" | "RECHAZADO" = "APROBADO";
    if (estadoRequested && estadoRequested !== "APROBADO") {
      if (!esAdmin) {
        return NextResponse.json(
          { error: "No autorizado para ver comentarios no aprobados" },
          { status: 401 },
        );
      }
      estado = estadoRequested as "PENDIENTE" | "RECHAZADO";
    }

    // Verificar que el post existe
    const post = await prisma.post.findUnique({
      where: { slug },
      select: { id: true, titulo: true },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post no encontrado" },
        { status: 404 },
      );
    }

    const comentarios = await prisma.comentario.findMany({
      where: {
        postId: post.id,
        estado,
      },
      orderBy: { fecha: "desc" },
    });

    // Adaptar formato para que coincida con /api/comentarios global
    const comentariosFormateados = comentarios.map((c) => ({
      id: c.id,
      texto: c.texto,
      autor: c.autor,
      avatar: c.avatar,
      fecha: c.fecha,
      estado: c.estado,
      post: {
        id: post.id,
        slug,
        titulo: post.titulo,
      },
    }));

    return NextResponse.json({
      comentarios: comentariosFormateados,
      total: comentarios.length,
    });
  } catch (error) {
    console.error("Error en GET /api/posts/[slug]/comentarios:", error);
    return NextResponse.json(
      { error: "Error al obtener comentarios" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/posts/[slug]/comentarios
 * ──────────────────────────────────
 * Crea un comentario. Público (cualquiera puede crear).
 * Por defecto queda en estado PENDIENTE hasta que el admin lo apruebe.
 *
 * Body (JSON):
 * {
 *   "texto": "...",          // requerido
 *   "autor": "...",          // requerido
 *   "avatar": "..."          // opcional
 * }
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    // Validación
    if (!body.texto || !body.autor) {
      return NextResponse.json(
        { error: "Campos requeridos: texto y autor" },
        { status: 400 }
      );
    }

    // Validar longitud del texto
    if (body.texto.length < 5) {
      return NextResponse.json(
        { error: "El comentario debe tener al menos 5 caracteres" },
        { status: 400 }
      );
    }

    if (body.texto.length > 2000) {
      return NextResponse.json(
        { error: "El comentario no puede superar los 2000 caracteres" },
        { status: 400 }
      );
    }

    // Verificar que el post existe
    const post = await prisma.post.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post no encontrado" },
        { status: 404 }
      );
    }

    // Crear comentario en estado PENDIENTE
    const comentario = await prisma.comentario.create({
      data: {
        texto: body.texto.trim(),
        autor: body.autor.trim(),
        avatar: body.avatar || null,
        postId: post.id,
        estado: "PENDIENTE",
      },
    });

    return NextResponse.json(
      {
        ...comentario,
        mensaje:
          "Comentario recibido. Será publicado una vez aprobado por un moderador.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en POST /api/posts/[slug]/comentarios:", error);
    return NextResponse.json(
      { error: "Error al crear el comentario" },
      { status: 500 }
    );
  }
}

