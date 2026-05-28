import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { subirImagenBlob } from "@/lib/blobStorage";

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

    // Avatares con límite de 1MB
    const resultado = await subirImagenBlob(file, "avatares", 1 * 1024 * 1024);
    return NextResponse.json(resultado);
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error al subir el avatar";
    console.error("Error en POST /api/upload/avatares:", error);
    return NextResponse.json({ error: mensaje }, { status: 500 });
  }
}