"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { GovBar } from "@/components/GovBar";
import { Header } from "@/components/Header";
import { getPosts, type Post } from "@/data/posts";

/* ═══════════════════════════════════════════════════════════════════════
   DATOS DEL BLOG
   ─────────────────────────────────────────────────────────────────────
   Los posts se importan desde /src/data/posts.ts — archivo compartido
   con la página de detalle /blog/[slug]. Cuando se integre la BD, solo
   se cambia la implementación de getPosts() en ese archivo.
   ═══════════════════════════════════════════════════════════════════════ */

const POSTS = getPosts();

/* ═══════════════════════════════════════════════════════════════════════
   OPCIONES DE ORDENAMIENTO
   ═══════════════════════════════════════════════════════════════════════ */

type Orden = "recientes" | "antiguos" | "lectura-corta" | "lectura-larga";

const OPCIONES_ORDEN: { valor: Orden; label: string }[] = [
  { valor: "recientes", label: "Más recientes" },
  { valor: "antiguos", label: "Más antiguos" },
  { valor: "lectura-corta", label: "Lectura corta" },
  { valor: "lectura-larga", label: "Lectura larga" },
];

/* ═══════════════════════════════════════════════════════════════════════
   UTILIDADES
   ═══════════════════════════════════════════════════════════════════════ */

const MESES = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

