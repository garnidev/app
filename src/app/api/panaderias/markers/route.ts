import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/panaderias/markers
 * ───────────────────────────
 * Devuelve datos MÍNIMOS de panaderías activas, optimizado para
 * renderizar markers en el mapa.
 *
 * Payload por panadería: ~100 bytes (vs ~1KB del endpoint completo)
 * → 90% más liviano para casos de cientos/miles de panaderías
 *
 * Respuesta:
 * {
 *   "markers": [
 *     {
 *       "id": "cm...",
 *       "nombre": "Tostipan",
 *       "coords": [-75.69, 4.81],
 *       "ciudad": "Pereira",
 *       "departamento": "Risaralda"
 *     }
 *   ],
 *   "total": 50
 * }
 */
export async function GET() {
  try {
    const markers = await prisma.panaderia.findMany({
      where: { estado: "ACTIVA" },
      select: {
        id: true,
        nombre: true,
        coordsLng: true,
        coordsLat: true,
        ciudad: {
          select: { nombre: true, slug: true },
        },
        departamento: {
          select: { nombre: true, slug: true },
        },
      },
      orderBy: { nombre: "asc" },
    });

    const markersFormateados = markers.map((m) => ({
      id: m.id,
      nombre: m.nombre,
      coords: [m.coordsLng, m.coordsLat] as [number, number],
      ciudad: m.ciudad.nombre,
      ciudadSlug: m.ciudad.slug,
      departamento: m.departamento.nombre,
      departamentoSlug: m.departamento.slug,
    }));

    return NextResponse.json({
      markers: markersFormateados,
      total: markers.length,
    });
  } catch (error) {
    console.error("Error en GET /api/panaderias/markers:", error);
    return NextResponse.json(
      { error: "Error al obtener markers" },
      { status: 500 }
    );
  }
}