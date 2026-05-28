import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/ciudades
 * ─────────────────
 * Lista las ciudades con su departamento y conteo de panaderías activas.
 *
 * Query params (opcionales):
 * - busqueda: string         → filtra por nombre de ciudad (case-insensitive)
 * - departamento: string     → filtra por slug del departamento
 * - ordenarPor: "nombre" | "panaderias"  → criterio de ordenación
 * - limit: number            → cantidad por página (default: 1000 = todas)
 * - offset: number           → para paginación (default: 0)
 *
 * Respuesta:
 * {
 *   "ciudades": [...],
 *   "total": 1022,
 *   "limit": 30,
 *   "offset": 0
 * }
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const busqueda = searchParams.get("busqueda")?.trim() || "";
    const departamento = searchParams.get("departamento")?.trim() || "";
    const ordenarPor = searchParams.get("ordenarPor") || "nombre";
    const limit = parseInt(searchParams.get("limit") || "1000", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    // Construir el filtro dinámico
    const where: {
      nombre?: { contains: string; mode: "insensitive" };
      departamento?: { slug: string };
    } = {};

    if (busqueda) {
      where.nombre = { contains: busqueda, mode: "insensitive" };
    }

    if (departamento) {
      where.departamento = { slug: departamento };
    }

    // Ejecutar query y conteo en paralelo
    const [ciudades, total] = await Promise.all([
      prisma.ciudad.findMany({
        where,
        include: {
          departamento: {
            select: { slug: true, nombre: true },
          },
          _count: {
            select: {
              panaderias: { where: { estado: "ACTIVA" } },
            },
          },
        },
        orderBy:
          ordenarPor === "panaderias"
            ? { panaderias: { _count: "desc" } }
            : { nombre: "asc" },
        take: limit,
        skip: offset,
      }),
      prisma.ciudad.count({ where }),
    ]);

    const ciudadesFormateadas = ciudades.map((c) => ({
      id: c.id,
      slug: c.slug,
      nombre: c.nombre,
      imagen: c.imagen,
      departamento: c.departamento,
      totalPanaderias: c._count.panaderias,
    }));

    return NextResponse.json({
      ciudades: ciudadesFormateadas,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error en GET /api/ciudades:", error);
    return NextResponse.json(
      { error: "Error al obtener ciudades" },
      { status: 500 }
    );
  }
}