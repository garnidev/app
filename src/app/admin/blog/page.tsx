import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { BlogActionBar } from "@/components/admin/blog/BlogActionBar";
import { PostRow } from "@/components/admin/blog/PostRow";
import {
  contarPostsPorEstado,
  getPostsActivos,
} from "@/data/posts";

export default function BlogAdminPage() {
  const posts = getPostsActivos();
  const counts = contarPostsPorEstado();

  return (
    <div className="mx-auto max-w-7xl px-6 py-6 md:px-10 md:py-8">
      {/* Topbar con breadcrumbs + buscador */}
      <AdminTopbar
        breadcrumbs={[
          { label: "Administración del sitio", href: "/admin" },
          { label: "Gestor del blog" },
        ]}
      />

      {/* Encabezado: ícono + título + descripción */}
      <div className="mt-6">
        <AdminPageHeader
          icon="blog"
          titulo="Gestor del blog"
          descripcion="Crea y administra los artículos del blog de la Red Masa Madre. Publica, guarda borradores o archiva contenido."
        />
      </div>

      {/* Barra de acciones */}
      <div className="mt-6">
        <BlogActionBar
          totalActivos={counts.activos}
          totalArchivados={counts.archivados}
        />
      </div>

      {/* Listado de posts */}
      <div className="mt-6 flex flex-col gap-3">
        {posts.length === 0 ? (
          <EmptyState />
        ) : (
          posts.map((post) => <PostRow key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}

/* ─── Empty state ─────────────────────────────────────────────────── */

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
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M8 9h8M8 13h8M8 17h5" />
        </svg>
      </div>
      <h2 className="mt-4 text-lg font-bold text-neutral-900">
        Aún no hay artículos publicados
      </h2>
      <p className="mt-2 text-sm text-neutral-600">
        Empieza creando tu primer artículo del blog.
      </p>
    </div>
  );
}