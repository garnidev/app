import Image from "next/image";
import { DashboardCard } from "@/components/admin/DashboardCard";
import { DashboardSearch } from "@/components/admin/DashboardSearch";
import { getCurrentUser } from "@/lib/auth";

export default function AdminHomePage() {
  const usuario = getCurrentUser();

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-14">
      {/* ═══ HERO: imagen + bienvenida + buscador ═══ */}
      <section className="flex flex-col items-center text-center">
        {/* Imagen decorativa */}
        <div className="relative w-full max-w-md">
          <Image
            src="/assets/admin/hero-bienvenida.png"
            alt=""
            width={600}
            height={450}
            priority
            className="h-auto w-full"
            aria-hidden="true"
          />
        </div>

        {/* Título */}
        <h1 className="mt-2 text-4xl font-extrabold italic text-support-navy md:text-5xl">
          Bienvenido
        </h1>

        {/* Subtítulo */}
        <p className="mt-3 text-base text-neutral-600 md:text-lg">
          {usuario.rol === "admin"
            ? "Administra el contenido de la Red Masa Madre Colombia."
            : "Gestiona tu información en la Red Masa Madre Colombia."}
        </p>

        {/* Buscador (client component) */}
        <DashboardSearch />
      </section>

      {/* ═══ CARDS DE ACCIÓN RÁPIDA ═══ */}
      <section
        className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2"
        aria-label="Acciones rápidas"
      >
        <DashboardCard
          icon="panaderias"
          titulo="Directorio de panaderías"
          descripcion="Gestiona los puntos aliados asociados al mapa interactivo de Colombia."
          badge="8 puntos activos"
          badgeColor="green"
          href="/admin/panaderias"
        />

        <DashboardCard
          icon="blog"
          titulo="Gestor del blog"
          descripcion="Crea, edita y publica artículos del blog sobre Masa Madre y panadería artesanal."
          badge="6 artículos"
          badgeColor="blue"
          href="/admin/blog"
        />
      </section>
    </div>
  );
}