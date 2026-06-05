import Image from "next/image";
import type { Post } from "@/data/posts";
import { EstadoBadge } from "./EstadoBadge";
import { TagChip, colorParaTag } from "./TagChip";
import { PostActions } from "./PostActions";

type Props = {
  post: Post & {
    /** Tags opcionales (vienen de PostDetalle cuando aplica) */
    tags?: { label: string; icon: string }[];
    /** Total de comentarios del post (vienen del backend) */
    totalComentarios?: number;
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
 * - MÓVIL: layout vertical con thumbnail grande, badges en línea
 * - DESKTOP: layout horizontal con thumbnail pequeño + meta inline
 */
export function PostRow({ post }: Props) {
  const estado = post.estado ?? "publicado";
  const visitas = post.visitas ?? 0;
  const totalComentarios = post.totalComentarios ?? 0;

  return (
    <article className="group flex flex-col gap-4 rounded-2xl bg-white p-4 ring-1 ring-neutral-200 transition hover:shadow-md md:flex-row md:items-center md:p-5">
      {/* Thumbnail — ocupa todo el ancho en móvil, pequeño en desktop */}
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl bg-neutral-100 md:aspect-square md:h-16 md:w-16">
        <Image
          src={post.imagen.src}
          alt={post.imagen.alt}
          fill
          sizes="(max-width: 768px) 100vw, 80px"
          className="object-cover"
        />
      </div>

      {/* Información principal */}
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-bold leading-snug text-neutral-900 md:text-base">
          {post.titulo}
        </h3>

        {/* Estado en móvil va separado, en desktop inline con el resto */}
        <div className="mt-2">
          <EstadoBadge estado={estado} />
        </div>

        {/* Meta inline: fecha, tiempo, visitas — en una línea */}
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
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
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {post.tags.slice(0, 3).map((tag, idx) => (
              <TagChip
                key={idx}
                label={tag.label}
                color={colorParaTag(tag.label)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <PostActions slug={post.slug} totalComentarios={totalComentarios} />
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