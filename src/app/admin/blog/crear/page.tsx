import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { PostEditor } from "@/components/admin/blog/PostEditor";

export default function CrearArticuloPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-6 md:px-10 md:py-8">
      <AdminTopbar
        breadcrumbs={[
          { label: "Administración del sitio", href: "/admin" },
          { label: "Gestor del blog", href: "/admin/blog" },
          { label: "Nuevo artículo" },
        ]}
      />

      {/* El editor incluye su propia barra de acciones con los botones
          de guardar/publicar, así que no usamos AdminPageHeader aquí.
          El título "Nueva entrada" lo renderiza el propio PostEditor. */}
      <PostEditor />
    </div>
  );
}