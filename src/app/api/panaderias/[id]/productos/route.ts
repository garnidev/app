import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

/**
 * POST /api/panaderias/[id]/productos
 * ───────────────────────────────────
 * Crea un nuevo producto para una panadería. Solo admin.
 *
 * Body (JSON):
 * {
 *   "nombre": "Pan masa madre",   // requerido
 *   "precio": 10800,              // requerido (entero)
 *   "imagen": "/assets/..."       // requerido
 * }
 */
export async function POST(
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

    // Validar campos requeridos
    if (!body.nombre?.trim()) {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 }
      );
    }

    if (typeof body.precio !== "number" || body.precio < 0) {
      return NextResponse.json(
        { error: "El precio debe ser un número entero positivo" },
        { status: 400 }
      );
    }

    if (!body.imagen?.trim()) {
      return NextResponse.json(
        { error: "La imagen es obligatoria" },
        { status: 400 }
      );
    }

    // Verificar que la panadería existe
    const panaderia = await prisma.panaderia.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!panaderia) {
      return NextResponse.json(
        { error: "Panadería no encontrada" },
        { status: 404 }
      );
    }

    // Crear producto
    const producto = await prisma.producto.create({
      data: {
        nombre: body.nombre.trim(),
        precio: Math.round(body.precio), // forzar entero
        imagen: body.imagen,
        panaderiaId: id,
      },
    });

    return NextResponse.json(producto, { status: 201 });
  } catch (error) {
    console.error("Error en POST /api/panaderias/[id]/productos:", error);
    return NextResponse.json(
      { error: "Error al crear el producto" },
      { status: 500 }
    );
  }
}