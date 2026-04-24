"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "/", label: "Inicio", icon: "/assets/icono-inicio-menu.svg" },
  { href: "/blog", label: "Blog", icon: "/assets/icono-blog-menu.svg" },
  { href: "/login", label: "Soporte", icon: "/assets/icono-soporte-menu.svg" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  /**
   * Determina si un link está activo comparando su href con la ruta actual.
   * - "/"              → activo solo si pathname es exactamente "/"
   * - "/#seccion"      → activo si estamos en "/" (la sección vive en el home)
   * - "/blog", etc.    → activo si pathname empieza con esa ruta
   *                      (así /blog/algun-post también marca "Blog" como activo)
   */
  const isActive = (href: string): boolean => {
  // Links de sección con hash no se marcan activos automáticamente
  // (Inicio ocupa ese rol en el home)
  if (href.startsWith("/#")) return false;
  // Home exacto
  if (href === "/") return pathname === "/";
  // Rutas normales (/blog, /blog/algun-post, etc.)
  return pathname.startsWith(href);
};

  // Bloquea el scroll del body y cierra con ESC cuando el menú móvil está abierto
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="relative w-full overflow-hidden bg-brand-greenDark">
      {/* Fondo decorativo de hojas/trigo sobre el verde */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100 mix-blend-multiply"
        style={{ backgroundImage: "url('/assets/TrigoFondoBar.png')" }}
        aria-hidden="true"
      />

      <div className="container-site relative z-10 flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3" aria-label="Inicio">
          <Image
            src="/assets/logo-sena-menu.svg"
            alt="SENA"
            width={63}
            height={61}
            className="h-12 w-auto"
            priority
          />
          <span className="h-10 w-px bg-white/40" aria-hidden="true" />
          <Image
            src="/assets/logo-masa-madre-menu.svg"
            alt="Masa Madre"
            width={76}
            height={66}
            className="h-12 w-auto"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <ul className="flex items-center gap-3">
            {NAV_LINKS.map((link) => {
              const activo = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={activo ? "page" : undefined}
                    className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                      activo
                        ? "bg-brand-greenDarkMenu text-white shadow-md "
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    <Image src={link.icon} alt="" width={22} height={22} className="h-5 w-5" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            href="/#puntos-aliados"
            aria-current={pathname === "/" ? "page" : undefined}
            className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-sm transition bg-brand-purple hover:bg-brand-purple-mid hover:shadow-md`}
          >
            <Image src="/assets/icono-colombia-menu.svg" alt="" width={18} height={24} className="h-5 w-auto" />
            <span>Puntos Aliados Masa Madre</span>
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Abrir menú"
          className="flex h-11 w-11 items-center justify-center rounded-lg text-white transition hover:bg-white/10 md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <div
            id="mobile-menu"
            className="absolute left-0 top-0 flex h-full w-[85%] max-w-sm animate-slide-in-left flex-col overflow-hidden rounded-r-[2rem] bg-brand-greenDark shadow-2xl"
          >
            {/* Fondo decorativo de hojas/trigo (rotado 180° para variar respecto al header) */}
            <div
              className="pointer-events-none absolute inset-0 rotate-180 bg-cover bg-center bg-no-repeat opacity-100 mix-blend-multiply"
              style={{ backgroundImage: "url('/assets/TrigoFondoBar.png')" }}
              aria-hidden="true"
            />

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
              className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-green shadow-md transition hover:scale-105"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M6 18L18 6" />
              </svg>
            </button>

            <div className="relative z-[1] flex h-full flex-col px-6 pb-8 pt-16">
              <div className="flex flex-col items-center">
                <Image
                  src="/assets/icono-panadero-menu.svg"
                  alt=""
                  width={120}
                  height={120}
                  className="h-24 w-24"
                  aria-hidden="true"
                />
                <h2 className="mt-3 text-2xl font-bold italic text-white">Menú principal</h2>
              </div>

              <ul className="mt-10 flex flex-col gap-3">
                {NAV_LINKS.map((link) => {
                  const activo = isActive(link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        aria-current={activo ? "page" : undefined}
                        className={`flex items-center gap-3 rounded-full px-5 py-3 text-base font-semibold text-white transition ${
                          activo
                            ? "bg-brand-greenDarkMenu shadow-md"
                            : "hover:bg-brand-greenDark/40"
                        }`}
                      >
                        <Image src={link.icon} alt="" width={22} height={22} className="h-6 w-6" />
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  );
                })}
                <li className="mt-2">
                  <Link
                    href="/#puntos-aliados"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-full bg-brand-purple px-5 py-3 text-base font-semibold text-white shadow-md transition hover:bg-brand-purple-mid"
                  >
                    <Image
                      src="/assets/icono-colombia-menu.svg"
                      alt=""
                      width={22}
                      height={22}
                      className="h-6 w-auto"
                    />
                    <span>Puntos Aliados Masa Madre</span>
                  </Link>
                </li>
              </ul>

              <div className="mt-auto flex items-center justify-center gap-4 pt-8">
                <Image
                  src="/assets/logo-sena-menu.svg"
                  alt="SENA"
                  width={63}
                  height={61}
                  className="h-14 w-auto"
                />
                <span className="h-12 w-px bg-white/50" aria-hidden="true" />
                <Image
                  src="/assets/logo-masa-madre-menu.svg"
                  alt="Masa Madre"
                  width={76}
                  height={66}
                  className="h-14 w-auto"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}