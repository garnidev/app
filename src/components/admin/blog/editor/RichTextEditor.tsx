"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { EditorToolbar } from "./EditorToolbar";
import { EditorBubbleMenu } from "./EditorBubbleMenu";

type Props = {
  /** Contenido inicial (HTML). Útil para edición. */
  contenidoInicial?: string;
  /** Placeholder mostrado cuando el editor está vacío */
  placeholder?: string;
  /** Callback cuando el contenido cambia */
  onChange?: (html: string) => void;
};

/**
 * Editor de texto enriquecido basado en Tiptap.
 * - Toolbar superior con todas las acciones
 * - Bubble menu (mini-toolbar flotante sobre texto seleccionado)
 * - Placeholder cuando está vacío
 * - Output HTML al padre vía onChange
 *
 * El estilo del contenido interno (tipografía, citas, código) se controla
 * con la clase `.tiptap-content` definida en globals.css.
 */
export function RichTextEditor({
  contenidoInicial = "",
  placeholder = "Escribe la descripción detallada del evento...",
  onChange,
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Configuración del starter-kit para que no use extensiones que vamos a reemplazar
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false, // no abrir enlaces al hacer click dentro del editor
        HTMLAttributes: {
          class: "text-brand-purple underline",
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-xl my-4 max-w-full h-auto",
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: contenidoInicial,
    // Evita hydration mismatch en SSR (importante en Next.js App Router)
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "tiptap-content min-h-[400px] px-4 py-4 focus:outline-none text-sm md:text-base text-neutral-800",
      },
    },
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      {/* Barra de herramientas superior */}
      <EditorToolbar editor={editor} />

      {/* Bubble menu flotante (aparece al seleccionar texto) */}
      <EditorBubbleMenu editor={editor} />

      {/* Área de contenido editable */}
      <EditorContent editor={editor} />
    </div>
  );
}