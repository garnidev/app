import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PanaderiasArchivoClient } from "@/components/admin/panaderias/PanaderiasArchivoClient";
import { obtenerDepartamentos } from "@/data/departamentos";
import { obtenerCiudades } from "@/data/ciudades";

export default async function PanaderiasArchivoPage() {
  const [departamentos, ciudades] = await Promise.all([
    obtenerDepartamentos(),
    obtenerCiudades(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-6 md:px-10 md:py-8">
      <AdminTopbar
        breadcrumbs={[
          { label: "Administración del sitio", href: "/admin" },
          { label: "Directorio de panaderías", href: "/admin/panaderias" },
          { label: "Archivo" },
        ]}
      />

      <div className="mt-6">
        <AdminPageHeader
          icon="panaderias"
          titulo="Archivo de panaderías"
          descripcion="Panaderías archivadas. Puedes editarlas, restaurarlas o eliminarlas permanentemente."
        />
      </div>

      <PanaderiasArchivoClient
        departamentos={departamentos}
        ciudades={ciudades}
      />
    </div>
  );
}