function formatearFecha(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${MESES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/* ═══════════════════════════════════════════════════════════════════════
   PÁGINA DEL BLOG
   ═══════════════════════════════════════════════════════════════════════ */

export default function BlogPage() {
  const [orden, setOrden] = useState<Orden>("recientes");
  const [ordenAbierto, setOrdenAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtroActivo, setFiltroActivo] = useState(true); // controla la pill de "Más recientes"

  /* ─── Derivados: lista filtrada y ordenada ───────────────────────── */
  const postsFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();

    let resultado = POSTS.filter((p) => {
      if (!q) return true;
      return (
        p.titulo.toLowerCase().includes(q) ||
        p.descripcion.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q)
      );
    });

    // Solo ordenamos si el filtro pill está activo
    if (filtroActivo) {
      resultado = [...resultado].sort((a, b) => {
        switch (orden) {
          case "recientes":
            return b.fechaISO.localeCompare(a.fechaISO);
          case "antiguos":
            return a.fechaISO.localeCompare(b.fechaISO);
          case "lectura-corta":
            return a.tiempoLecturaMin - b.tiempoLecturaMin;
          case "lectura-larga":
            return b.tiempoLecturaMin - a.tiempoLecturaMin;
        }
      });
    }

    return resultado;
  }, [busqueda, orden, filtroActivo]);

  const labelFiltroActivo =
    OPCIONES_ORDEN.find((o) => o.valor === orden)?.label ?? "Más recientes";

  return (
    <>
      <GovBar />
      <Header />
      <main className="min-h-screen bg-white">
        {/* ═══════════════════════════════════════════════════════════════
            BANNER SUPERIOR con fondo de trigo + curva inferior
            ═════════════════════════════════════════════════════════════ */}
        <section className="relative">
          {/* Fondo SVG — cubre el banner completo con la máscara curva */}
          <div className="absolute inset-0 -z-0 overflow-hidden">
            <Image
              src="/assets/FondoBlog.svg"
              alt=""
              fill
              priority
              className="object-cover object-center"
              aria-hidden="true"
            />
            {/* Degradado morado por encima para oscurecer y dar consistencia */}
            <div
            //   className="absolute inset-0 bg-gradient-to-b from-brand-purple/70 via-brand-purpleDark/60 to-brand-purpleDark/40"
            //   aria-hidden="true"
            />
          </div>

          <div className="container-site relative z-30 pb-40 pt-8 md:pb-48 md:pt-10">
            {/* ─── Botón "Volver al Inicio" ──────────────────────────── */}
            <div className="flex justify-start">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brand-green shadow-soft transition hover:scale-[1.02] hover:shadow-md"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                <span>Volver al Inicio</span>
              </Link>
            </div>

            {/* ─── Píldora "DEL HORNO A LA PALABRA" ──────────────────── */}
            <div className="mt-6 flex justify-center md:mt-2">
              <Image
                src="/assets/del-horno-a-la-palabra.svg"
                alt="Del Horno a la Palabra"
                width={280}
                height={52}
                className="h-auto w-[240px] drop-shadow-lg md:w-[280px]"
                priority
              />
            </div>

            {/* ─── Título principal ──────────────────────────────────── */}
            <h1
              className="mt-6 text-center text-4xl font-extrabold italic leading-tight text-white md:text-5xl lg:text-6xl"
              style={{ textShadow: "0 4px 8px rgba(0, 0, 0, 0.35)" }}
            >
              El blog de la Masa Madre
            </h1>

            {/* ─── Subtítulo ─────────────────────────────────────────── */}
            <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-white/95 md:text-lg">
              Las historias detrás de los oficios y las regiones que hacen del
              pan artesano colombiano algo único.
            </p>

            {/* ─── Controles: Ordenar + Buscar ───────────────────────── */}
            <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Grupo izquierdo: Ordenar + Pill activo */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Dropdown "Ordenar por" */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOrdenAbierto((v) => !v)}
                    aria-expanded={ordenAbierto}
                    aria-haspopup="listbox"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brand-green shadow-soft transition hover:shadow-md"
                  >
                    <span>Ordenar por</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`h-4 w-4 transition-transform ${
                        ordenAbierto ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>

                  {/* Menú desplegable */}
                  {ordenAbierto && (
                    <>
                      {/* Backdrop para cerrar al hacer click fuera */}
                      <button
                        type="button"
                        aria-label="Cerrar menú de ordenamiento"
                        onClick={() => setOrdenAbierto(false)}
                        className="fixed inset-0 z-40 cursor-default"
                      />
                      <ul
                        role="listbox"
                        aria-label="Opciones de ordenamiento"
                        className="absolute left-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl bg-white py-2 shadow-card"
                      >
                        {OPCIONES_ORDEN.map((op) => {
                          const activo = op.valor === orden;
                          return (
                            <li
                              key={op.valor}
                              role="option"
                              aria-selected={activo}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setOrden(op.valor);
                                  setFiltroActivo(true);
                                  setOrdenAbierto(false);
                                }}
                                className={`flex w-full items-center justify-between px-4 py-2.5 text-sm font-semibold transition ${
                                  activo
                                    ? "bg-brand-greenSoft text-brand-green"
                                    : "text-neutral-700 hover:bg-neutral-50"
                                }`}
                              >
                                <span>{op.label}</span>
                                {activo && (
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                  >
                                    <path d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  )}
                </div>

                {/* Pill verde con el filtro activo (y X para quitarlo) */}
                {filtroActivo && (
                  <button
                    type="button"
                    onClick={() => setFiltroActivo(false)}
                    className="inline-flex items-center gap-2 rounded-full bg-brand-green px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-greenDark"
                    aria-label={`Quitar filtro: ${labelFiltroActivo}`}
                  >
                    <span>{labelFiltroActivo}</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path d="M6 6l12 12M6 18L18 6" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Buscador */}
              <div className="relative w-full md:max-w-md">
                <input
                  type="search"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar"
                  aria-label="Buscar artículos"
                  className="w-full rounded-full bg-white py-3 pl-6 pr-12 text-sm font-medium text-neutral-800 shadow-soft placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-green/50"
                />
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            GRID DE POSTS — se monta encima del banner con margen negativo
            ═════════════════════════════════════════════════════════════ */}
        <section className="container-site relative z-20 -mt-32 pb-20 md:-mt-36">
          {postsFiltrados.length === 0 ? (
            <EmptyState busqueda={busqueda} />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {postsFiltrados.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   COMPONENTES INTERNOS
   ═══════════════════════════════════════════════════════════════════════ */

function PostCard({ post }: { post: Post }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-intense">
      {/* Imagen */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
        <Image
          src={post.imagen.src}
          alt={post.imagen.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-5 md:p-6">
        {/* Categoría */}
        <span className="text-xs font-bold uppercase tracking-[0.15em] text-brand-green">
          {post.categoria}
        </span>

        {/* Título */}
        <h3 className="mt-2 text-lg font-bold leading-snug text-neutral-900 md:text-xl">
          {post.titulo}
        </h3>

        {/* Descripción */}
        <p className="mt-3 text-sm leading-relaxed text-neutral-600 md:text-[15px]">
          {post.descripcion}
        </p>

        {/* Separador + footer */}
        <div className="mt-auto">
          <div className="my-4 h-px bg-neutral-200" aria-hidden="true" />
          <div className="flex items-center justify-between gap-3">
            {/* Fecha + tiempo */}
            <div className="flex items-center gap-4 text-xs text-neutral-500">
              <span className="inline-flex items-center gap-1.5">
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
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>{formatearFecha(post.fechaISO)}</span>
              </span>

              <span className="inline-flex items-center gap-1.5">
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
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>{post.tiempoLecturaMin} min</span>
              </span>
            </div>

            {/* Botón Leer más */}
            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center rounded-full bg-brand-purple/10 px-4 py-2 text-sm font-bold text-brand-purpleDark transition hover:bg-brand-purple/20"
            >
              Leer más
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function EmptyState({ busqueda }: { busqueda: string }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl bg-white p-10 text-center shadow-card ring-1 ring-black/5">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-greenSoft">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8 text-brand-green"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </div>
      <h2 className="mt-4 text-xl font-bold text-neutral-900">
        Sin resultados
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600">
        {busqueda
          ? `No encontramos artículos que coincidan con "${busqueda}". Intenta con otras palabras.`
          : "No hay artículos disponibles en este momento."}
      </p>
    </div>
  );
}
