import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { BlogClient } from "@/components/admin/blog/BlogClient";
import {
  contarPostsPorEstado,
  getPostsActivos,
} from "@/data/posts";

export default async function BlogAdminPage() {
  // Consultar posts + conteos en paralelo
  const [posts, counts] = await Promise.all([
    getPostsActivos(),
    contarPostsPorEstado(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-6 md:px-10 md:py-8">
      <AdminTopbar
        breadcrumbs={[
          { label: "Administración del sitio", href: "/admin" },
          { label: "Gestor del blog" },
        ]}
      />

      <div className="mt-6">
        <AdminPageHeader
          icon="blog"
          titulo="Gestor del blog"
          descripcion="Crea y administra los artículos del blog de la Red Masa Madre. Publica, guarda borradores o archiva contenido."
        />
      </div>

      <BlogClient posts={posts} totalArchivados={counts.archivados} />
    </div>
  );
}