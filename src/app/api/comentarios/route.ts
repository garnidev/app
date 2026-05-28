import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

/**
 * GET /api/comentarios
 * ────────────────────
 * Lista TODOS los comentarios para moderación.
 * Solo admin.
 *
 * Query params:
 * - estado: "PENDIENTE" | "APROBADO" | "RECHAZADO"  → default PENDIENTE
 * - limit: number  → default 50
 * - offset: number → default 0
 *
 * Ejemplo:
 *   GET /api/comentarios?estado=PENDIENTE
 */
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user.rol !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const estado = searchParams.get("estado")?.toUpperCase() || "PENDIENTE";
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    const [comentarios, total] = await Promise.all([
      prisma.comentario.findMany({
        where: {
          estado: estado as "PENDIENTE" | "APROBADO" | "RECHAZADO",
        },
        include: {
          post: {
            select: {
              id: true,
              slug: true,
              titulo: true,
            },
          },
        },
        orderBy: { fecha: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.comentario.count({
        where: {
          estado: estado as "PENDIENTE" | "APROBADO" | "RECHAZADO",
        },
      }),
    ]);

    return NextResponse.json({
      comentarios,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error en GET /api/comentarios:", error);
    return NextResponse.json(
      { error: "Error al obtener comentarios" },
      { status: 500 }
    );
  }
}