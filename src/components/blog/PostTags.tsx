import type { Tag, TagIcon } from "@/data/posts";

type Props = {
  tags: Tag[];
};

/**
 * Pills con icono para los tags libres del artículo.
 * Estilo: borde morado fino, fondo transparente, icono + texto morado oscuro.
 */
export function PostTags({ tags }: Props) {
  return (
    <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-3 md:justify-start">
      {tags.map((tag, idx) => (
        <span
          key={`${tag.label}-${idx}`}
          className="inline-flex items-center gap-2 rounded-full border border-brand-purple/50 bg-brand-purple/10 px-5 py-2 text-xs font-semibold text-brand-purpleDark transition hover:bg-brand-purple/15 md:text-sm"
        >
          <TagIconSvg icon={tag.icon} />
          <span>{tag.label}</span>
        </span>
      ))}
    </div>
  );
}

/* ─── Iconos por tipo ─────────────────────────────────────────────── */

function TagIconSvg({ icon }: { icon: TagIcon }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-4 w-4",
    "aria-hidden": true,
  };

  switch (icon) {
    case "fermentacion":
      // Círculo con burbujas internas (fermentación activa)
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="9" cy="10" r="1.3" fill="currentColor" />
          <circle cx="14" cy="13" r="1.3" fill="currentColor" />
          <circle cx="11" cy="15.5" r="0.9" fill="currentColor" />
          <circle cx="15.5" cy="9" r="0.7" fill="currentColor" />
        </svg>
      );

    case "tecnica":
      // Engranaje
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );

    case "masa-madre":
      // Frasco / contenedor con tapa
      return (
        <svg {...common}>
          <path d="M8 3h8" />
          <path d="M9 3v2" />
          <path d="M15 3v2" />
          <path d="M7 5h10v3H7z" />
          <path d="M6 8h12v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8z" />
          <path d="M8 14c2 0 2-1 4-1s2 1 4 1" />
        </svg>
      );

    case "panaderia":
      // Chef / panadero (la silueta del gorro)
      return (
        <svg {...common}>
          <path d="M7 13h10v7a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-7z" />
          <path d="M7 13c-2 0-3.5-1.5-3.5-3.5S5 6 7 6c0-2 2-3.5 4-3.5S15 4 15 6c2 0 3.5 1.5 3.5 3.5S17 13 15 13" />
        </svg>
      );

    case "colombia":
      // Hoja / espiga doble (representa territorio/naturaleza)
      return (
        <svg {...common}>
          <path d="M12 21V9" />
          <path d="M12 9c-3-3-7-3-9 0 2 3 6 3 9 0z" />
          <path d="M12 9c3-3 7-3 9 0-2 3-6 3-9 0z" />
        </svg>
      );

    case "cultivo":
      // Espiga de trigo
      return (
        <svg {...common}>
          <path d="M12 22V4" />
          <path d="M12 8c-2.5-2-5-2-6.5-0.5 1.5 2 4 2.5 6.5 0.5z" />
          <path d="M12 8c2.5-2 5-2 6.5-0.5-1.5 2-4 2.5-6.5 0.5z" />
          <path d="M12 13c-2.5-2-5-2-6.5-0.5 1.5 2 4 2.5 6.5 0.5z" />
          <path d="M12 13c2.5-2 5-2 6.5-0.5-1.5 2-4 2.5-6.5 0.5z" />
          <path d="M12 18c-2.5-2-5-2-6.5-0.5 1.5 2 4 2.5 6.5 0.5z" />
          <path d="M12 18c2.5-2 5-2 6.5-0.5-1.5 2-4 2.5-6.5 0.5z" />
        </svg>
      );

    default:
      return null;
  }
}