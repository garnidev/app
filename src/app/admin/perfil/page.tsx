import { redirect } from "next/navigation";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PerfilForm } from "@/components/admin/perfil/PerfilForm";
import { PasswordForm } from "@/components/admin/perfil/PasswordForm";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function PerfilPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const usuario = await prisma.usuario.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      nombre: true,
      email: true,
      imagen: true,
      rol: true,
    },
  });

  if (!usuario) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-6 md:px-10 md:py-8">
      <AdminTopbar
        breadcrumbs={[
          { label: "Administración del sitio", href: "/admin" },
          { label: "Mi perfil" },
        ]}
      />

      <div className="mt-6">
        <AdminPageHeader
          icon="blog"
          titulo="Mi perfil"
          descripcion="Administra tu información personal y seguridad de tu cuenta."
        />
      </div>

      {/* Grid de 2 columnas en desktop, 1 columna en móvil */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <PerfilForm usuarioInicial={usuario} />
        <PasswordForm />
      </div>
    </div>
  );
}