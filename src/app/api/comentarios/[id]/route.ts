import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

/**
 * PUT /api/comentarios/[id]
 * ─────────────────────────
 * Moderar un comentario. Solo admin.
 *
 * Body (JSON):
 * {
 *   "estado": "APROBADO" | "RECHAZADO"
 * }
 *
 * Ejemplo:
 *   PUT /api/comentarios/cmxxx
 *   { "estado": "APROBADO" }
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.rol !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    if (
      !body.estado ||
      !["APROBADO", "RECHAZADO", "PENDIENTE"].includes(body.estado)
    ) {
      return NextResponse.json(
        { error: "estado debe ser: APROBADO, RECHAZADO o PENDIENTE" },
        { status: 400 }
      );
    }

    const existe = await prisma.comentario.findUnique({ where: { id } });
    if (!existe) {
      return NextResponse.json(
        { error: "Comentario no encontrado" },
        { status: 404 }
      );
    }

    const comentario = await prisma.comentario.update({
      where: { id },
      data: { estado: body.estado },
    });

    return NextResponse.json(comentario);
  } catch (error) {
    console.error("Error en PUT /api/comentarios/[id]:", error);
    return NextResponse.json(
      { error: "Error al moderar el comentario" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/comentarios/[id]
 * ────────────────────────────
 * Elimina un comentario permanentemente. Solo admin.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.rol !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;

    const existe = await prisma.comentario.findUnique({ where: { id } });
    if (!existe) {
      return NextResponse.json(
        { error: "Comentario no encontrado" },
        { status: 404 }
      );
    }

    await prisma.comentario.delete({ where: { id } });

    return NextResponse.json({
      mensaje: "Comentario eliminado exitosamente",
      id,
    });
  } catch (error) {
    console.error("Error en DELETE /api/comentarios/[id]:", error);
    return NextResponse.json(
      { error: "Error al eliminar el comentario" },
      { status: 500 }
    );
  }
}