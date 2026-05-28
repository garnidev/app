import { notFound } from "next/navigation";
import Link from "next/link";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ComentariosClient } from "@/components/admin/comentarios/ComentariosClient";
import { getPostBySlug } from "@/data/posts";

export default async function ComentariosPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return (
    <div className="mx-auto max-w-7xl px-6 py-6 md:px-10 md:py-8">
      <AdminTopbar
        breadcrumbs={[
          { label: "Administración del sitio", href: "/admin" },
          { label: "Gestor del blog", href: "/admin/blog" },
          { label: "Comentarios" },
        ]}
      />

      <div className="mt-6">
        <AdminPageHeader
          icon="blog"
          titulo="Comentarios del artículo"
          descripcion={`Modera los comentarios del artículo "${post.titulo}".`}
        />
      </div>

      {/* Link al artículo */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Link
          href={`/blog/${post.slug}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-purple/10 px-4 py-2 text-sm font-semibold text-brand-purpleDark transition hover:bg-brand-purple/20"
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
            <path d="M14 3h7v7M10 14L21 3M21 14v7H3V3h7" />
          </svg>
          <span>Ver el artículo</span>
        </Link>

        <Link
          href={`/admin/blog/${post.slug}/editar`}
          className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
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
          <span>Editar artículo</span>
        </Link>
      </div>

      {/* Tabs + listado de comentarios del post */}
      <ComentariosClient
        postSlug={slug}
        mostrarPostLink={false}
      />
    </div>
  );
}