import { notFound } from "next/navigation";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { PostEditor } from "@/components/admin/blog/PostEditor";
import { getPostBySlug } from "@/data/posts";

export default async function EditarArticuloPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  return (
    <div className="mx-auto max-w-7xl px-6 py-6 md:px-10 md:py-8">
      <AdminTopbar
        breadcrumbs={[
          { label: "Administración del sitio", href: "/admin" },
          { label: "Gestor del blog", href: "/admin/blog" },
          { label: "Editar artículo" },
        ]}
      />

      {/* El editor recibe el post existente y pre-carga todos los campos */}
      <PostEditor postInicial={post} />
    </div>
  );
}