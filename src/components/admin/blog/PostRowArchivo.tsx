import Image from "next/image";
import type { Post } from "@/data/posts";
import { EstadoBadge } from "./EstadoBadge";
import { TagChip, colorParaTag } from "./TagChip";
import { PostActionsArchivo } from "./PostActionsArchivo";

type Props = {
  post: Post & {
    tags?: { label: string; icon: string }[];
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

export function PostRowArchivo({ post }: Props) {
  const estado = post.estado ?? "archivado";

  return (
    <article className="group flex flex-col gap-4 rounded-2xl bg-white p-4 ring-1 ring-neutral-200 transition hover:shadow-md md:flex-row md:items-center md:p-5">
      {/* Thumbnail con opacity reducida */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100 md:h-16 md:w-16">
        <Image
          src={post.imagen.src}
          alt={post.imagen.alt}
          fill
          sizes="80px"
          className="object-cover opacity-60"
        />
      </div>

      {/* Información principal */}
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-bold leading-snug text-neutral-700 md:text-base">
          {post.titulo}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-500">
          <EstadoBadge estado={estado} />

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
            {formatearFecha(post.fechaISO)}
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
      <PostActionsArchivo slug={post.slug} />
    </article>
  );
}