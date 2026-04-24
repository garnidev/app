import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  /** El lead/resumen destacado — se muestra en un bloque verde antes del contenido */
  lead: string;
  /** Contenido en formato Markdown */
  contenido: string;
};

/**
 * Renderiza el contenido principal del artículo:
 * - Lead (bloque verde claro, verde cursiva bold, centrado)
 * - Cuerpo en Markdown con tipografía personalizada
 */
export function PostContent({ lead, contenido }: Props) {
  return (
    <article className="mx-auto max-w-3xl">
      {/* Lead destacado */}
      <div className="mt-8 rounded-xl bg-brand-greenSoft border-l-4 border-brand-green px-6 py-5 text-center md:px-8 md:py-6">
        <p className="text-sm font-bold italic leading-relaxed text-brand-greenDark md:text-base">
          {lead}
        </p>
      </div>

      {/* Cuerpo del artículo en Markdown */}
      <div className="mt-8 md:mt-10">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {contenido}
        </ReactMarkdown>
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   COMPONENTES CUSTOM PARA EL MARKDOWN
   ═══════════════════════════════════════════════════════════════════════ */

const markdownComponents: Components = {
  /* Párrafos */
  p: ({ children }) => (
    <p className="mb-5 text-sm leading-relaxed text-neutral-700 md:text-[15px] md:leading-[1.75]">
      {children}
    </p>
  ),

  /* Títulos H2 — azul marino italic, con separador arriba */
  h2: ({ children }) => (
    <>
      <hr className="my-8 border-0 border-t border-neutral-200" />
      <h2 className="mb-4 text-base font-bold italic text-support-navy md:text-lg">
        {children}
      </h2>
    </>
  ),

  /* Títulos H3 — por si el contenido los usa */
  h3: ({ children }) => (
    <h3 className="mt-6 mb-3 text-base font-bold italic text-support-navy">
      {children}
    </h3>
  ),

  /* Citas destacadas — bloque verde claro
     - Primer párrafo (la cita) → verde, italic, bold
     - Segundo párrafo en adelante (autor/atribución) → gris, normal */
  blockquote: ({ children }) => (
    <div className="my-6 rounded-xl bg-brand-greenSoft px-6 py-5 text-center md:px-8 md:py-6">
      <div
        className="text-sm leading-relaxed md:text-base
          [&>p:first-child]:font-bold [&>p:first-child]:italic [&>p:first-child]:text-brand-greenDark [&>p:first-child]:mb-2
          [&>p:not(:first-child)]:text-neutral-600 [&>p:not(:first-child)]:text-sm"
      >
        {children}
      </div>
    </div>
  ),

  /* Separadores horizontales */
  hr: () => <hr className="my-8 border-0 border-t border-neutral-200" />,

  /* Énfasis y negritas */
  strong: ({ children }) => (
    <strong className="font-bold text-neutral-900">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,

  /* Enlaces */
  a: ({ children, href }) => (
    
      <a href={href ?? "#"}
      className="font-semibold text-brand-purple underline decoration-brand-purple/40 underline-offset-2 transition hover:decoration-brand-purple"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),

  /* Listas */
  ul: ({ children }) => (
    <ul className="mb-5 ml-5 list-disc space-y-2 text-sm text-neutral-700 md:text-[15px]">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-5 ml-5 list-decimal space-y-2 text-sm text-neutral-700 md:text-[15px]">
      {children}
    </ol>
  ),
};