import Link from "next/link";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PostRowArchivo } from "@/components/admin/blog/PostRowArchivo";
import { getPostsArchivados } from "@/data/posts";

export default async function BlogArchivoPage() {
  const posts = await getPostsArchivados();

  return (
    <div className="mx-auto max-w-7xl px-6 py-6 md:px-10 md:py-8">
      <AdminTopbar
        breadcrumbs={[
          { label: "Administración del sitio", href: "/admin" },
          { label: "Gestor del blog", href: "/admin/blog" },
          { label: "Archivo" },
        ]}
      />

      <div className="mt-6">
        <AdminPageHeader
          icon="blog"
          titulo="Archivo del blog"
          descripcion="Artículos archivados. Puedes restaurarlos o eliminarlos permanentemente."
        />
      </div>

      {/* Botón de volver */}
      <div className="mt-6">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-2 rounded-full border border-brand-purple/40 bg-white px-4 py-2 text-sm font-semibold text-brand-purpleDark transition hover:bg-brand-purple/5"
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
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Volver al listado
        </Link>
      </div>

      {/* Listado de archivados */}
      <div className="mt-6 flex flex-col gap-3">
        {posts.length === 0 ? (
          <EmptyState />
        ) : (
          posts.map((post) => <PostRowArchivo key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}

function EmptyState() {
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
          <rect x="3" y="4" width="18" height="4" rx="1" />
          <path d="M5 8v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" />
          <path d="M10 12h4" />
        </svg>
      </div>
      <h2 className="mt-4 text-lg font-bold text-neutral-900">
        No hay artículos archivados
      </h2>
      <p className="mt-2 text-sm text-neutral-600">
        Los artículos que archives aparecerán aquí.
      </p>
    </div>
  );
}