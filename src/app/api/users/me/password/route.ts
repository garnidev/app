import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { compare, hash } from "bcryptjs";

/**
 * PUT /api/users/me/password
 * ──────────────────────────
 * Cambia la contraseña del usuario logueado.
 *
 * Body (JSON):
 * {
 *   "passwordActual": "...",
 *   "passwordNueva": "..."
 * }
 *
 * Validaciones:
 * - passwordActual debe coincidir con la actual en BD
 * - passwordNueva debe tener al menos 8 caracteres
 */
export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();

    if (!body.passwordActual || !body.passwordNueva) {
      return NextResponse.json(
        { error: "Debes proporcionar la contraseña actual y la nueva" },
        { status: 400 },
      );
    }

    if (body.passwordNueva.length < 8) {
      return NextResponse.json(
        { error: "La nueva contraseña debe tener al menos 8 caracteres" },
        { status: 400 },
      );
    }

    if (body.passwordActual === body.passwordNueva) {
      return NextResponse.json(
        { error: "La nueva contraseña debe ser diferente a la actual" },
        { status: 400 },
      );
    }

    // Cargar usuario con su hash actual
    const usuario = await prisma.usuario.findUnique({
      where: { id: session.user.id },
    });

    if (!usuario?.passwordHash) {
      return NextResponse.json(
        { error: "Usuario sin contraseña configurada" },
        { status: 400 },
      );
    }

    // Verificar contraseña actual
    const passwordCorrecta = await compare(
      body.passwordActual,
      usuario.passwordHash,
    );

    if (!passwordCorrecta) {
      return NextResponse.json(
        { error: "La contraseña actual es incorrecta" },
        { status: 400 },
      );
    }

    // Hash de la nueva contraseña
    const nuevoHash = await hash(body.passwordNueva, 10);

    await prisma.usuario.update({
      where: { id: session.user.id },
      data: { passwordHash: nuevoHash },
    });

    return NextResponse.json({ mensaje: "Contraseña actualizada exitosamente" });
  } catch (error) {
    console.error("Error en PUT /api/users/me/password:", error);
    return NextResponse.json(
      { error: "Error al cambiar la contraseña" },
      { status: 500 },
    );
  }
}