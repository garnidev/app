import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/data/posts";
import { EstadoBadge } from "./EstadoBadge";
import { TagChip, colorParaTag } from "./TagChip";

type Props = {
  post: Post & {
    /** Tags opcionales (vienen de PostDetalle cuando aplica) */
    tags?: { label: string; icon: string }[];
  };
};

const MESES_CORTO = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];

function formatearFecha(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${MESES_CORTO[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/**
 * Fila horizontal de un post en el listado del admin.
 * - Thumbnail cuadrado
 * - Título + metadatos (estado, fecha, tiempo, visitas)
 * - Tags
 * - Botones de acción: Editar + Archivar
 */
export function PostRow({ post }: Props) {
  const estado = post.estado ?? "publicado";
  const visitas = post.visitas ?? 0;

  return (
    <article className="group flex flex-col gap-4 rounded-2xl bg-white p-4 ring-1 ring-neutral-200 transition hover:shadow-md md:flex-row md:items-center md:p-5">
      {/* Thumbnail */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100 md:h-16 md:w-16">
        <Image
          src={post.imagen.src}
          alt={post.imagen.alt}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>

      {/* Información principal */}
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-bold leading-snug text-neutral-900 md:text-base">
          {post.titulo}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-500">
          <EstadoBadge estado={estado} />

          <span className="inline-flex items-center gap-1.5">
            <IconoCalendario />
            {formatearFecha(post.fechaISO)}
          </span>

          <span className="inline-flex items-center gap-1.5">
            <IconoReloj />
            {post.tiempoLecturaMin} min
          </span>

          <span className="inline-flex items-center gap-1.5">
            <IconoOjo />
            {visitas} visitas
          </span>

          {post.tags && post.tags.length > 0 && (
            <>
              <span
                className="hidden h-4 w-px bg-neutral-300 md:inline-block"
                aria-hidden="true"
              />
              <div className="flex flex-wrap items-center gap-2">
                {post.tags.slice(0, 3).map((tag, idx) => (
                  <TagChip
                    key={idx}
                    label={tag.label}
                    color={colorParaTag(tag.label)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex shrink-0 flex-wrap items-center gap-2 md:flex-nowrap">
        <Link
          href={`/admin/blog/${post.slug}/editar`}
          className="inline-flex items-center gap-2 rounded-full bg-brand-greenSoft px-4 py-2 text-sm font-bold text-brand-green transition hover:bg-brand-green hover:text-white"
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
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Editar
        </Link>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-brand-purple/40 bg-white px-4 py-2 text-sm font-bold text-brand-purpleDark transition hover:bg-brand-purple/5"
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
            <rect x="3" y="4" width="18" height="4" rx="1" />
            <path d="M5 8v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" />
            <path d="M10 12h4" />
          </svg>
          Archivar
        </button>
      </div>
    </article>
  );
}

/* ─── Iconos mini ─────────────────────────────────────────────────── */

function IconoCalendario() {
  return (
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
  );
}

function IconoReloj() {
  return (
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
  );
}

function IconoOjo() {
  return (
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
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}