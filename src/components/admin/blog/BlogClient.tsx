"use client";

import { useState, useMemo } from "react";
import type { PostDetalle } from "@/data/posts";
import { BlogActionBar, type FiltrosBlog } from "./BlogActionBar";
import { PostRow } from "./PostRow";

type Props = {
  posts: PostDetalle[];
  totalArchivados: number;
};

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function BlogClient({ posts, totalArchivados }: Props) {
  const [filtros, setFiltros] = useState<FiltrosBlog>({
    busqueda: "",
    estados: [],
    categorias: [],
  });

  /* ─── Aplicar filtros ────────────────────────────────────────── */
  const postsFiltrados = useMemo(() => {
    return posts.filter((post) => {
      // Filtro por búsqueda de texto
      if (filtros.busqueda.trim()) {
        const q = normalizar(filtros.busqueda);
        const haystack = normalizar(`${post.titulo} ${post.descripcion}`);
        if (!haystack.includes(q)) return false;
      }

      // Filtro por estado
      if (filtros.estados.length > 0) {
        if (!filtros.estados.includes(post.estado || "")) return false;
      }

      // Filtro por categoría
      if (filtros.categorias.length > 0) {
        if (!filtros.categorias.includes(post.categoria)) return false;
      }

      return true;
    });
  }, [posts, filtros]);

  return (
    <>
      {/* Barra de acciones con filtros */}
      <div className="mt-6">
        <BlogActionBar
          totalActivos={postsFiltrados.length}
          totalArchivados={totalArchivados}
          filtros={filtros}
          onFiltrosChange={setFiltros}
        />
      </div>

      {/* Listado de posts */}
      <div className="mt-6 flex flex-col gap-3">
        {postsFiltrados.length === 0 ? (
          <EmptyState hayFiltros={hayFiltrosActivos(filtros)} />
        ) : (
          postsFiltrados.map((post) => <PostRow key={post.id} post={post} />)
        )}
      </div>
    </>
  );
}

/* ─── Helpers ────────────────────────────────────────────────────── */

function hayFiltrosActivos(filtros: FiltrosBlog): boolean {
  return (
    filtros.busqueda.trim().length > 0 ||
    filtros.estados.length > 0 ||
    filtros.categorias.length > 0
  );
}

function EmptyState({ hayFiltros }: { hayFiltros: boolean }) {
  return (
    <div className="rounded-3xl bg-white p-10 text-center ring-1 ring-neutral-200">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-greenSoft">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-7 w-7 text-brand-green"
          aria-hidden="true"
        >
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M8 9h8M8 13h8M8 17h5" />
        </svg>
      </div>
      <h2 className="mt-4 text-lg font-bold text-neutral-900">
        {hayFiltros
          ? "No se encontraron artículos"
          : "Aún no hay artículos publicados"}
      </h2>
      <p className="mt-2 text-sm text-neutral-600">
        {hayFiltros
          ? "Prueba ajustando los filtros de búsqueda."
          : "Empieza creando tu primer artículo del blog."}
      </p>
    </div>
  );
}