/**
 * ═══════════════════════════════════════════════════════════════════════
 *  AUTH HELPERS — Conectado a NextAuth + Prisma
 * ─────────────────────────────────────────────────────────────────────
 *  Devuelve el usuario actualmente autenticado consultando la BD a
 *  través de la sesión de NextAuth (Auth.js v5).
 * ═══════════════════════════════════════════════════════════════════════
 */

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { Rol as RolPrisma } from "@prisma/client";

/* ─── Tipos del frontend ──────────────────────────────────────── */

export type Rol = "admin" | "panaderia" | "ciudadano";

export type Usuario = {
  id: string;
  nombre: string;
  email: string;
  avatar: string;
  rol: Rol;
  /** Solo aplica si rol === "panaderia" */
  panaderiaId?: string;
};

export const ROL_LABEL: Record<Rol, string> = {
  admin: "Administrador",
  panaderia: "Panadería aliada",
  ciudadano: "Usuario",
};

/* ─── Adaptadores backend ↔ frontend ───────────────────────────── */

const ROL_BACKEND_A_FRONTEND: Record<RolPrisma, Rol> = {
  ADMIN: "admin",
  PANADERIA: "panaderia",
  CIUDADANO: "ciudadano",
};

const AVATAR_DEFAULT = "/assets/avatares/avatar-default.jpg";

/* ─── Usuario fallback (cuando no hay sesión) ─────────────────── */

const USUARIO_FALLBACK: Usuario = {
  id: "anon",
  nombre: "Invitado",
  email: "",
  avatar: AVATAR_DEFAULT,
  rol: "ciudadano",
};

/* ─── API pública ──────────────────────────────────────────────── */

/**
 * Devuelve el usuario actualmente autenticado.
 * Consulta NextAuth (sesión) + Prisma (datos completos).
 *
 * Si no hay sesión, devuelve un usuario "Invitado" para mantener
 * la API estable sin lanzar errores. Usa este helper en Server Components.
 */
export async function getCurrentUser(): Promise<Usuario> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return USUARIO_FALLBACK;
    }

    // Consultar datos completos en BD
    const usuario = await prisma.usuario.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        nombre: true,
        email: true,
        imagen: true,
        rol: true,
        panaderia: { select: { id: true } },
      },
    });

    if (!usuario) {
      return USUARIO_FALLBACK;
    }

    return {
      id: usuario.id,
      nombre: usuario.nombre || usuario.email.split("@")[0] || "Usuario",
      email: usuario.email,
      avatar: usuario.imagen || AVATAR_DEFAULT,
      rol: ROL_BACKEND_A_FRONTEND[usuario.rol] ?? "ciudadano",
      panaderiaId: usuario.panaderia?.id,
    };
  } catch (error) {
    console.error("Error en getCurrentUser:", error);
    return USUARIO_FALLBACK;
  }
}

/** Comprueba si el usuario actual tiene alguno de los roles permitidos */
export async function tieneRol(...rolesPermitidos: Rol[]): Promise<boolean> {
  const usuario = await getCurrentUser();
  return rolesPermitidos.includes(usuario.rol);
}