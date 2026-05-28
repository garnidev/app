import type { NextAuthConfig } from "next-auth";

/**
 * Configuración compartida de Auth.js v5
 * ─────────────────────────────────────────
 * Este archivo es importable desde el middleware (Edge Runtime)
 * porque NO incluye Prisma ni bcryptjs (que son Node-only).
 *
 * La configuración con providers y adapter va en src/auth.ts.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: { strategy: "jwt" },

  callbacks: {
    /**
     * Determina si el usuario puede acceder a la ruta solicitada.
     * Se ejecuta en el middleware (Edge Runtime).
     */
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

      if (isAdminRoute) {
        // Si intenta entrar al admin sin sesión, bloquea
        return isLoggedIn;
      }

      // Resto de rutas: siempre permitidas
      return true;
    },

    /**
     * Se ejecuta al crear el JWT.
     * Agregamos info custom (rol) al token.
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.rol = user.rol;
      }
      return token;
    },

    /**
     * Se ejecuta al leer la sesión.
     * Expone los datos del token al cliente.
     */
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        // @ts-expect-error - rol viene del JWT custom
        session.user.rol = token.rol;
      }
      return session;
    },
  },

  // providers vacíos aquí; se completa en auth.ts con Credentials
  providers: [],
} satisfies NextAuthConfig;