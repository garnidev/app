import type { EstadoPost } from "@/data/posts";

type Props = {
  estado: EstadoPost;
};

const CONFIG: Record<
  EstadoPost,
  { label: string; text: string; dot: string }
> = {
  publicado: {
    label: "Publicado",
    text: "text-brand-green",
    dot: "bg-brand-green",
  },
  borrador: {
    label: "Borrador",
    text: "text-blue-600",
    dot: "bg-blue-500",
  },
  activa: {
    label: "Activa",
    text: "text-brand-green",
    dot: "bg-brand-green",
  },
  archivado: {
    label: "Archivado",
    text: "text-neutral-500",
    dot: "bg-neutral-400",
  },
};

/**
 * Badge compacto con punto de color para indicar el estado del post.
 * Formato: ● Publicado / ● Borrador / ● Activa / ● Archivado
 */
export function EstadoBadge({ estado }: Props) {
  const config = CONFIG[estado];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${config.text}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${config.dot}`}
        aria-hidden="true"
      />
      {config.label}
    </span>
  );
}