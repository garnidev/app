"use client";

import { type Editor } from "@tiptap/react";

type Props = {
  editor: Editor | null;
};

/**
 * Barra de herramientas del editor de texto enriquecido.
 * - Formato de texto: negrita, cursiva, subrayado, tachado
 * - Encabezados: H1, H2, H3
 * - Listas: desordenada, ordenada
 * - Bloques: cita, código, separador
 * - Alineación: izquierda, centro, derecha
 * - Enlaces e imágenes
 * - Deshacer / Rehacer
 */
export function EditorToolbar({ editor }: Props) {
  if (!editor) return null;

  const agregarEnlace = () => {
    const urlPrevia = editor.getAttributes("link").href;
    const url = window.prompt("URL del enlace:", urlPrevia || "https://");
    if (url === null) return; // cancel
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const agregarImagen = () => {
    const url = window.prompt("URL de la imagen:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-neutral-200 bg-neutral-50 px-3 py-2">
      {/* ─── Formato de texto ─── */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          activo={editor.isActive("bold")}
          title="Negrita (Ctrl+B)"
        >
          <span className="font-bold">B</span>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          activo={editor.isActive("italic")}
          title="Cursiva (Ctrl+I)"
        >
          <span className="italic">I</span>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          activo={editor.isActive("underline")}
          title="Subrayado (Ctrl+U)"
        >
          <span className="underline">U</span>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          activo={editor.isActive("strike")}
          title="Tachado"
        >
          <span className="line-through">S</span>
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarSeparator />

      {/* ─── Encabezados ─── */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          activo={editor.isActive("heading", { level: 1 })}
          title="Título 1"
        >
          <span className="text-xs font-bold">H1</span>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          activo={editor.isActive("heading", { level: 2 })}
          title="Título 2"
        >
          <span className="text-xs font-bold">H2</span>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          activo={editor.isActive("heading", { level: 3 })}
          title="Título 3"
        >
          <span className="text-xs font-bold">H3</span>
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarSeparator />

      {/* ─── Listas ─── */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          activo={editor.isActive("bulletList")}
          title="Lista con viñetas"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <circle cx="4" cy="6" r="1" fill="currentColor" />
            <circle cx="4" cy="12" r="1" fill="currentColor" />
            <circle cx="4" cy="18" r="1" fill="currentColor" />
          </svg>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          activo={editor.isActive("orderedList")}
          title="Lista numerada"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
            <line x1="10" y1="6" x2="21" y2="6" />
            <line x1="10" y1="12" x2="21" y2="12" />
            <line x1="10" y1="18" x2="21" y2="18" />
            <path d="M4 6h1v4" />
            <path d="M4 10h2" />
            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
          </svg>
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarSeparator />

      {/* ─── Bloques especiales ─── */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          activo={editor.isActive("blockquote")}
          title="Cita"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .25-1 1v1c0 .75.25 1 1 1z" />
            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h.25c.75 0 .75 0 .75 1v1c0 1-1 2-2 2s-1 .25-1 1v1c0 .75.25 1 1 1z" />
          </svg>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          activo={editor.isActive("code")}
          title="Código inline"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          activo={editor.isActive("codeBlock")}
          title="Bloque de código"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <polyline points="10 10 7 13 10 16" />
            <polyline points="14 10 17 13 14 16" />
          </svg>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Separador horizontal"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
            <line x1="3" y1="12" x2="21" y2="12" />
          </svg>
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarSeparator />

      {/* ─── Alineación ─── */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          activo={editor.isActive({ textAlign: "left" })}
          title="Alinear a la izquierda"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="15" y2="12" />
            <line x1="3" y1="18" x2="18" y2="18" />
          </svg>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          activo={editor.isActive({ textAlign: "center" })}
          title="Centrar"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="6" y1="12" x2="18" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          activo={editor.isActive({ textAlign: "right" })}
          title="Alinear a la derecha"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="9" y1="12" x2="21" y2="12" />
            <line x1="6" y1="18" x2="21" y2="18" />
          </svg>
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarSeparator />

      {/* ─── Enlaces e imágenes ─── */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={agregarEnlace}
          activo={editor.isActive("link")}
          title="Insertar/editar enlace"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </ToolbarButton>

        <ToolbarButton onClick={agregarImagen} title="Insertar imagen">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarSeparator />

      {/* ─── Deshacer / Rehacer ─── */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Deshacer (Ctrl+Z)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
            <path d="M3 7v6h6" />
            <path d="M21 17a9 9 0 0 0-15-6.7L3 13" />
          </svg>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Rehacer (Ctrl+Y)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
            <path d="M21 7v6h-6" />
            <path d="M3 17a9 9 0 0 1 15-6.7L21 13" />
          </svg>
        </ToolbarButton>
      </ToolbarGroup>
    </div>
  );
}

/* ─── Subcomponentes internos ─────────────────────────────────────── */

function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>;
}

function ToolbarSeparator() {
  return <span className="mx-1 h-6 w-px bg-neutral-300" aria-hidden="true" />;
}

type ToolbarButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  activo?: boolean;
  disabled?: boolean;
  title: string;
};

function ToolbarButton({
  onClick,
  children,
  activo = false,
  disabled = false,
  title,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={activo}
      className={`flex h-8 w-8 items-center justify-center rounded-md text-sm transition ${
        disabled
          ? "cursor-not-allowed text-neutral-300"
          : activo
          ? "bg-brand-green text-white shadow-sm"
          : "text-neutral-700 hover:bg-neutral-200"
      }`}
    >
      {children}
    </button>
  );
}