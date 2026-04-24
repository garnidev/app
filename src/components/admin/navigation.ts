import type { Rol } from "@/lib/auth";

/**
 * ═══════════════════════════════════════════════════════════════════════
 *  NAVEGACIÓN DEL PANEL ADMIN
 * ─────────────────────────────────────────────────────────────────────
 *  Define los items del sidebar. Cada item declara qué roles pueden verlo.
 *  El Sidebar filtra automáticamente según el rol del usuario actual.
 * ═══════════════════════════════════════════════════════════════════════
 */

export type NavIcon =
  | "home"
  | "panaderias"
  | "blog"
  | "usuarios"
  | "reportes"
  | "config";

export type NavItem = {
  href: string;
  label: string;
  icon: NavIcon;
  /** Roles que pueden ver este item */
  roles: Rol[];
};

export type NavGroup = {
  /** Título de la sección (uppercase en el sidebar). Null = items sin agrupar */
  title: string | null;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    title: null, // items sueltos, sin header de grupo
    items: [
      {
        href: "/admin",
        label: "Inicio",
        icon: "home",
        roles: ["admin", "panaderia", "ciudadano"],
      },
    ],
  },
  {
    title: "CONTENIDO",
    items: [
      {
        href: "/admin/panaderias",
        label: "Directorio de panaderías",
        icon: "panaderias",
        roles: ["admin"],
      },
      {
        href: "/admin/blog",
        label: "Gestor del blog",
        icon: "blog",
        roles: ["admin"],
      },
    ],
  },
  // TODO: agregar más grupos según crezca el admin
  // {
  //   title: "USUARIOS",
  //   items: [
  //     { href: "/admin/usuarios", label: "Usuarios", icon: "usuarios", roles: ["admin"] },
  //   ],
  // },
];