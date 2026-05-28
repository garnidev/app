import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { reemplazarImagen } from "@/lib/imageStorage";

/**
 * Helper: convierte un texto a slug
 */
function toSlug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[ñ]/g, "n")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Helper: detecta si el identificador es un cuid (ID de Prisma) o un slug.
 * Los cuid empiezan con "c" y tienen al menos 20 caracteres alfanuméricos.
 */
function esCuid(valor: string): boolean {
  return /^c[a-z0-9]{20,}$/i.test(valor);
}

/**
 * Helper: busca una ciudad por id o slug indistintamente.
 */
async function buscarCiudad(identificador: string) {
  if (esCuid(identificador)) {
    return prisma.ciudad.findUnique({ where: { id: identificador } });
  }
  return prisma.ciudad.findUnique({ where: { slug: identificador } });
}

/**
 * GET /api/ciudades/[id]
 * ──────────────────────
 * Obtiene una ciudad por id o slug.
 *
 * Si el identificador es un cuid → busca por id (sin panaderías, modo admin)
 * Si el identificador es un slug → busca por slug (con panaderías, modo público)
 *
 * Ejemplos:
 *   GET /api/ciudades/pereira              → modo público (incluye panaderías)
 *   GET /api/ciudades/cm234jklfg8djsk2     → modo admin (sin panaderías)
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const modoAdmin = esCuid(id);

    if (modoAdmin) {
      // Modo admin: incluye conteo, no las panaderías completas
      const ciudad = await prisma.ciudad.findUnique({
        where: { id },
        include: {
          departamento: { select: { slug: true, nombre: true } },
          _count: {
            select: {
              panaderias: { where: { estado: "ACTIVA" } },
            },
          },
        },
      });

      if (!ciudad) {
        return NextResponse.json(
          { error: "Ciudad no encontrada" },
          { status: 404 },
        );
      }

      return NextResponse.json({
        id: ciudad.id,
        slug: ciudad.slug,
        nombre: ciudad.nombre,
        imagen: ciudad.imagen,
        departamento: ciudad.departamento,
        totalPanaderias: ciudad._count.panaderias,
      });
    }

    // Modo público: incluye panaderías completas
    const ciudad = await prisma.ciudad.findUnique({
      where: { slug: id },
      include: {
        departamento: {
          select: {
            id: true,
            slug: true,
            nombre: true,
            imagen: true,
          },
        },
        panaderias: {
          where: { estado: "ACTIVA" },
          include: {
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

    if (!ciudad) {
      return NextResponse.json(
        { error: "Ciudad no encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      id: ciudad.id,
      slug: ciudad.slug,
      nombre: ciudad.nombre,
      imagen: ciudad.imagen,
      departamento: ciudad.departamento,
      panaderias: ciudad.panaderias.map((p) => ({
        id: p.id,
        nombre: p.nombre,
        descripcionCorta: p.descripcionCorta,
        telefono: p.telefono,
        direccion: p.direccion,
        imagen: p.imagen,
        horario: p.horario,
        coords: [p.coordsLng, p.coordsLat] as [number, number],
        productos: p.productos,
      })),
      totalPanaderias: ciudad.panaderias.length,
    });
  } catch (error) {
    console.error("Error en GET /api/ciudades/[id]:", error);
    return NextResponse.json(
      { error: "Error al obtener la ciudad" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/ciudades/[id]
 * ──────────────────────
 * Actualiza el nombre y/o imagen de una ciudad. Solo admin.
 *
 * Acepta tanto id como slug en la URL.
 *
 * Body (JSON, todos opcionales):
 * {
 *   "nombre": "Nuevo nombre",      // regenera slug automáticamente
 *   "imagen": "/assets/..."
 * }
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Verificar sesión admin
    const session = await auth();
    if (!session || session.user.rol !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Buscar la ciudad (acepta id o slug)
    const existe = await buscarCiudad(id);
    if (!existe) {
      return NextResponse.json(
        { error: "Ciudad no encontrada" },
        { status: 404 },
      );
    }

    // Construir datos a actualizar
    const data: Record<string, unknown> = {};

    if (body.nombre !== undefined) {
      if (!body.nombre.trim()) {
        return NextResponse.json(
          { error: "El nombre no puede estar vacío" },
          { status: 400 },
        );
      }

      const nombreLimpio = body.nombre.trim();
      data.nombre = nombreLimpio;

      // Regenerar slug si cambió el nombre
      const nuevoSlug = toSlug(nombreLimpio);
      if (nuevoSlug !== existe.slug) {
        // Verificar que no haya otra ciudad con ese slug
        const conflicto = await prisma.ciudad.findUnique({
          where: { slug: nuevoSlug },
        });
        if (conflicto && conflicto.id !== existe.id) {
          return NextResponse.json(
            {
              error: `Ya existe una ciudad con el slug '${nuevoSlug}'. Cambia el nombre o usa otro.`,
            },
            { status: 400 },
          );
        }
        data.slug = nuevoSlug;
      }
    }

    let imagenAntigua: string | null = null;
if (body.imagen !== undefined) {
  if (!body.imagen.trim()) {
    return NextResponse.json(
      { error: "La imagen no puede estar vacía" },
      { status: 400 },
    );
  }
  if (body.imagen !== existe.imagen) {
    imagenAntigua = existe.imagen;
  }
  data.imagen = body.imagen;
}

    const ciudad = await prisma.ciudad.update({
      where: { id: existe.id },
      data,
      include: {
        departamento: { select: { slug: true, nombre: true } },
        _count: {
          select: {
            panaderias: { where: { estado: "ACTIVA" } },
          },
        },
      },
    });

    // Eliminar imagen anterior si cambió
if (imagenAntigua) {
  await reemplazarImagen(imagenAntigua, body.imagen);
}

    return NextResponse.json({
      id: ciudad.id,
      slug: ciudad.slug,
      nombre: ciudad.nombre,
      imagen: ciudad.imagen,
      departamento: ciudad.departamento,
      totalPanaderias: ciudad._count.panaderias,
    });
  } catch (error) {
    console.error("Error en PUT /api/ciudades/[id]:", error);
    return NextResponse.json(
      { error: "Error al actualizar la ciudad" },
      { status: 500 },
    );
  }
}