type Props = {
  /** Contenido en formato HTML (generado por el editor Tiptap) */
  contenido: string;
};

/**
 * Renderiza el contenido principal del artículo en HTML limpio.
 * Los estilos vienen de la clase global .tiptap-content (en globals.css)
 * y reflejan exactamente lo que el usuario configuró en el editor Tiptap.
 */
export function PostContent({ contenido }: Props) {
  return (
    <article className="mx-auto max-w-3xl">
      <div
        className="tiptap-content mt-8 md:mt-10"
        dangerouslySetInnerHTML={{ __html: contenido }}
      />
    </article>
  );
}