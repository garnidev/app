"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  slug: string;
  totalComentarios: number;
};

export function PostActions({ slug, totalComentarios }: Props) {
  const router = useRouter();
  const [archivando, setArchivando] = useState(false);

  const handleArchivar = async () => {
    if (!confirm("¿Archivar este artículo? Dejará de mostrarse en el blog público.")) {
      return;
    }

    setArchivando(true);
    try {
      const res = await fetch(`/api/posts/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "ARCHIVADO" }),
      });

      if (!res.ok) throw new Error("Error al archivar");

      router.refresh();
    } catch (error) {
      console.error("Error archivando:", error);
      alert("No se pudo archivar el artículo");
    } finally {
      setArchivando(false);
    }
  };

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2 md:flex-nowrap">
      <Link
        href={`/admin/blog/${slug}/editar`}
        className="inline-flex items-center gap-2 rounded-full bg-brand-greenSoft px-4 py-2 text-sm font-bold text-brand-green transition hover:bg-brand-green hover:text-white"
      >
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
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        Editar
      </Link>

      <Link
        href={`/admin/blog/${slug}/comentarios`}
        className="inline-flex items-center gap-2 rounded-full bg-brand-purple/10 px-4 py-2 text-sm font-bold text-brand-purpleDark transition hover:bg-brand-purple/20"
      >
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
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        Comentarios
        <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-brand-purpleDark px-1.5 text-xs font-bold text-white">
          {totalComentarios}
        </span>
      </Link>

      <button
        type="button"
        onClick={handleArchivar}
        disabled={archivando}
        className="inline-flex items-center gap-2 rounded-full border border-brand-purple/40 bg-white px-4 py-2 text-sm font-bold text-brand-purpleDark transition hover:bg-brand-purple/5 disabled:cursor-not-allowed disabled:opacity-50"
      >
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
          <rect x="3" y="4" width="18" height="4" rx="1" />
          <path d="M5 8v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" />
          <path d="M10 12h4" />
        </svg>
        {archivando ? "Archivando..." : "Archivar"}
      </button>
    </div>
  );
}