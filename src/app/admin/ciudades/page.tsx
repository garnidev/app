import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CiudadesClient } from "@/components/admin/ciudades/CiudadesClient";
import { obtenerDepartamentos } from "@/data/departamentos";

export default async function CiudadesAdminPage() {
  const departamentos = await obtenerDepartamentos();

  return (
    <div className="mx-auto max-w-7xl px-6 py-6 md:px-10 md:py-8">
      <AdminTopbar
        breadcrumbs={[
          { label: "Administración del sitio", href: "/admin" },
          { label: "Directorio de ciudades" },
        ]}
      />

      <div className="mt-6">
        <AdminPageHeader
          icon="panaderias"
          titulo="Directorio de ciudades"
          descripcion="Gestionar todas las ciudades de Colombia."
        />
      </div>

      <CiudadesClient departamentos={departamentos} />
    </div>
  );
}