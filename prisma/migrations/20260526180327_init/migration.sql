-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'PANADERIA', 'CIUDADANO');

-- CreateEnum
CREATE TYPE "EstadoPanaderia" AS ENUM ('ACTIVA', 'PENDIENTE', 'INACTIVA', 'RECHAZADA');

-- CreateEnum
CREATE TYPE "EstadoPost" AS ENUM ('BORRADOR', 'PUBLICADO', 'ARCHIVADO');

-- CreateEnum
CREATE TYPE "EstadoComentario" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nombre" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "passwordHash" TEXT,
    "imagen" TEXT,
    "rol" "Rol" NOT NULL DEFAULT 'ADMIN',
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuentas" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "cuentas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sesiones" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sesiones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens_verificacion" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "departamentos" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "imagen" TEXT NOT NULL,
    "coordsLng" DOUBLE PRECISION NOT NULL,
    "coordsLat" DOUBLE PRECISION NOT NULL,
    "zoomNivel" DOUBLE PRECISION NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ciudades" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "imagen" TEXT NOT NULL,
    "departamentoId" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ciudades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panaderias" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcionCorta" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT,
    "direccion" TEXT NOT NULL,
    "urlGoogleMaps" TEXT NOT NULL,
    "imagen" TEXT NOT NULL,
    "horario" TEXT NOT NULL,
    "imagenesCarrusel" TEXT[],
    "coordsLng" DOUBLE PRECISION NOT NULL,
    "coordsLat" DOUBLE PRECISION NOT NULL,
    "ciudadId" TEXT NOT NULL,
    "departamentoId" TEXT NOT NULL,
    "usuarioId" TEXT,
    "estado" "EstadoPanaderia" NOT NULL DEFAULT 'ACTIVA',
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "panaderias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "precio" INTEGER NOT NULL,
    "imagen" TEXT NOT NULL,
    "panaderiaId" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "keyword" TEXT,
    "imagen" TEXT NOT NULL,
    "fechaIso" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoPost" NOT NULL DEFAULT 'BORRADOR',
    "autorId" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_tags" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "icon" TEXT,

    CONSTRAINT "post_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comentarios" (
    "id" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "avatar" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" "EstadoComentario" NOT NULL DEFAULT 'PENDIENTE',
    "postId" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comentarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "cuentas_provider_providerAccountId_key" ON "cuentas"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sesiones_sessionToken_key" ON "sesiones"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_verificacion_token_key" ON "tokens_verificacion"("token");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_verificacion_identifier_token_key" ON "tokens_verificacion"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "departamentos_slug_key" ON "departamentos"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "departamentos_nombre_key" ON "departamentos"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "ciudades_slug_key" ON "ciudades"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ciudades_slug_departamentoId_key" ON "ciudades"("slug", "departamentoId");

-- CreateIndex
CREATE UNIQUE INDEX "panaderias_usuarioId_key" ON "panaderias"("usuarioId");

-- CreateIndex
CREATE INDEX "panaderias_departamentoId_idx" ON "panaderias"("departamentoId");

-- CreateIndex
CREATE INDEX "panaderias_ciudadId_idx" ON "panaderias"("ciudadId");

-- CreateIndex
CREATE INDEX "panaderias_estado_idx" ON "panaderias"("estado");

-- CreateIndex
CREATE INDEX "productos_panaderiaId_idx" ON "productos"("panaderiaId");

-- CreateIndex
CREATE UNIQUE INDEX "posts_slug_key" ON "posts"("slug");

-- CreateIndex
CREATE INDEX "posts_estado_idx" ON "posts"("estado");

-- CreateIndex
CREATE INDEX "posts_categoria_idx" ON "posts"("categoria");

-- CreateIndex
CREATE INDEX "post_tags_postId_idx" ON "post_tags"("postId");

-- CreateIndex
CREATE INDEX "comentarios_postId_idx" ON "comentarios"("postId");

-- CreateIndex
CREATE INDEX "comentarios_estado_idx" ON "comentarios"("estado");

-- AddForeignKey
ALTER TABLE "cuentas" ADD CONSTRAINT "cuentas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesiones" ADD CONSTRAINT "sesiones_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ciudades" ADD CONSTRAINT "ciudades_departamentoId_fkey" FOREIGN KEY ("departamentoId") REFERENCES "departamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panaderias" ADD CONSTRAINT "panaderias_ciudadId_fkey" FOREIGN KEY ("ciudadId") REFERENCES "ciudades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panaderias" ADD CONSTRAINT "panaderias_departamentoId_fkey" FOREIGN KEY ("departamentoId") REFERENCES "departamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panaderias" ADD CONSTRAINT "panaderias_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_panaderiaId_fkey" FOREIGN KEY ("panaderiaId") REFERENCES "panaderias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
