<div align="center">

# 🥖 Masa Madre Colombia

**Portal nacional de panaderías artesanales con masa madre**

Iniciativa del SENA, CampeSENA y Full Popular para preservar y promover
la tradición ancestral del pan de masa madre en Colombia.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Auth.js](https://img.shields.io/badge/Auth.js-v5-7B5BD8)](https://authjs.dev/)
[![Vercel](https://img.shields.io/badge/Vercel-deployed-000000?logo=vercel)](https://masamadre-nine.vercel.app/)
[![Vercel Blob](https://img.shields.io/badge/Vercel_Blob-storage-000000?logo=vercel)](https://vercel.com/docs/vercel-blob)

[🌐 Demo en vivo](https://masamadre-nine.vercel.app/) · [📂 Repositorio](https://github.com/garnidev/app) · [🐛 Reportar bug](https://github.com/garnidev/app/issues)

</div>

---

## 📑 Tabla de contenidos

- [Sobre el proyecto](#-sobre-el-proyecto)
- [Características](#-características)
- [Stack tecnológico](#-stack-tecnológico)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Instalación local](#-instalación-local)
- [Configuración de la base de datos](#-configuración-de-la-base-de-datos)
- [Variables de entorno](#-variables-de-entorno)
- [Scripts disponibles](#-scripts-disponibles)
- [Almacenamiento de imágenes](#-almacenamiento-de-imágenes)
- [Arquitectura de autenticación](#-arquitectura-de-autenticación)
- [Roles y permisos](#-roles-y-permisos)
- [API endpoints](#-api-endpoints)
- [Deploy](#-deploy)
- [Equipo](#-equipo)
- [Licencia](#-licencia)

---

## 🌎 Sobre el proyecto

**Masa Madre Colombia** es una plataforma web que conecta a panaderías artesanales que trabajan con masa madre en todo el territorio colombiano. El proyecto nace en el marco de la iniciativa **CampeSENA** del Servicio Nacional de Aprendizaje (SENA) en alianza con **Full Popular**, con el objetivo de preservar las técnicas tradicionales de panadería y dar visibilidad a los productores locales.

### Misión

Promover el consumo de pan artesanal hecho con masa madre, conectando consumidores con panaderías aliadas a través de un mapa interactivo nacional y un blog editorial dedicado a la cultura del pan.

### Objetivos

- 🗺️ **Mapa interactivo** con todas las panaderías aliadas en Colombia
- 📝 **Blog editorial** con artículos sobre técnicas, tradición y territorio
- 🏛️ **Directorio de ciudades** con información de cada municipio
- 👥 **Panel administrativo** para gestionar contenido (artículos, panaderías, productos)
- 📱 **Diseño responsive** optimizado para móvil y escritorio

---

## ✨ Características

### 🌐 Frontend público

| Característica | Descripción |
|---|---|
| **Página principal** | Hero, beneficios, embajadores, testimonios |
| **Mapa interactivo** | Mapbox con clusters de panaderías por ciudad |
| **Blog editorial** | Listado y detalle de artículos con sistema de comentarios |
| **Detalle de panadería** | Información completa, productos, ubicación |
| **Búsqueda y filtros** | Por departamento, ciudad y categoría |
| **Responsive total** | Optimizado para móvil real (no solo DevTools) |

### 🛡️ Panel administrativo

| Módulo | Funcionalidades |
|---|---|
| **Dashboard** | Estadísticas rápidas + acceso directo a módulos |
| **Blog** | CRUD de artículos con editor Tiptap, gestión de comentarios global y por artículo, filtros, archivado |
| **Panaderías** | CRUD completo con drawer modal, gestión de productos, extracción automática de coordenadas desde URL de Google Maps, archivado |
| **Ciudades** | 1.022 municipios de Colombia con CRUD, paginación, búsqueda y filtro por departamento |
| **Mi perfil** | Editar nombre, avatar (drag-and-drop) y contraseña |
| **Autenticación** | Login con email + contraseña, sesiones JWT, logout |

### 🎨 Detalles técnicos destacados

- 🔐 Autenticación con **Auth.js v5** (NextAuth) + estrategia JWT
- 🗄️ ORM **Prisma 6** con PostgreSQL
- 🖼️ Upload de imágenes a **Vercel Blob** (almacenamiento serverless) con drag-and-drop
- 🗑️ **Eliminación automática híbrida** de imágenes (Blob en producción, filesystem en legacy) al actualizar o eliminar entidades
- 🔒 **Middleware desacoplado** (`auth.config.ts`) compatible con Edge Runtime para mantener el bundle bajo el límite de Vercel
- 📍 **Extracción automática** de coordenadas desde URLs de Google Maps
- 🔄 **Estados de archivado** para blog y panaderías (con restaurar/eliminar definitivo)
- 📊 **Paginación server-side** para listados grandes (ej: 1.022 ciudades)
- ⚡ **Filtros client-side** con `useMemo` para experiencia instantánea
- 🌐 URLs inteligentes: endpoints aceptan **id o slug** indistintamente

---

## 🛠️ Stack tecnológico

### Core
- **[Next.js 15](https://nextjs.org/)** — App Router, Server Components, Server Actions
- **[React 19](https://react.dev/)** — UI library
- **[TypeScript 5](https://www.typescriptlang.org/)** — strict mode

### Styling
- **[Tailwind CSS 3](https://tailwindcss.com/)** — utility-first CSS
- Sistema de diseño con tokens custom (brand colors, fuentes, espaciado)

### Base de datos
- **[PostgreSQL 16](https://www.postgresql.org/)** — base de datos relacional
- **[Prisma 6](https://www.prisma.io/)** — ORM con migraciones

### Autenticación
- **[Auth.js v5](https://authjs.dev/)** (antes NextAuth) — sesiones JWT
- **[bcryptjs](https://www.npmjs.com/package/bcryptjs)** — hash de contraseñas

### Editor y contenido
- **[Tiptap 2](https://tiptap.dev/)** — editor WYSIWYG para el blog
- **[Mapbox GL JS](https://www.mapbox.com/)** — mapas interactivos

### Infraestructura
- **[Vercel](https://vercel.com/)** — hosting y deploy continuo
- **[Neon](https://neon.tech/)** — PostgreSQL serverless en producción
- **[Vercel Blob](https://vercel.com/docs/vercel-blob)** — almacenamiento de imágenes subidas

---

## 📁 Estructura del proyecto

```
masamadre/
├── prisma/
│   ├── schema.prisma                 # Modelo de datos
│   ├── migrations/                   # Migraciones SQL
│   ├── seed.ts                       # Seed de datos iniciales
│   ├── seed-ciudades.ts              # Seed de 1.022 municipios
│   └── data/
│       └── municipios-colombia.json  # Dataset de municipios
│
├── public/assets/                    # Imágenes estáticas
│   └── departamentos/                # Imágenes de los 32 departamentos
│
├── src/
│   ├── app/                          # App Router de Next.js
│   │   ├── (public)/                 # Rutas públicas
│   │   │   ├── page.tsx              # Home
│   │   │   ├── blog/                 # Blog público
│   │   │   ├── panaderias/           # Mapa de panaderías
│   │   │   └── ciudades/             # Detalle por ciudad
│   │   ├── admin/                    # Panel administrativo
│   │   │   ├── page.tsx              # Dashboard
│   │   │   ├── blog/                 # Gestor del blog
│   │   │   ├── panaderias/           # Directorio de panaderías
│   │   │   ├── ciudades/             # Directorio de ciudades
│   │   │   ├── comentarios/          # Moderación de comentarios
│   │   │   ├── perfil/               # Mi perfil
│   │   │   └── layout.tsx            # Layout con sidebar (force-dynamic)
│   │   ├── api/                      # API Routes
│   │   │   ├── auth/                 # NextAuth handlers
│   │   │   ├── posts/                # CRUD blog
│   │   │   ├── panaderias/           # CRUD panaderías
│   │   │   ├── productos/            # CRUD productos
│   │   │   ├── ciudades/             # CRUD ciudades
│   │   │   ├── departamentos/        # Listar departamentos
│   │   │   ├── comentarios/          # Moderación
│   │   │   ├── users/me/             # Perfil del usuario
│   │   │   └── upload/               # Endpoints de upload por módulo (Vercel Blob)
│   │   ├── login/                    # Página de login
│   │   └── layout.tsx                # Layout raíz
│   │
│   ├── components/
│   │   ├── admin/                    # Componentes del admin
│   │   ├── blog/                     # Componentes del blog público
│   │   ├── panaderias/               # Componentes de panaderías
│   │   ├── Header.tsx                # Header público
│   │   ├── Hero.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   │
│   ├── data/                         # Capa de acceso a datos
│   │   ├── posts.ts                  # Helpers de blog
│   │   ├── panaderias.ts
│   │   ├── ciudades.ts
│   │   └── departamentos.ts
│   │
│   ├── lib/
│   │   ├── prisma.ts                 # Cliente Prisma singleton
│   │   ├── auth.ts                   # Helper getCurrentUser
│   │   ├── blobStorage.ts            # Subida de imágenes a Vercel Blob
│   │   ├── imageStorage.ts           # Eliminación híbrida (Blob + filesystem)
│   │   └── parseGoogleMaps.ts        # Extracción de coords
│   │
│   ├── auth.ts                       # Config completa Auth.js (Node Runtime)
│   ├── auth.config.ts                # Config Edge-compatible (sin Prisma)
│   └── middleware.ts                 # Middleware de autenticación (Edge)
│
├── .env.example                      # Ejemplo de variables de entorno
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🚀 Instalación local

### Prerrequisitos

- **Node.js 20+**
- **npm 10+** (o pnpm/yarn)
- **PostgreSQL 16+** local o remoto
- **Git**

### Pasos

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/garnidev/app.git
   cd app
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   Copia el archivo de ejemplo y edítalo:

   ```bash
   cp .env.example .env
   ```

   Ver la sección [Variables de entorno](#-variables-de-entorno) para más detalle.

4. **Configurar la base de datos**

   ```bash
   # Generar el cliente de Prisma
   npx prisma generate

   # Crear tablas en la BD
   npx prisma migrate dev

   # Cargar datos iniciales (departamentos, posts de ejemplo, etc.)
   npx prisma db seed

   # Cargar los 1.022 municipios de Colombia
   npx tsx prisma/seed-ciudades.ts
   ```

5. **Iniciar el servidor de desarrollo**

   ```bash
   npm run dev
   ```

6. **Abrir en el navegador**

   - Sitio público: [http://localhost:3000](http://localhost:3000)
   - Panel admin: [http://localhost:3000/admin](http://localhost:3000/admin)
   - Prisma Studio (BD): `npx prisma studio` → [http://localhost:5555](http://localhost:5555)

### 👤 Credenciales del seed

Tras correr `prisma db seed`, se crea un usuario administrador:

```
Email:      admin@masamadre.co
Contraseña: admin123
```

> ⚠️ **Cambiar inmediatamente en producción** desde `/admin/perfil`.

---

## 🗄️ Configuración de la base de datos

### Opción 1: PostgreSQL local

1. Instalar PostgreSQL desde [postgresql.org](https://www.postgresql.org/download/)
2. Crear una base de datos:

   ```bash
   psql -U postgres
   CREATE DATABASE masamadre_db;
   ```

3. Actualizar `.env`:

   ```env
   DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/masamadre_db"
   ```

### Opción 2: PostgreSQL en la nube (usado en producción)

El proyecto en producción usa **[Neon](https://neon.tech/)** (PostgreSQL serverless con plan gratuito generoso).

1. Crear un proyecto en Neon
2. Copiar el **connection string pooled** (incluye `-pooler` en el host)
3. Usarlo como `DATABASE_URL`

Otros servicios compatibles: Supabase, Railway, Vercel Postgres.

---

## 🔐 Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con:

```env
# ────── Base de datos ──────
DATABASE_URL="postgresql://usuario:password@host:5432/masamadre_db"

# ────── Auth.js (NextAuth) ──────
AUTH_SECRET="genera-uno-con-openssl-rand-base64-32"
AUTH_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"

# ────── Mapbox ──────
NEXT_PUBLIC_MAPBOX_TOKEN="pk.eyJ1IjoiTu-token-de-Mapbox"

# ────── Vercel Blob ──────
# Generado automáticamente al crear el store de Blob en Vercel
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxxxxxxxxx"

# ────── API URL (opcional) ──────
# Útil cuando se accede desde IP local o dominio externo
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 🔑 Generar AUTH_SECRET

```bash
# Linux/macOS
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Min 0 -Max 256 }))
```

### 🗺️ Mapbox token

1. Crear cuenta gratis en [mapbox.com](https://mapbox.com)
2. Ir a [Account → Access tokens](https://account.mapbox.com/access-tokens/)
3. Copiar el `Default public token` y pegarlo en `.env`

### 🪣 Vercel Blob token

El `BLOB_READ_WRITE_TOKEN` se genera automáticamente al crear el store de Blob en Vercel (ver sección [Deploy](#-deploy)). Para desarrollo local, cópialo desde el dashboard de Vercel a tu `.env`.

---

## 📜 Scripts disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo (http://localhost:3000)
npm run build            # Build de producción
npm run start            # Inicia servidor de producción

# Calidad de código
npm run lint             # Ejecuta ESLint

# Base de datos
npx prisma studio        # GUI para explorar la BD (http://localhost:5555)
npx prisma generate      # Regenera el cliente de Prisma
npx prisma migrate dev   # Aplica migraciones en desarrollo
npx prisma migrate deploy # Aplica migraciones en producción
npx prisma db seed       # Carga datos iniciales

# Seeds especiales
npx tsx prisma/seed-ciudades.ts                 # Carga 1.022 municipios
```

---

## 🖼️ Almacenamiento de imágenes

El proyecto usa un esquema **híbrido** de almacenamiento de imágenes.

### Imágenes subidas por usuarios → Vercel Blob

Las imágenes que se suben desde el panel admin se almacenan en **[Vercel Blob](https://vercel.com/docs/vercel-blob)** (almacenamiento de objetos serverless), ya que el filesystem de Vercel es de solo lectura en producción.

| Módulo | Carpeta lógica en Blob | Endpoint | Límite |
|---|---|---|---|
| Blog | `blog/` | `/api/upload/blog` | 2 MB |
| Panaderías | `panaderias/` | `/api/upload/panaderias` | 2 MB |
| Productos | `productos/` | `/api/upload/productos` | 2 MB |
| Ciudades | `ciudades/` | `/api/upload/ciudades` | 2 MB |
| Avatares | `avatares/` | `/api/upload/avatares` | 1 MB |

La lógica de subida está centralizada en `src/lib/blobStorage.ts`. Genera nombres únicos (timestamp + sufijo aleatorio) y valida tipo (JPEG, PNG, WEBP) y tamaño.

### Imágenes estáticas → /public/assets/

Las imágenes fijas del proyecto (que vienen con el seed y no se editan) se sirven estáticas desde `/public/assets/`:

| Carpeta | Contenido |
|---|---|
| `/public/assets/departamentos/` | Imágenes de los 32 departamentos de Colombia |

### Limpieza automática

Al actualizar o eliminar una entidad, el sistema **borra automáticamente** la imagen anterior de su origen correspondiente. La lógica está en `src/lib/imageStorage.ts`, que **detecta automáticamente** si la imagen está en Blob (`*.blob.vercel-storage.com`) o en el filesystem, y la elimina del lugar correcto. Las imágenes por defecto y las de departamentos están protegidas y nunca se eliminan.

### Configuración de next/image

Para que `next/image` pueda servir las imágenes de Blob, el dominio está permitido en `next.config.ts`:

```ts
images: {
  remotePatterns: [
    { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
  ],
}
```

---

## 🔒 Arquitectura de autenticación

La autenticación usa **Auth.js v5** con una arquitectura de configuración dividida para ser compatible con el **Edge Runtime** de Vercel.

| Archivo | Contenido | Runtime |
|---|---|---|
| `src/auth.config.ts` | Configuración base: páginas, callbacks, estrategia de sesión. **Sin Prisma ni bcryptjs.** | Edge-compatible |
| `src/auth.ts` | Configuración completa: importa `auth.config` + adapter Prisma + provider Credentials con bcryptjs | Node Runtime |
| `src/middleware.ts` | Importa solo `auth.config` para proteger rutas `/admin`. | Edge Runtime |

### ¿Por qué esta separación?

El middleware corre en el **Edge Runtime**, que tiene un límite de **1 MB** por función en el plan gratuito de Vercel. Si el middleware importara el `auth.ts` completo (con Prisma + bcryptjs), el bundle superaría ese límite y el deploy fallaría.

La validación de credenciales contra la BD ocurre solo en el endpoint de login (Node Runtime). Una vez logueado, el JWT contiene el `id` y `rol` del usuario, que el middleware lee sin tocar la base de datos.

---

## 👥 Roles y permisos

El sistema maneja 3 roles:

| Rol | Acceso |
|---|---|
| `ADMIN` | Acceso completo al panel `/admin` + CRUD de todo el contenido |
| `PANADERIA` | Acceso limitado a editar su propia panadería (futuro) |
| `CIUDADANO` | Solo lectura del frontend público (futuro) |

Los endpoints están protegidos verificando la sesión y el rol en cada request.

---

## 🔌 API endpoints

### Autenticación

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/auth/signin` | Iniciar sesión (gestionado por NextAuth) |
| `POST` | `/api/auth/signout` | Cerrar sesión |
| `GET` | `/api/auth/session` | Obtener sesión actual |

### Blog

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/posts` | Listar posts con filtros |
| `POST` | `/api/posts` | Crear post |
| `GET` | `/api/posts/[slug]` | Detalle de un post |
| `PUT` | `/api/posts/[slug]` | Actualizar post |
| `DELETE` | `/api/posts/[slug]` | Eliminar post |
| `POST` | `/api/posts/[slug]/comentarios` | Comentar |

### Panaderías

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/panaderias` | Listar con filtros |
| `POST` | `/api/panaderias` | Crear |
| `GET` | `/api/panaderias/[id]` | Detalle |
| `PUT` | `/api/panaderias/[id]` | Actualizar |
| `DELETE` | `/api/panaderias/[id]` | Eliminar |
| `POST` | `/api/panaderias/[id]/productos` | Agregar producto |

### Productos

| Método | Endpoint | Descripción |
|---|---|---|
| `PUT` | `/api/productos/[id]` | Editar |
| `DELETE` | `/api/productos/[id]` | Eliminar |

### Ciudades

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/ciudades` | Listar con paginación |
| `GET` | `/api/ciudades/[id]` | Detalle (acepta id o slug) |
| `PUT` | `/api/ciudades/[id]` | Editar |

### Usuario

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/users/me` | Datos del usuario actual |
| `PUT` | `/api/users/me` | Editar perfil |
| `PUT` | `/api/users/me/password` | Cambiar contraseña |

### Uploads

Todos los endpoints de upload son `POST`, aceptan un `FormData` con un campo `file` y devuelven `{ url, filename, size, type }`. Las imágenes se almacenan en Vercel Blob.

- `/api/upload/blog`
- `/api/upload/panaderias`
- `/api/upload/productos`
- `/api/upload/ciudades`
- `/api/upload/avatares`

---

## 🌐 Deploy

El proyecto está desplegado en **Vercel**:

🔗 **[https://masamadre-nine.vercel.app/](https://masamadre-nine.vercel.app/)**

### Configuración del deploy

1. **Crear cuenta en [Vercel](https://vercel.com)** y conectar GitHub
2. **Importar el repositorio** `garnidev/app`
3. **Configurar variables de entorno** (Settings → Environment Variables)
4. **Deploy automático** en cada `git push` a `master`

### Base de datos en producción (Neon)

1. Crear proyecto en [Neon](https://neon.tech/)
2. Copiar la connection string **pooled**
3. Pegarla en `DATABASE_URL` de Vercel
4. Ejecutar migraciones y seeds desde local apuntando a Neon:

   ```bash
   # PowerShell (la variable dura solo en esta ventana)
   $env:DATABASE_URL="postgresql://...neon.tech/..."

   npx prisma migrate deploy
   npx prisma db seed
   npx tsx prisma/seed-ciudades.ts
   ```

### Almacenamiento de imágenes en producción (Vercel Blob)

El proyecto usa **Vercel Blob** para las imágenes subidas. Para configurarlo:

1. En el dashboard de Vercel, ve a **Storage → Create Database → Blob**
2. Vercel agrega automáticamente la variable `BLOB_READ_WRITE_TOKEN` al proyecto
3. Para desarrollo local, copia ese token a tu `.env`

### Notas técnicas del deploy

- El middleware está separado en `src/auth.config.ts` (sin Prisma ni bcryptjs) para mantenerse compatible con el Edge Runtime y bajo el límite de 1 MB.
- Las rutas del admin usan `export const dynamic = "force-dynamic"` para evitar el prerenderizado estático (dependen de sesión y BD).
- El detalle del blog (`/blog/[slug]`) también es dinámico para no requerir acceso a BD durante el build.

### Variables de entorno requeridas en producción

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Connection string de Neon (pooled) |
| `AUTH_SECRET` | Secret para firmar JWTs |
| `AUTH_URL` | URL del sitio en producción |
| `NEXTAUTH_URL` | Igual que AUTH_URL |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Token público de Mapbox |
| `BLOB_READ_WRITE_TOKEN` | Token de Vercel Blob (auto-generado) |

---

## 👥 Equipo

Proyecto desarrollado por el **Equipo SENA** en el marco del programa de formación tecnológica.

### Instituciones aliadas

- 🎓 **[SENA](https://www.sena.edu.co/)** — Servicio Nacional de Aprendizaje
- 🌾 **CampeSENA** — programa de impulso a la economía campesina
- 🏪 **Full Popular** — alianza estratégica para el comercio popular

---

## 📄 Licencia

Este proyecto es un trabajo académico desarrollado en el marco del **Servicio Nacional de Aprendizaje (SENA)**. El uso del código está sujeto a los términos institucionales del SENA y de sus aliados.

Para consultas sobre el uso del código o colaboraciones, abrir un issue en el repositorio.

---

<div align="center">

**🥖 Hecho con masa madre y mucho amor por el equipo SENA 🇨🇴**

[⬆ Volver arriba](#-masa-madre-colombia)

</div>
