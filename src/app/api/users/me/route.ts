import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { reemplazarImagen } from "@/lib/imageStorage";

/**
 * GET /api/users/me
 * ─────────────────
 * Obtiene los datos del usuario logueado.
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        nombre: true,
        email: true,
        imagen: true,
        rol: true,
        creadoEn: true,
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(usuario);
  } catch (error) {
    console.error("Error en GET /api/users/me:", error);
    return NextResponse.json(
      { error: "Error al obtener el usuario" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/users/me
 * ─────────────────
 * Actualiza nombre y/o imagen del usuario logueado.
 *
 * Body (JSON):
 * {
 *   "nombre": "Nuevo nombre",
 *   "imagen": "/assets/avatares/123-abc.jpg"
 * }
 */
export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();

    // Cargar usuario actual (para gestión de imagen)
    const existe = await prisma.usuario.findUnique({
      where: { id: session.user.id },
    });

    if (!existe) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    // Construir datos a actualizar
    const data: Record<string, unknown> = {};
    let imagenAntigua: string | null = null;

    if (body.nombre !== undefined) {
      if (!body.nombre.trim()) {
        return NextResponse.json(
          { error: "El nombre no puede estar vacío" },
          { status: 400 },
        );
      }
      data.nombre = body.nombre.trim();
    }

    if (body.imagen !== undefined) {
      if (body.imagen !== existe.imagen && existe.imagen) {
        imagenAntigua = existe.imagen;
      }
      data.imagen = body.imagen;
    }

    const usuario = await prisma.usuario.update({
      where: { id: session.user.id },
      data,
      select: {
        id: true,
        nombre: true,
        email: true,
        imagen: true,
        rol: true,
      },
    });

    // Eliminar imagen anterior si cambió
    if (imagenAntigua) {
      await reemplazarImagen(imagenAntigua, body.imagen);
    }

    return NextResponse.json(usuario);
  } catch (error) {
    console.error("Error en PUT /api/users/me:", error);
    return NextResponse.json(
      { error: "Error al actualizar el usuario" },
      { status: 500 },
    );
  }
}