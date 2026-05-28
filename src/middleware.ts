import { auth } from "@/auth";
import { NextResponse } from "next/server";

/**
 * Middleware de protección de rutas.
 *
 * - /admin/* requiere sesión activa
 * - Si no hay sesión, redirige a /login
 */

export default auth((req) => {
  const isAuth = !!req.auth;
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  if (isAdminRoute && !isAuth) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }
});

/**
 * Configuración del matcher: qué rutas pasa por el middleware.
 * Excluimos archivos estáticos y API routes para performance.
 */
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets).*)"],
};