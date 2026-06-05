import Image from "next/image";
import { DashboardCard } from "@/components/admin/DashboardCard";
import { DashboardSearch } from "@/components/admin/DashboardSearch";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Página principal del Admin
 * ─────────────────────────────
 * Layout fit-to-screen: ocupa exactamente la altura del viewport sin scroll.
 * Usa `h-screen` con `overflow-hidden` para anular el `min-h-screen` del layout.
 */

export default async function AdminHomePage() {
  const usuario = await getCurrentUser();

  const [totalPanaderiasActivas, totalPostsPublicados, totalPostsBorrador] =
    await Promise.all([
      prisma.panaderia.count({ where: { estado: "ACTIVA" } }),
      prisma.post.count({ where: { estado: "PUBLICADO" } }),
      prisma.post.count({ where: { estado: "BORRADOR" } }),
    ]);

  const totalPosts = totalPostsPublicados + totalPostsBorrador;

  return (
    <div className="flex min-h-screen flex-col md:h-screen md:overflow-hidden">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-8 md:px-10 md:py-6">
        {/* ═══ HERO: imagen + bienvenida + buscador ═══ */}
        <section className="flex flex-col items-center text-center">
          <div className="relative w-full max-w-[200px] md:max-w-[400px]">
            <Image
              src="/assets/hero-bienvenida.svg"
              alt=""
              width={600}
              height={450}
              priority
              className="h-auto w-full"
              aria-hidden="true"
            />
          </div>

          <h1 className="mt-1 text-2xl font-extrabold italic text-support-navy md:text-3xl">
            Bienvenido
          </h1>

          <p className="mt-1 text-sm text-neutral-600 md:text-base">
            {usuario.rol === "admin"
              ? "Administra el contenido de la Red Masa Madre Colombia."
              : "Gestiona tu información en la Red Masa Madre Colombia."}
          </p>
          {/* Comentario de la barra de búsqueda: por ahora no tenemos nada que buscar, pero lo dejo aquí para que vean cómo quedaría integrado en el diseño. Cuando tengamos muchas panaderías o posts, será útil tener un buscador rápido en el dashboard. */}
          {/* <DashboardSearch /> */}
        </section>

        {/* ═══ CARDS DE ACCIÓN RÁPIDA ═══ */}
        <section
          className="mt-6 grid gap-4 md:mt-8 md:grid-cols-2 md:gap-6"
          aria-label="Acciones rápidas"
        >
          <DashboardCard
            icon="panaderias"
            titulo="Directorio de panaderías"
            descripcion="Gestiona los puntos aliados asociados al mapa interactivo de Colombia."
            badge={`${totalPanaderiasActivas} ${
              totalPanaderiasActivas === 1 ? "punto activo" : "puntos activos"
            }`}
            badgeColor="green"
            href="/admin/panaderias"
          />

          <DashboardCard
            icon="blog"
            titulo="Gestor del blog"
            descripcion="Crea, edita y publica artículos del blog sobre Masa Madre y panadería artesanal."
            badge={`${totalPosts} ${totalPosts === 1 ? "artículo" : "artículos"}`}
            badgeColor="blue"
            href="/admin/blog"
          />
        </section>
      </div>
    </div>
  );
}