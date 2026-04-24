/**
 * ═══════════════════════════════════════════════════════════════════════
 *  AUTH MOCK
 * ─────────────────────────────────────────────────────────────────────
 *  Por ahora no hay backend real. Este archivo simula la sesión del
 *  usuario actual. Cuando se integre autenticación real (NextAuth,
 *  Supabase, Clerk, o backend propio), basta con reemplazar la función
 *  getCurrentUser() por la consulta real al provider de auth.
 * ═══════════════════════════════════════════════════════════════════════
 */

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

/**
 * Etiquetas legibles por rol (para mostrar en UI).
 * Centralizado aquí para mantener consistencia en toda la app.
 */
export const ROL_LABEL: Record<Rol, string> = {
  admin: "Administrador",
  panaderia: "Panadería aliada",
  ciudadano: "Usuario",
};

/* ─── Usuario mock actual ──────────────────────────────────────────
   Cambiar estos datos para simular distintos usuarios durante desarrollo.
   TODO: cuando haya backend, reemplazar por query real a la sesión.
   ──────────────────────────────────────────────────────────────── */
const USUARIO_MOCK: Usuario = {
  id: "u-001",
  nombre: "Nombre Admin",
  email: "admin@masamadre.sena.edu.co",
  avatar: "/assets/admin/avatar-admin.jpg",
  rol: "admin",
};

/** Devuelve el usuario actualmente autenticado */
export function getCurrentUser(): Usuario {
  return USUARIO_MOCK;
}

/** Comprueba si el usuario actual tiene alguno de los roles permitidos */
export function tieneRol(...rolesPermitidos: Rol[]): boolean {
  const usuario = getCurrentUser();
  return rolesPermitidos.includes(usuario.rol);
}