import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/departamentos/[slug]
 * ─────────────────────────────
 * Obtiene un departamento con sus ciudades y panaderías.
 *
 * Ejemplo:
 *   GET /api/departamentos/antioquia
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const departamento = await prisma.departamento.findUnique({
      where: { slug },
      include: {
        ciudades: {
          select: {
            id: true,
            slug: true,
            nombre: true,
            imagen: true,
            _count: {
              select: {
                panaderias: { where: { estado: "ACTIVA" } },
              },
            },
          },
          orderBy: { nombre: "asc" },
        },
        panaderias: {
          where: { estado: "ACTIVA" },
          include: {
            ciudad: { select: { nombre: true, slug: true } },
            productos: {
              select: {
                id: true,
                nombre: true,
                precio: true,
                imagen: true,
              },
            },
          },
          orderBy: { nombre: "asc" },
        },
      },
    });

    if (!departamento) {
      return NextResponse.json(
        { error: "Departamento no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: departamento.id,
      slug: departamento.slug,
      nombre: departamento.nombre,
      imagen: departamento.imagen,
      coordsCentro: [departamento.coordsLng, departamento.coordsLat] as [
        number,
        number,
      ],
      zoomNivel: departamento.zoomNivel,
      ciudades: departamento.ciudades.map((c) => ({
        id: c.id,
        slug: c.slug,
        nombre: c.nombre,
        imagen: c.imagen,
        totalPanaderias: c._count.panaderias,
      })),
      panaderias: departamento.panaderias.map((p) => ({
        id: p.id,
        nombre: p.nombre,
        descripcionCorta: p.descripcionCorta,
        telefono: p.telefono,
        direccion: p.direccion,
        imagen: p.imagen,
        coords: [p.coordsLng, p.coordsLat] as [number, number],
        ciudad: p.ciudad,
        productos: p.productos,
      })),
      totalPanaderias: departamento.panaderias.length,
      totalCiudades: departamento.ciudades.length,
    });
  } catch (error) {
    console.error("Error en GET /api/departamentos/[slug]:", error);
    return NextResponse.json(
      { error: "Error al obtener el departamento" },
      { status: 500 }
    );
  }
}