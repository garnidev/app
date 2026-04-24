"use client";

import { useState } from "react";
import Link from "next/link";
import type { Categoria, PostDetalle } from "@/data/posts";
import { RichTextEditor } from "./editor/RichTextEditor";
import { ImageUpload } from "./editor/ImageUpload";
import { CategoriaSelect } from "./editor/CategoriaSelect";
import { TagsInput } from "./editor/TagsInput";
import { PublishActions } from "./editor/PublishActions";

type Props = {
  /** Post existente para modo edición. Si es undefined, es creación. */
  postInicial?: PostDetalle;
};

type FormData = {
  titulo: string;
  contenido: string;
  imagen: { dataUrl: string | null; archivo: File | null };
  categoria: Categoria | "";
  keyword: string;
  tags: string[];
};

/**
 * Orquestador del formulario de creación/edición de artículos del blog.
 * - Columna izquierda: título + editor de texto enriquecido
 * - Columna derecha: imagen destacada + categoría + keyword + etiquetas
 * - Barra superior: volver + título + acciones (preview, guardar, publicar)
 *
 * Estado local completamente funcional (sin BD).
 * Al enviar, por ahora hace console.log del payload.
 * Cuando haya backend, reemplazar handleGuardar/handlePublicar con fetch.
 */
export function PostEditor({ postInicial }: Props) {
  const esEdicion = Boolean(postInicial);

  const [form, setForm] = useState<FormData>({
    titulo: postInicial?.titulo ?? "",
    contenido: postInicial?.contenido ?? "",
    imagen: {
      dataUrl: postInicial?.imagen.src ?? null,
      archivo: null,
    },
    categoria: postInicial?.categoria ?? "",
    keyword: postInicial?.keyword ?? "",
    tags: postInicial?.tags?.map((t) => t.label) ?? [],
  });

  const [enviando, setEnviando] = useState(false);
  const [errores, setErrores] = useState<string[]>([]);

  /* ─── Handlers de cambio por campo ──────────────────────────────── */
  const actualizar = <K extends keyof FormData>(campo: K, valor: FormData[K]) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  /* ─── Validación ────────────────────────────────────────────────── */
  const validar = (esPublicacion: boolean): string[] => {
    const errs: string[] = [];

    if (!form.titulo.trim()) errs.push("El título es obligatorio.");

    // Publicación exige más campos
    if (esPublicacion) {
      if (!form.contenido.trim() || form.contenido === "<p></p>") {
        errs.push("El contenido no puede estar vacío.");
      }
      if (!form.categoria) errs.push("Debes seleccionar una categoría.");
      if (!form.imagen.dataUrl) errs.push("Se requiere una imagen destacada.");
    }

    return errs;
  };

  /* ─── Handlers de submit ────────────────────────────────────────── */
  const handleGuardar = () => {
    const errs = validar(false);
    if (errs.length > 0) {
      setErrores(errs);
      return;
    }

    setErrores([]);
    setEnviando(true);

    // Simular envío
    setTimeout(() => {
      const payload = {
        estado: "borrador" as const,
        ...form,
      };
      console.log("📝 Guardando borrador:", payload);
      alert("Borrador guardado (ver consola para el payload)");
      setEnviando(false);
    }, 600);
  };

  const handlePublicar = () => {
    const errs = validar(true);
    if (errs.length > 0) {
      setErrores(errs);
      return;
    }

    setErrores([]);
    setEnviando(true);

    setTimeout(() => {
      const payload = {
        estado: "publicado" as const,
        ...form,
      };
      console.log("🚀 Publicando artículo:", payload);
      alert("Artículo publicado (ver consola para el payload)");
      setEnviando(false);
    }, 800);
  };

  return (
    <div className="mt-6">
      {/* ═══ Barra superior: volver + título + acciones ═══ */}
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog"
            aria-label="Volver al listado"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-purple/50 bg-white text-brand-purpleDark transition hover:bg-brand-purple/5"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>

          <h1 className="text-2xl font-extrabold italic text-support-navy md:text-3xl">
            {esEdicion ? "Editar entrada" : "Nueva entrada"}
          </h1>
        </div>

        <PublishActions
          onGuardar={handleGuardar}
          onPublicar={handlePublicar}
          previewHref={postInicial?.slug ? `/blog/${postInicial.slug}` : undefined}
          enviando={enviando}
        />
      </div>

      {/* ═══ Errores de validación ═══ */}
      {errores.length > 0 && (
        <div
          role="alert"
          className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4"
        >
          <p className="mb-1 text-sm font-bold text-red-700">
            Por favor corrige lo siguiente:
          </p>
          <ul className="list-disc pl-5 text-sm text-red-700">
            {errores.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ═══ Título del artículo (input grande sin borde) ═══ */}
      <div className="mt-8">
        <label htmlFor="titulo" className="sr-only">
          Título del artículo
        </label>
        <input
          id="titulo"
          type="text"
          value={form.titulo}
          onChange={(e) => actualizar("titulo", e.target.value)}
          placeholder="Ingrese un título"
          className="w-full border-0 bg-transparent text-2xl font-bold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-0 md:text-3xl"
        />
      </div>

      {/* ═══ Grid de 2 columnas (editor + panel lateral) ═══ */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px] lg:gap-8">
        {/* ─── Columna izquierda: editor ─── */}
        <div>
          <RichTextEditor
            contenidoInicial={form.contenido}
            onChange={(html) => actualizar("contenido", html)}
          />
        </div>

        {/* ─── Columna derecha: metadatos ─── */}
        <aside className="space-y-6">
          {/* Imagen destacada */}
          <ImageUpload
            imagenInicial={form.imagen.dataUrl ?? undefined}
            onChange={(dataUrl, archivo) =>
              actualizar("imagen", { dataUrl, archivo })
            }
          />

          {/* Card: Categorías y etiquetas */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-neutral-500">
              Categorías y etiquetas
            </h2>

            <div className="space-y-5">
              {/* Categoría */}
              <CategoriaSelect
                value={form.categoria}
                onChange={(cat) => actualizar("categoria", cat)}
              />

              {/* Keyword */}
              <div>
                <label
                  htmlFor="keyword"
                  className="mb-2 block text-sm font-semibold text-neutral-800"
                >
                  Palabra clave
                </label>
                <input
                  id="keyword"
                  type="text"
                  value={form.keyword}
                  onChange={(e) =>
                    actualizar("keyword", e.target.value.toUpperCase())
                  }
                  placeholder="CULTIVO"
                  maxLength={15}
                  className="w-full rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-sm uppercase tracking-wider text-neutral-800 transition placeholder:text-neutral-400 placeholder:normal-case focus:border-brand-green focus:outline-none focus:ring-4 focus:ring-brand-green/15"
                />
                <p className="mt-1 text-xs text-neutral-500">
                  Aparece en la píldora dorada del artículo. Máx. 15 caracteres.
                </p>
              </div>

              {/* Etiquetas */}
              <TagsInput
                tags={form.tags}
                onChange={(tags) => actualizar("tags", tags)}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}