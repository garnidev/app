import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

/**
 * Middleware de protección de rutas (Edge Runtime).
 *
 * Importa solo authConfig (sin Prisma ni bcryptjs), por lo que
 * el bundle se mantiene bajo el límite de 1 MB de Vercel.
 *
 * La lógica de autorización está en authConfig.callbacks.authorized.
 */
export const { auth: middleware } = NextAuth(authConfig);

export default middleware;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets).*)"],
};