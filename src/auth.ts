import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/auth.config";

/**
 * Configuración completa de Auth.js v5 (Node Runtime).
 * Se usa en API routes, Server Components y Server Actions.
 * NO importable desde middleware (incluye Prisma + bcryptjs).
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,

  adapter: PrismaAdapter(prisma),

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

        const usuario = await prisma.usuario.findUnique({
          where: { email: credentials.email as string },
        });

        if (!usuario || !usuario.passwordHash) {
          return null;
        }

        const passwordCorrecta = await compare(
          credentials.password as string,
          usuario.passwordHash,
        );

        if (!passwordCorrecta) {
          return null;
        }

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
});