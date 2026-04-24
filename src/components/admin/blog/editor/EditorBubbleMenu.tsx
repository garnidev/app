"use client";

import { type Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";

type Props = {
  editor: Editor | null;
};

/**
 * Mini-toolbar flotante que aparece al seleccionar texto en el editor.
 * Muestra acciones rápidas de formato más comunes (estilo Medium/Notion).
 *
 * Se oculta automáticamente cuando:
 * - No hay texto seleccionado
 * - El cursor está dentro de un bloque de código (no aplica formato)
 */
export function EditorBubbleMenu({ editor }: Props) {
  if (!editor) return null;

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 150, placement: "top" }}
      shouldShow={({ editor, from, to }) => {
        // Solo mostrar si hay selección real y no estamos en un code block
        const tieneSeleccion = from !== to;
        const enCodeBlock = editor.isActive("codeBlock");
        return tieneSeleccion && !enCodeBlock;
      }}
      className="flex items-center gap-0.5 rounded-xl border border-neutral-200 bg-white p-1 shadow-xl"
    >
      <BubbleButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        activo={editor.isActive("bold")}
        title="Negrita"
      >
        <span className="font-bold">B</span>
      </BubbleButton>

      <BubbleButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        activo={editor.isActive("italic")}
        title="Cursiva"
      >
        <span className="italic">I</span>
      </BubbleButton>

      <BubbleButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        activo={editor.isActive("underline")}
        title="Subrayado"
      >
        <span className="underline">U</span>
      </BubbleButton>

      <BubbleButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        activo={editor.isActive("strike")}
        title="Tachado"
      >
        <span className="line-through">S</span>
      </BubbleButton>

      <BubbleSeparator />

      <BubbleButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        activo={editor.isActive("heading", { level: 2 })}
        title="Título 2"
      >
        <span className="text-xs font-bold">H2</span>
      </BubbleButton>

      <BubbleButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        activo={editor.isActive("heading", { level: 3 })}
        title="Título 3"
      >
        <span className="text-xs font-bold">H3</span>
      </BubbleButton>

      <BubbleSeparator />

      <BubbleButton
        onClick={() => {
          const urlPrevia = editor.getAttributes("link").href;
          const url = window.prompt("URL del enlace:", urlPrevia || "https://");
          if (url === null) return;
          if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
          }
          editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url })
            .run();
        }}
        activo={editor.isActive("link")}
        title="Insertar enlace"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3.5 w-3.5"
          aria-hidden="true"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      </BubbleButton>

      <BubbleButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        activo={editor.isActive("blockquote")}
        title="Cita"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3.5 w-3.5"
          aria-hidden="true"
        >
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .25-1 1v1c0 .75.25 1 1 1z" />
          <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h.25c.75 0 .75 0 .75 1v1c0 1-1 2-2 2s-1 .25-1 1v1c0 .75.25 1 1 1z" />
        </svg>
      </BubbleButton>
    </BubbleMenu>
  );
}

/* ─── Subcomponentes internos ─────────────────────────────────────── */

function BubbleSeparator() {
  return <span className="mx-0.5 h-5 w-px bg-neutral-300" aria-hidden="true" />;
}

type BubbleButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  activo?: boolean;
  title: string;
};

function BubbleButton({ onClick, children, activo = false, title }: BubbleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      aria-pressed={activo}
      className={`flex h-7 w-7 items-center justify-center rounded-md text-xs transition ${
        activo
          ? "bg-brand-green text-white"
          : "text-neutral-700 hover:bg-neutral-100"
      }`}
    >
      {children}
    </button>
  );
}