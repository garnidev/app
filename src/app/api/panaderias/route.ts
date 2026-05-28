import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";

/**
 * GET /api/panaderias
 * ────────────────────
 * Lista panaderías con filtros opcionales.
 *
 * Query params:
 * - busqueda: string  → busca por nombre o ciudad (case-insensitive)
 * - departamento: string  → filtra por slug del departamento
 * - ciudad: string  → filtra por slug de la ciudad
 * - estado: "ACTIVA" | "PENDIENTE" | "INACTIVA" | "RECHAZADA"  (default: "ACTIVA")
 * - limit: number  → cantidad por página (default: 100)
 * - offset: number  → paginación (default: 0)
 *
 * Ejemplos:
 *   GET /api/panaderias
 *   GET /api/panaderias?busqueda=tostipan
 *   GET /api/panaderias?departamento=risaralda
 *   GET /api/panaderias?ciudad=pereira&estado=ACTIVA
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Leer query params
    const busqueda = searchParams.get("busqueda")?.trim() || "";
    const departamento = searchParams.get("departamento")?.trim() || "";
    const ciudad = searchParams.get("ciudad")?.trim() || "";
    const estado = searchParams.get("estado")?.toUpperCase() || "ACTIVA";
    const limit = parseInt(searchParams.get("limit") || "100", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    // Construir el filtro dinámico de Prisma
    const where: Prisma.PanaderiaWhereInput = {
      estado: estado as "ACTIVA" | "PENDIENTE" | "INACTIVA" | "RECHAZADA",
    };

    // Filtro por búsqueda (nombre O ciudad)
    if (busqueda) {
      where.OR = [
        { nombre: { contains: busqueda, mode: "insensitive" } },
        { ciudad: { nombre: { contains: busqueda, mode: "insensitive" } } },
      ];
    }

    // Filtro por departamento (slug)
    if (departamento) {
      where.departamento = { slug: departamento };
    }

    // Filtro por ciudad (slug)
    if (ciudad) {
      where.ciudad = { slug: ciudad };
    }

    // Ejecutar query con relaciones
    const [panaderias, total] = await Promise.all([
      prisma.panaderia.findMany({
        where,
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
          },
        },
        orderBy: { nombre: "asc" },
        take: limit,
        skip: offset,
      }),
      prisma.panaderia.count({ where }),
    ]);

    // Transformar coords separados a array [lng, lat] (formato Mapbox)
    const panaderiasFormateadas = panaderias.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      descripcionCorta: p.descripcionCorta,
      telefono: p.telefono,
      email: p.email,
      direccion: p.direccion,
      urlGoogleMaps: p.urlGoogleMaps,
      imagen: p.imagen,
      horario: p.horario,
      imagenesCarrusel: p.imagenesCarrusel,
      coords: [p.coordsLng, p.coordsLat] as [number, number],
      ciudad: p.ciudad,
      departamento: p.departamento,
      productos: p.productos,
      estado: p.estado,
      creadoEn: p.creadoEn,
    }));

    return NextResponse.json({
      panaderias: panaderiasFormateadas,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error en GET /api/panaderias:", error);
    return NextResponse.json(
      { error: "Error al obtener panaderías" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/panaderias
 * ────────────────────
 * Crea una nueva panadería. Solo admin.
 *
 * Body (JSON):
 * {
 *   "nombre": "Nueva Panadería",       // requerido
 *   "descripcionCorta": "...",          // requerido
 *   "telefono": "+57 ...",              // requerido
 *   "email": "...",                     // opcional
 *   "direccion": "...",                 // requerido
 *   "urlGoogleMaps": "...",             // requerido
 *   "imagen": "/assets/...",            // requerido
 *   "horario": "...",                   // requerido
 *   "imagenesCarrusel": [...],          // opcional, default []
 *   "coords": [lng, lat],               // requerido
 *   "ciudadSlug": "pereira",            // requerido
 *   "departamentoSlug": "risaralda",    // requerido
 *   "estado": "ACTIVA",                 // opcional, default ACTIVA
 *   "productos": [                      // opcional
 *     { "nombre": "...", "precio": 10000, "imagen": "..." }
 *   ]
 * }
 */
export async function POST(request: Request) {
  try {
    // Verificar sesión admin
    const session = await auth();
    if (!session || session.user.rol !== "ADMIN") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validación de campos requeridos
    const requeridos = [
      "nombre", "descripcionCorta", "telefono", "direccion",
      "urlGoogleMaps", "imagen", "horario", "coords",
      "ciudadSlug", "departamentoSlug",
    ];
    for (const campo of requeridos) {
      if (!body[campo]) {
        return NextResponse.json(
          { error: `Campo requerido: ${campo}` },
          { status: 400 }
        );
      }
    }

    // Validar coords
    if (!Array.isArray(body.coords) || body.coords.length !== 2) {
      return NextResponse.json(
        { error: "coords debe ser un array [lng, lat]" },
        { status: 400 }
      );
    }

    // Resolver slugs a IDs
    const [ciudad, departamento] = await Promise.all([
      prisma.ciudad.findUnique({ where: { slug: body.ciudadSlug } }),
      prisma.departamento.findUnique({ where: { slug: body.departamentoSlug } }),
    ]);

    if (!ciudad) {
      return NextResponse.json(
        { error: `Ciudad con slug '${body.ciudadSlug}' no existe` },
        { status: 400 }
      );
    }

    if (!departamento) {
      return NextResponse.json(
        { error: `Departamento con slug '${body.departamentoSlug}' no existe` },
        { status: 400 }
      );
    }

    // Crear la panadería
    const panaderia = await prisma.panaderia.create({
      data: {
        nombre: body.nombre,
        descripcionCorta: body.descripcionCorta,
        telefono: body.telefono,
        email: body.email || null,
        direccion: body.direccion,
        urlGoogleMaps: body.urlGoogleMaps,
        imagen: body.imagen,
        horario: body.horario,
        imagenesCarrusel: body.imagenesCarrusel || [],
        coordsLng: body.coords[0],
        coordsLat: body.coords[1],
        ciudadId: ciudad.id,
        departamentoId: departamento.id,
        estado: body.estado || "ACTIVA",
        productos: body.productos
          ? {
              create: body.productos.map((p: {
                nombre: string;
                precio: number;
                imagen: string;
              }) => ({
                nombre: p.nombre,
                precio: p.precio,
                imagen: p.imagen,
              })),
            }
          : undefined,
      },
      include: {
        ciudad: { select: { nombre: true, slug: true } },
        departamento: { select: { nombre: true, slug: true } },
        productos: true,
      },
    });

    return NextResponse.json(
      {
        ...panaderia,
        coords: [panaderia.coordsLng, panaderia.coordsLat] as [number, number],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en POST /api/panaderias:", error);
    return NextResponse.json(
      { error: "Error al crear la panadería" },
      { status: 500 }
    );
  }
}