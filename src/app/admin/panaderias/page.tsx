import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PanaderiasClient } from "@/components/admin/panaderias/PanaderiasClient";
import { obtenerDepartamentos } from "@/data/departamentos";
import { obtenerCiudades } from "@/data/ciudades";

export default async function PanaderiasAdminPage() {
  // Cargar departamentos y ciudades para los filtros (Server Component)
  const [departamentos, ciudades] = await Promise.all([
    obtenerDepartamentos(),
    obtenerCiudades(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-6 md:px-10 md:py-8">
      <AdminTopbar
        breadcrumbs={[
          { label: "Administración del sitio", href: "/admin" },
          { label: "Directorio de panaderías" },
        ]}
      />

      <div className="mt-6">
        <AdminPageHeader
          icon="panaderias"
          titulo="Directorio de panaderías"
          descripcion="Gestionar nuestras panaderías aliadas."
        />
      </div>

      <PanaderiasClient
        departamentos={departamentos}
        ciudades={ciudades}
      />
    </div>
  );
}