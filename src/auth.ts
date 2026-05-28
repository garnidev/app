import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { Rol } from "@prisma/client";

/**
 * Configuración central de Auth.js v5
 * ─────────────────────────────────────
 * - Provider: Credentials (email + password)
 * - Adapter: Prisma (usa nuestra BD PostgreSQL)
 * - Strategy: JWT (más simple, sin guardar sesiones en BD)
 */

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),

  session: { strategy: "jwt" },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  providers: [
    Credentials({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Buscar usuario por email
        const usuario = await prisma.usuario.findUnique({
          where: { email: credentials.email as string },
        });

        if (!usuario || !usuario.passwordHash) {
          return null;
        }

        // Verificar contraseña
        const passwordCorrecta = await compare(
          credentials.password as string,
          usuario.passwordHash
        );

        if (!passwordCorrecta) {
          return null;
        }

        // Retornar datos del usuario (van al JWT)
        return {
          id: usuario.id,
          email: usuario.email,
          name: usuario.nombre,
          image: usuario.imagen,
          rol: usuario.rol,
        };
      },
    }),
  ],

  callbacks: {
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
    session.user.rol = token.rol as Rol;
  }
  return session;
},
  },
});