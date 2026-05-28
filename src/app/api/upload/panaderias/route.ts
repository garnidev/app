import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

/**
 * POST /api/upload/panaderias
 * ───────────────────────────
 * Sube una imagen al servidor para usarla en panaderías o productos.
 *
 * Body: FormData con un campo "file" (la imagen)
 *
 * Validaciones:
 * - Solo admin puede subir
 * - Tipo: jpg, jpeg, png, webp
 * - Tamaño máximo: 2MB
 *
 * La imagen se guarda en /public/assets/panaderias/[timestamp]-[slug].[ext]
 * Devuelve la ruta pública: /assets/panaderias/[archivo]
 */

const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: Request) {
  try {
    // Verificar sesión admin
    const session = await auth();
    if (!session || session.user.rol !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Leer FormData
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No se envió ningún archivo" },
        { status: 400 }
      );
    }

    // Validar tipo
    if (!TIPOS_PERMITIDOS.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Tipo no permitido. Solo se aceptan: ${TIPOS_PERMITIDOS.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Validar tamaño
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        {
          error: `Archivo demasiado grande. Máximo permitido: ${MAX_SIZE / 1024 / 1024}MB`,
        },
        { status: 400 }
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
    const uploadDir = path.join(process.cwd(), "public", "assets", "panaderias");
    const filepath = path.join(uploadDir, filename);

    // Crear carpeta si no existe
    await mkdir(uploadDir, { recursive: true });

    // Convertir File a Buffer y guardar
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Devolver la ruta pública
    const rutaPublica = `/assets/panaderias/${filename}`;

    return NextResponse.json({
      url: rutaPublica,
      filename,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Error en POST /api/upload/panaderias:", error);
    return NextResponse.json(
      { error: "Error al subir la imagen" },
      { status: 500 }
    );
  }
}