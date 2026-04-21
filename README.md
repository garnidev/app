# Masa Madre · SENA / CampeSENA / Full Popular

Portal de panaderías aliadas con masa madre. Iniciativa institucional para promover la tradición ancestral del pan artesanal en Colombia.

## Stack

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript 5.6**
- **Tailwind CSS 3.4**
- Fuente: Work Sans (Google Fonts via `next/font`)

## Estructura

```
masa-madre/
├── public/                  # Assets estáticos (imágenes, logos)
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Layout raíz + metadata + fuente
│   │   ├── page.tsx         # Landing (ensambla las secciones)
│   │   └── globals.css      # Estilos globales + Tailwind
│   ├── components/
│   │   ├── GovBar.tsx       # Barra institucional superior
│   │   ├── Header.tsx       # Header con navegación (client)
│   │   ├── Hero.tsx
│   │   ├── Beneficios.tsx
│   │   ├── ColombiaHuele.tsx (client)
│   │   ├── PuntosAliados.tsx
│   │   ├── Embajadores.tsx
│   │   ├── Testimonios.tsx
│   │   └── Footer.tsx
│   └── styles/
│       └── colors.ts        # Paleta (brand / gov / neutral / support)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
└── package.json
```

## Cómo correrlo

```bash
# 1. Instalar dependencias
npm install

# 2. Modo desarrollo
npm run dev
# → http://localhost:3000

# 3. Build de producción
npm run build
npm run start
```

## Notas

- Los componentes que usan `useState` (Header, ColombiaHuele) están marcados con `"use client"`.
- La paleta institucional está centralizada en `src/styles/colors.ts` y expuesta en Tailwind como `brand-*`, `gov-*`, `neutral-*`, `support-*`.
- El alias `@/*` apunta a `./src/*` (configurado en `tsconfig.json`).
- **Pendiente:** agregar los assets (logos SENA, CampeSENA, Full Popular, imágenes de panaderías) en `public/`. Los componentes hacen referencia a rutas con `next/image` que deberás completar según tu set de imágenes.
