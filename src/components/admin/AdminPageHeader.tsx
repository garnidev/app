import { AdminIcon } from "./AdminIcon";
import type { NavIcon } from "./navigation";

type Props = {
  icon: NavIcon;
  titulo: string;
  descripcion: string;
};

/**
 * Encabezado reutilizable para páginas del admin.
 * - Icono circular a la izquierda
 * - Título en support-navy italic
 * - Descripción en gris
 */
export function AdminPageHeader({ icon, titulo, descripcion }: Props) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-greenSoft text-brand-green">
        <AdminIcon name={icon} className="h-6 w-6" />
      </div>
      <div>
        <h1 className="text-2xl font-extrabold italic text-support-navy md:text-3xl">
          {titulo}
        </h1>
        <p className="mt-1 text-sm leading-relaxed text-neutral-600 md:text-base">
          {descripcion}
        </p>
      </div>
    </div>
  );
}