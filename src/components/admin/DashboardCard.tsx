import Link from "next/link";
import { AdminIcon } from "./AdminIcon";
import type { NavIcon } from "./navigation";

type BadgeColor = "green" | "blue" | "purple" | "amber";

type Props = {
  icon: NavIcon;
  titulo: string;
  descripcion: string;
  /** Texto del badge de stats (ej: "8 puntos activos") */
  badge: string;
  /** Color del badge */
  badgeColor?: BadgeColor;
  /** A dónde lleva el botón "Gestionar" */
  href: string;
};

/**
 * Card de acción rápida del dashboard admin
 * - Ícono circular verde arriba
 * - Título en bold
 * - Descripción en gris
 * - Badge con estadística clave
 * - Separador + botón "Gestionar" abajo
 */
export function DashboardCard({
  icon,
  titulo,
  descripcion,
  badge,
  badgeColor = "green",
  href,
}: Props) {
  return (
    <article className="group flex flex-col rounded-3xl bg-white p-6 shadow-card ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-intense md:p-8">
      {/* Icono circular verde */}
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-greenSoft text-brand-green">
        <AdminIcon name={icon} className="h-7 w-7" />
      </div>

      {/* Título */}
      <h2 className="mt-5 text-xl font-bold text-neutral-900 md:text-2xl">
        {titulo}
      </h2>

      {/* Descripción */}
      <p className="mt-2 text-sm leading-relaxed text-neutral-600 md:text-base">
        {descripcion}
      </p>

      {/* Badge estadística */}
      <div className="mt-4">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold md:text-sm ${
            BADGE_STYLES[badgeColor]
          }`}
        >
          {badge}
        </span>
      </div>

      {/* Separador + botón */}
      <div className="mt-5 flex items-center justify-end border-t border-neutral-200 pt-5">
        <Link
          href={href}
          className="group/btn inline-flex items-center gap-2 rounded-full bg-brand-greenSoft px-5 py-2.5 text-sm font-bold text-brand-green transition hover:bg-brand-green hover:text-white"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span>Gestionar</span>
        </Link>
      </div>
    </article>
  );
}

const BADGE_STYLES: Record<BadgeColor, string> = {
  green: "bg-brand-greenSoft text-brand-green",
  blue: "bg-blue-50 text-blue-700",
  purple: "bg-brand-purple/10 text-brand-purpleDark",
  amber: "bg-amber-50 text-amber-700",
};