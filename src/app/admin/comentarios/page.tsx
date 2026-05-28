import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ComentariosClient } from "@/components/admin/comentarios/ComentariosClient";

export default function ComentariosAdminPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-6 md:px-10 md:py-8">
      <AdminTopbar
        breadcrumbs={[
          { label: "Administración del sitio", href: "/admin" },
          { label: "Moderación de comentarios" },
        ]}
      />

      <div className="mt-6">
        <AdminPageHeader
          icon="blog"
          titulo="Moderación de comentarios"
          descripcion="Revisa, aprueba o rechaza los comentarios que los usuarios dejan en los artículos del blog."
        />
      </div>

      <ComentariosClient />
    </div>
  );
}