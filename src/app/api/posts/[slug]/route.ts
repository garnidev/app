import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { reemplazarImagen, eliminarImagenInterna } from "@/lib/imageStorage";

/**
 * GET /api/posts/[slug]
 * ─────────────────────
 * Obtiene un post por slug, con tags y comentarios aprobados.
 *
 * Ejemplo:
 *   GET /api/posts/historia-de-la-masa-madre
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        tags: {
          select: {
            id: true,
            label: true,
            icon: true,
          },
        },
        comentarios: {
          where: { estado: "APROBADO" },
          select: {
            id: true,
            texto: true,
            autor: true,
            avatar: true,
            fecha: true,
          },
          orderBy: { fecha: "desc" },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error en GET /api/posts/[slug]:", error);
    return NextResponse.json(
      { error: "Error al obtener el post" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/posts/[slug]
 * ─────────────────────
 * Actualiza un post existente. Solo admin.
 *
 * Body: cualquier campo del post (todos opcionales).
 * Si se envía `tags`, reemplaza todos los tags existentes.
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.rol !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { slug } = await params;
    const body = await request.json();

    const existe = await prisma.post.findUnique({ where: { slug } });
    if (!existe) {
      return NextResponse.json(
        { error: "Post no encontrado" },
        { status: 404 }
      );
    }

    // Si se cambia el slug, verificar que no exista otro con ese slug
    if (body.slug && body.slug !== slug) {
      const conflicto = await prisma.post.findUnique({
        where: { slug: body.slug },
      });
      if (conflicto) {
        return NextResponse.json(
          { error: `Ya existe otro post con slug '${body.slug}'` },
          { status: 409 }
        );
      }
    }

    // Campos básicos
    const data: Record<string, unknown> = {};
    if (body.slug !== undefined) data.slug = body.slug;
    if (body.titulo !== undefined) data.titulo = body.titulo;
    if (body.descripcion !== undefined) data.descripcion = body.descripcion;
    if (body.contenido !== undefined) data.contenido = body.contenido;
    if (body.categoria !== undefined) data.categoria = body.categoria;
    if (body.keyword !== undefined) data.keyword = body.keyword;
    if (body.imagen !== undefined) data.imagen = body.imagen;
    if (body.fechaIso !== undefined) data.fechaIso = new Date(body.fechaIso);
    if (body.estado !== undefined) data.estado = body.estado;

    // Si vienen tags, reemplazar todos
    if (body.tags !== undefined) {
      // Eliminar tags actuales
      await prisma.postTag.deleteMany({ where: { postId: existe.id } });

      data.tags = {
        create: body.tags.map((t: { label: string; icon?: string }) => ({
          label: t.label,
          icon: t.icon || null,
        })),
      };
    }

    let imagenAntigua: string | null = null;
if (body.imagen !== undefined && body.imagen !== existe.imagen) {
  imagenAntigua = existe.imagen;
}

    const post = await prisma.post.update({
      where: { slug },
      data,
      include: { tags: true },
    });

    // Eliminar imagen anterior si cambió
if (imagenAntigua) {
  await reemplazarImagen(imagenAntigua, body.imagen);
}

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error en PUT /api/posts/[slug]:", error);
    return NextResponse.json(
      { error: "Error al actualizar el post" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/posts/[slug]
 * ────────────────────────
 * Elimina un post (cascade: borra tags y comentarios).
 * Solo admin.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.rol !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { slug } = await params;

    const existe = await prisma.post.findUnique({ where: { slug } });
    if (!existe) {
      return NextResponse.json(
        { error: "Post no encontrado" },
        { status: 404 }
      );
    }

    await prisma.post.delete({ where: { slug } });

// Eliminar imagen del disco
await eliminarImagenInterna(existe.imagen);

    return NextResponse.json({
      mensaje: "Post eliminado exitosamente",
      slug,
    });
  } catch (error) {
    console.error("Error en DELETE /api/posts/[slug]:", error);
    return NextResponse.json(
      { error: "Error al eliminar el post" },
      { status: 500 }
    );
  }
}