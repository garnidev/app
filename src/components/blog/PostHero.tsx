import Image from "next/image";
import Link from "next/link";
import type { PostDetalle } from "@/data/posts";

/**
 * Hero del detalle del post
 * - Banner con imagen del post + degradado
 * - Botón "Volver al blog" arriba-izquierda
 * - Píldora dorada con keyword
 * - Título centrado
 * - Metadata: fecha + tiempo de lectura
 * - Curva ondulada inferior que corta el fondo
 */
export function PostHero({ post }: { post: PostDetalle }) {
  const fecha = formatearFechaLarga(post.fechaISO);

  return (
    <section className="relative">
      {/* Fondo: imagen del post */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src={post.imagen.src}
          alt=""
          fill
          priority
          className="object-cover object-center"
          aria-hidden="true"
        />
        {/* Degradado morado por encima para dar consistencia y legibilidad */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-brand-purpleDark/70 via-brand-purpleDark/50 to-brand-purpleDark/70"
          aria-hidden="true"
        />
      </div>

      <div className="container-site relative z-10 pb-24 pt-6 md:pb-28 md:pt-8">
        {/* Botón Volver al blog */}
        <div className="flex justify-start">
          <Link
            href="/blog"
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
            <span>Volver al blog</span>
          </Link>
        </div>

        {/* Píldora dorada con la keyword */}
        <div className="mt-4 flex justify-center">
          <div
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#E6B052] to-[#A67226] px-5 py-2.5 shadow-lg ring-1 ring-[#8B5E1F]/40"
            style={{
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.4), 0 4px 12px rgba(0,0,0,0.25)",
            }}
          >
            <Image
              src="/assets/icono-panadero-menu.svg"
              alt=""
              width={22}
              height={22}
              className="h-5 w-5 brightness-0"
              aria-hidden="true"
            />
            <span className="text-xs font-extrabold uppercase tracking-[0.15em] text-neutral-900">
              {post.keyword}
            </span>
          </div>
        </div>

        {/* Título */}
        <h1
          className="mx-auto mt-6 max-w-4xl text-center text-3xl font-extrabold italic leading-tight text-white md:text-4xl lg:text-5xl"
          style={{ textShadow: "0 4px 8px rgba(0, 0, 0, 0.4)" }}
        >
          {post.titulo}
        </h1>

        {/* Metadata: fecha + tiempo de lectura */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:gap-6">
          <MetaItem
            icon={
              <>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </>
            }
            label="Fecha de publicación:"
            value={fecha}
          />
          <MetaItem
            icon={
              <>
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </>
            }
            label="Tiempo de lectura:"
            value={`${post.tiempoLecturaMin} min`}
          />
        </div>
      </div>

      {/* Curva ondulada inferior — forma de ola con dos curvas */}
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 z-20 h-12 w-full sm:h-16 md:h-20 lg:h-24"
        aria-hidden="true"
      >
        <path
          d="M0,120 L0,40 Q360,100 720,40 T1440,40 L1440,120 Z"
          fill="white"
        />
      </svg>
    </section>
  );
}

/* ─── Subcomponente interno para las metas ────────────────────────── */

function MetaItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-black/25 px-4 py-1.5 text-sm text-white backdrop-blur-sm">
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
        {icon}
      </svg>
      <span>
        {label} <span className="font-bold">{value}</span>
      </span>
    </span>
  );
}

/* ─── Utilidad para formato largo de fecha ────────────────────────── */

const MESES_CORTO = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];

function formatearFechaLarga(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${MESES_CORTO[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}