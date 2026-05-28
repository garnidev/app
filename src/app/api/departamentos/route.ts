import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/departamentos
 * ──────────────────────
 * Lista los 32 departamentos de Colombia con conteo de panaderías activas.
 *
 * Query params (opcionales):
 * - busqueda: string  → filtra por nombre (case-insensitive)
 * - ordenarPor: "nombre" | "panaderias"  → criterio de ordenación
 *
 * Respuesta:
 * {
 *   "departamentos": [
 *     {
 *       "id": "...",
 *       "slug": "antioquia",
 *       "nombre": "Antioquia",
 *       "imagen": "/assets/departamentos/antioquia.jpg",
 *       "coordsCentro": [-75.5, 7.0],
 *       "zoomNivel": 7,
 *       "totalPanaderias": 5
 *     }
 *   ],
 *   "total": 32
 * }
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const busqueda = searchParams.get("busqueda")?.trim() || "";
    const ordenarPor = searchParams.get("ordenarPor") || "nombre";

    const departamentos = await prisma.departamento.findMany({
      where: busqueda
        ? { nombre: { contains: busqueda, mode: "insensitive" } }
        : undefined,
      include: {
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
    });

    const departamentosFormateados = departamentos.map((d) => ({
      id: d.id,
      slug: d.slug,
      nombre: d.nombre,
      imagen: d.imagen,
      coordsCentro: [d.coordsLng, d.coordsLat] as [number, number],
      zoomNivel: d.zoomNivel,
      totalPanaderias: d._count.panaderias,
    }));

    return NextResponse.json({
      departamentos: departamentosFormateados,
      total: departamentos.length,
    });
  } catch (error) {
    console.error("Error en GET /api/departamentos:", error);
    return NextResponse.json(
      { error: "Error al obtener departamentos" },
      { status: 500 }
    );
  }
}