import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Panel administrativo | Masa Madre",
  description: "Panel de administración de la Red Masa Madre Colombia.",
  robots: { index: false, follow: false }, // no indexar el admin
};

/**
 * Layout compartido para todas las rutas bajo /admin
 * - Sidebar fijo a la izquierda (con toggle expandir/contraer)
 * - Área de contenido sincronizada con el ancho del sidebar
 *
 * TODO: cuando tengamos backend real, proteger este layout con middleware
 * que valide la sesión. Si no hay sesión, redirect a /login.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const usuario = getCurrentUser();

  return <AdminShell usuario={usuario}>{children}</AdminShell>;
}