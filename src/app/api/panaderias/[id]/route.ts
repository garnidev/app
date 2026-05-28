import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { reemplazarImagen, eliminarImagenes } from "@/lib/imageStorage";

/**
 * GET /api/panaderias/[id]
 * ────────────────────────
 * Obtiene el detalle de una panadería con todas sus relaciones.
 *
 * Acepta tanto cuid (ID) como slug en el futuro.
 *
 * Ejemplo:
 *   GET /api/panaderias/cmxxxxxxxxxx
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const panaderia = await prisma.panaderia.findUnique({
      where: { id },
      include: {
        ciudad: {
          select: { nombre: true, slug: true },
        },
        departamento: {
          select: { nombre: true, slug: true },
        },
        productos: {
          select: {
            id: true,
            nombre: true,
            precio: true,
            imagen: true,
          },
          orderBy: { creadoEn: "asc" },
        },
      },
    });

    if (!panaderia) {
      return NextResponse.json(
        { error: "Panadería no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: panaderia.id,
      nombre: panaderia.nombre,
      descripcionCorta: panaderia.descripcionCorta,
      telefono: panaderia.telefono,
      email: panaderia.email,
      direccion: panaderia.direccion,
      urlGoogleMaps: panaderia.urlGoogleMaps,
      imagen: panaderia.imagen,
      horario: panaderia.horario,
      imagenesCarrusel: panaderia.imagenesCarrusel,
      coords: [panaderia.coordsLng, panaderia.coordsLat] as [number, number],
      ciudad: panaderia.ciudad,
      departamento: panaderia.departamento,
      productos: panaderia.productos,
      estado: panaderia.estado,
      creadoEn: panaderia.creadoEn,
      actualizadoEn: panaderia.actualizadoEn,
    });
  } catch (error) {
    console.error("Error en GET /api/panaderias/[id]:", error);
    return NextResponse.json(
      { error: "Error al obtener la panadería" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/panaderias/[id]
 * ────────────────────────
 * Actualiza una panadería existente. Solo admin.
 *
 * Body (JSON, todos opcionales):
 * {
 *   "nombre": "...",
 *   "descripcionCorta": "...",
 *   "telefono": "...",
 *   "email": "...",
 *   "direccion": "...",
 *   "urlGoogleMaps": "...",
 *   "imagen": "...",
 *   "horario": "...",
 *   "imagenesCarrusel": [...],
 *   "coords": [lng, lat],
 *   "ciudadSlug": "...",
 *   "departamentoSlug": "...",
 *   "estado": "ACTIVA" | "PENDIENTE" | "INACTIVA" | "RECHAZADA"
 * }
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar sesión admin
    const session = await auth();
    if (!session || session.user.rol !== "ADMIN") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Verificar que la panadería existe
    const existe = await prisma.panaderia.findUnique({ where: { id } });
    if (!existe) {
      return NextResponse.json(
        { error: "Panadería no encontrada" },
        { status: 404 }
      );
    }

    // Resolver slugs a IDs si vienen
    let ciudadId: string | undefined;
    let departamentoId: string | undefined;

    if (body.ciudadSlug) {
      const ciudad = await prisma.ciudad.findUnique({
        where: { slug: body.ciudadSlug },
      });
      if (!ciudad) {
        return NextResponse.json(
          { error: `Ciudad con slug '${body.ciudadSlug}' no existe` },
          { status: 400 }
        );
      }
      ciudadId = ciudad.id;
    }

    if (body.departamentoSlug) {
      const depto = await prisma.departamento.findUnique({
        where: { slug: body.departamentoSlug },
      });
      if (!depto) {
        return NextResponse.json(
          { error: `Departamento con slug '${body.departamentoSlug}' no existe` },
          { status: 400 }
        );
      }
      departamentoId = depto.id;
    }

    // Capturar imágenes antiguas si van a cambiar
let imagenAntigua: string | null = null;
let carruselAntiguo: string[] = [];

if (body.imagen !== undefined && body.imagen !== existe.imagen) {
  imagenAntigua = existe.imagen;
}

if (
  body.imagenesCarrusel !== undefined &&
  JSON.stringify(body.imagenesCarrusel) !== JSON.stringify(existe.imagenesCarrusel)
) {
  // Encontrar las que se eliminaron del carrusel
  const nuevasUrls = new Set<string>(body.imagenesCarrusel);
  carruselAntiguo = existe.imagenesCarrusel.filter(
    (url) => !nuevasUrls.has(url),
  );
}

    // Construir el objeto de actualización (solo campos presentes)
    const data: Record<string, unknown> = {};
    if (body.nombre !== undefined) data.nombre = body.nombre;
    if (body.descripcionCorta !== undefined) data.descripcionCorta = body.descripcionCorta;
    if (body.telefono !== undefined) data.telefono = body.telefono;
    if (body.email !== undefined) data.email = body.email;
    if (body.direccion !== undefined) data.direccion = body.direccion;
    if (body.urlGoogleMaps !== undefined) data.urlGoogleMaps = body.urlGoogleMaps;
    if (body.imagen !== undefined) data.imagen = body.imagen;
    if (body.horario !== undefined) data.horario = body.horario;
    if (body.imagenesCarrusel !== undefined) data.imagenesCarrusel = body.imagenesCarrusel;
    if (body.estado !== undefined) data.estado = body.estado;
    if (body.coords !== undefined) {
      data.coordsLng = body.coords[0];
      data.coordsLat = body.coords[1];
    }
    if (ciudadId) data.ciudadId = ciudadId;
    if (departamentoId) data.departamentoId = departamentoId;

    // Actualizar
    const panaderia = await prisma.panaderia.update({
      where: { id },
      data,
      include: {
        ciudad: { select: { nombre: true, slug: true } },
        departamento: { select: { nombre: true, slug: true } },
        productos: true,
      },
    });

    // Eliminar imágenes antiguas que ya no se usan
if (imagenAntigua) {
  await reemplazarImagen(imagenAntigua, body.imagen);
}
if (carruselAntiguo.length > 0) {
  await eliminarImagenes(carruselAntiguo);
}

    return NextResponse.json({
      ...panaderia,
      coords: [panaderia.coordsLng, panaderia.coordsLat] as [number, number],
    });
  } catch (error) {
    console.error("Error en PUT /api/panaderias/[id]:", error);
    return NextResponse.json(
      { error: "Error al actualizar la panadería" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/panaderias/[id]
 * ───────────────────────────
 * Elimina una panadería (junto con sus productos por cascade).
 * Solo admin.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar sesión admin
    const session = await auth();
    if (!session || session.user.rol !== "ADMIN") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Verificar que existe
    const existe = await prisma.panaderia.findUnique({ where: { id } });
    if (!existe) {
      return NextResponse.json(
        { error: "Panadería no encontrada" },
        { status: 404 }
      );
    }

    // Obtener productos antes de eliminar (para borrar sus imágenes)
const productos = await prisma.producto.findMany({
  where: { panaderiaId: id },
  select: { imagen: true },
});

// Eliminar de la BD (productos en cascada)
await prisma.panaderia.delete({ where: { id } });

// Eliminar archivos del disco
await eliminarImagenes([
  existe.imagen,
  ...existe.imagenesCarrusel,
  ...productos.map((p) => p.imagen),
]);

    return NextResponse.json({
      mensaje: "Panadería eliminada exitosamente",
      id,
    });
  } catch (error) {
    console.error("Error en DELETE /api/panaderias/[id]:", error);
    return NextResponse.json(
      { error: "Error al eliminar la panadería" },
      { status: 500 }
    );
  }
}