import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GovBar } from "@/components/GovBar";
import { Header } from "@/components/Header";
import { PostHero } from "@/components/blog/PostHero";
import { PostContent } from "@/components/blog/PostContent";
import { PostTags } from "@/components/blog/PostTags";
import { CommentsSection } from "@/components/blog/CommentsSection";
import { getAllSlugs, getPostBySlug } from "@/data/posts";

/* ═══════════════════════════════════════════════════════════════════════
   GENERACIÓN ESTÁTICA
   ─────────────────────────────────────────────────────────────────────
   Next.js pre-genera una página por cada slug conocido en build time.
   Cuando conectes la BD, esta función hará un query a los slugs reales.
   ═══════════════════════════════════════════════════════════════════════ */

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

/* ═══════════════════════════════════════════════════════════════════════
   METADATA DINÁMICA (SEO por artículo)
   ═══════════════════════════════════════════════════════════════════════ */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Artículo no encontrado | Masa Madre" };
  }

  return {
    title: `${post.titulo} | Blog Masa Madre`,
    description: post.descripcion,
    openGraph: {
      title: post.titulo,
      description: post.descripcion,
      images: [{ url: post.imagen.src, alt: post.imagen.alt }],
      type: "article",
      publishedTime: post.fechaISO,
    },
  };
}

/* ═══════════════════════════════════════════════════════════════════════
   PÁGINA DE DETALLE
   ═══════════════════════════════════════════════════════════════════════ */

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  return (
    <>
      <GovBar />
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero con imagen, keyword, título y metadata */}
        <PostHero post={post} />

        {/* Contenido del artículo */}
        <section className="container-site relative z-10 pb-10">
          <PostContent lead={post.descripcion} contenido={post.contenido} />
          <PostTags tags={post.tags} />
          <CommentsSection comentariosIniciales={post.comentarios} />
        </section>
      </main>
    </>
  );
}