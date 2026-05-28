import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { reemplazarImagen, eliminarImagenInterna } from "@/lib/imageStorage";

/**
 * PUT /api/productos/[id]
 * ───────────────────────
 * Actualiza un producto. Solo admin.
 *
 * Body (JSON): cualquier campo del producto (todos opcionales)
 * {
 *   "nombre": "...",
 *   "precio": 12000,
 *   "imagen": "/assets/..."
 * }
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

    // Verificar que existe
    const existe = await prisma.producto.findUnique({ where: { id } });
    if (!existe) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    // Construir datos a actualizar
    const data: Record<string, unknown> = {};

    if (body.nombre !== undefined) {
      if (!body.nombre.trim()) {
        return NextResponse.json(
          { error: "El nombre no puede estar vacío" },
          { status: 400 }
        );
      }
      data.nombre = body.nombre.trim();
    }

    if (body.precio !== undefined) {
      if (typeof body.precio !== "number" || body.precio < 0) {
        return NextResponse.json(
          { error: "El precio debe ser un número entero positivo" },
          { status: 400 }
        );
      }
      data.precio = Math.round(body.precio);
    }

    let imagenAntigua: string | null = null;
if (body.imagen !== undefined) {
  if (!body.imagen.trim()) {
    return NextResponse.json(
      { error: "La imagen no puede estar vacía" },
      { status: 400 }
    );
  }
  if (body.imagen !== existe.imagen) {
    imagenAntigua = existe.imagen;
  }
  data.imagen = body.imagen;
}

    const producto = await prisma.producto.update({
      where: { id },
      data,
    });

    // Eliminar imagen anterior si cambió
if (imagenAntigua) {
  await reemplazarImagen(imagenAntigua, body.imagen);
}

    return NextResponse.json(producto);
  } catch (error) {
    console.error("Error en PUT /api/productos/[id]:", error);
    return NextResponse.json(
      { error: "Error al actualizar el producto" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/productos/[id]
 * ──────────────────────────
 * Elimina un producto permanentemente. Solo admin.
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

    const existe = await prisma.producto.findUnique({ where: { id } });
    if (!existe) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    await prisma.producto.delete({ where: { id } });

// Eliminar la imagen del producto del disco
await eliminarImagenInterna(existe.imagen);

    return NextResponse.json({
      mensaje: "Producto eliminado exitosamente",
      id,
    });
  } catch (error) {
    console.error("Error en DELETE /api/productos/[id]:", error);
    return NextResponse.json(
      { error: "Error al eliminar el producto" },
      { status: 500 }
    );
  }
}