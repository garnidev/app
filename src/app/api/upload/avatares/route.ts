import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

/**
 * POST /api/upload/avatares
 * ─────────────────────────
 * Sube una imagen de avatar para un usuario.
 *
 * Validaciones:
 * - Solo usuarios logueados
 * - Tipo: jpg, jpeg, png, webp
 * - Tamaño máximo: 1MB (más estricto para avatares)
 */

const MAX_SIZE = 1 * 1024 * 1024; // 1MB
const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No se envió ningún archivo" },
        { status: 400 },
      );
    }

    if (!TIPOS_PERMITIDOS.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Tipo no permitido. Solo se aceptan: ${TIPOS_PERMITIDOS.join(", ")}`,
        },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        {
          error: `Archivo demasiado grande. Máximo permitido: ${MAX_SIZE / 1024 / 1024}MB`,
        },
        { status: 400 },
      );
    }

    // Generar nombre único
    const timestamp = Date.now();
    const originalName = file.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9.]/g, "-")
      .replace(/-+/g, "-");

    const filename = `${timestamp}-${originalName}`;

    // Construir ruta destino
    const uploadDir = path.join(process.cwd(), "public", "assets", "avatares");
    const filepath = path.join(uploadDir, filename);

    await mkdir(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    const rutaPublica = `/assets/avatares/${filename}`;

    return NextResponse.json({
      url: rutaPublica,
      filename,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Error en POST /api/upload/avatares:", error);
    return NextResponse.json(
      { error: "Error al subir el avatar" },
      { status: 500 },
    );
  }
}