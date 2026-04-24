"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminIcon } from "./AdminIcon";
import { NAV_GROUPS } from "./navigation";
import { UserBadge } from "./UserBadge";
import type { Usuario } from "@/lib/auth";

type Props = {
  usuario: Usuario;
  colapsado: boolean;
  onToggle: () => void;
  hidratado: boolean;
};

/**
 * Sidebar del panel admin
 * - Estado controlado desde AdminShell (colapsado/expandido)
 * - Filtra los items según el rol del usuario actual
 * - En móvil siempre está colapsado (solo iconos)
 */
export function Sidebar({ usuario, colapsado, onToggle, hidratado }: Props) {
  const pathname = usePathname();

  /** Verifica si un link está activo según el pathname actual */
  const esActivo = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  /** Filtra items según el rol del usuario */
  const gruposFiltrados = NAV_GROUPS.map((grupo) => ({
    ...grupo,
    items: grupo.items.filter((it) => it.roles.includes(usuario.rol)),
  })).filter((grupo) => grupo.items.length > 0);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex flex-col overflow-hidden rounded-r-3xl bg-[#431F72] shadow-2xl transition-all duration-300 ease-out ${
        colapsado ? "w-20" : "w-20 md:w-72"
      }`}
      aria-label="Navegación del panel administrativo"
    >
      {/* Textura decorativa sutil */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 mix-blend-overlay"
        style={{ backgroundImage: "url('/assets/TrigoFondoBar.png')" }}
        aria-hidden="true"
      />

      {/* ═══ LOGOS SUPERIORES ═══ */}
      <div
        className={`relative z-10 flex items-center justify-center pt-8 ${
          colapsado ? "px-2 pb-6" : "px-2 pb-6 md:gap-3 md:px-6 md:pb-8"
        }`}
      >
        {!colapsado && (
          <>
            <Image
              src="/assets/logo-sena-menu.svg"
              alt="SENA"
              width={54}
              height={52}
              className="hidden h-10 w-auto md:block"
              priority
            />
            <span
              className="hidden h-10 w-px bg-white/30 md:block"
              aria-hidden="true"
            />
          </>
        )}
        <Image
          src="/assets/logo-masa-madre-menu.svg"
          alt="Masa Madre"
          width={66}
          height={57}
          className="h-10 w-auto"
          priority
        />
      </div>

      {/* ═══ BOTÓN COLAPSAR ═══ */}
      <button
        type="button"
        onClick={onToggle}
        aria-label={colapsado ? "Expandir menú" : "Contraer menú"}
        aria-expanded={!colapsado}
        className="absolute right-0 top-[148px] z-20 hidden h-8 w-8 translate-x-1/2 items-center justify-center rounded-full bg-brand-green text-white shadow-md ring-2 ring-brand-purpleDark transition hover:bg-brand-greenDark md:flex"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-4 w-4 -translate-x-1 transition-transform ${
            colapsado ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* ═══ NAVEGACIÓN ═══ */}
      <nav className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden px-3 pb-6">
        {gruposFiltrados.map((grupo, idx) => (
          <div key={idx} className={idx > 0 ? "mt-5" : ""}>
            {grupo.title && (
              <>
                <div
                  className="mx-3 my-3 h-px bg-white/15"
                  aria-hidden="true"
                />
                {!colapsado && (
                  <p className="mb-2 hidden px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 md:block">
                    {grupo.title}
                  </p>
                )}
              </>
            )}

            <ul className="space-y-1">
              {grupo.items.map((item) => {
                const activo = esActivo(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={activo ? "page" : undefined}
                      title={colapsado ? item.label : undefined}
                      className={`group flex items-center gap-3 rounded-xl transition ${
                        colapsado
                          ? "justify-center p-3"
                          : "justify-center p-3 md:justify-start md:px-4 md:py-2.5"
                      } ${
                        activo
                          ? "bg-brand-green text-white shadow-lg shadow-brand-green/30"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <AdminIcon
                        name={item.icon}
                        className="h-5 w-5 shrink-0"
                      />
                      {!colapsado && (
                        <span className="hidden truncate text-sm font-medium md:block">
                          {item.label}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* ═══ USER BADGE ═══ */}
      <div className="relative z-10 p-4">
        {hidratado && <UserBadge usuario={usuario} colapsado={colapsado} />}
      </div>
    </aside>
  );
}
