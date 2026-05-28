/**
 * ═══════════════════════════════════════════════════════════════════════
 * SEED — Municipios de Colombia
 * ─────────────────────────────────────────────────────────────────────
 * Carga todos los municipios de Colombia desde el dataset oficial.
 *
 * Estrategia: UPSERT por slug
 * - Si la ciudad ya existe (por slug), NO la modifica
 * - Si no existe, la crea con imagen por defecto
 *
 * Esto preserva las 18 ciudades existentes con sus imágenes custom.
 *
 * Uso:
 *   npx tsx prisma/seed-ciudades.ts
 * ═══════════════════════════════════════════════════════════════════════
 */

import { PrismaClient } from "@prisma/client";
import municipiosData from "./data/municipios-colombia.json";

const prisma = new PrismaClient();

/* ─── Tipo del dataset ─────────────────────────────────────────────── */
type DepartamentoData = {
  id: number;
  departamento: string;
  ciudades: string[];
};

/* ─── Helper: convertir a slug ────────────────────────────────────── */
function toSlug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quitar acentos
    .replace(/[ñ]/g, "n")
    .replace(/[^a-z0-9\s-]/g, "") // solo letras, números, espacios y guiones
    .trim()
    .replace(/\s+/g, "-") // espacios → guion
    .replace(/-+/g, "-"); // múltiples guiones → uno
}

/* ─── Helper: normalizar nombre de departamento ─────────────────── */
function normalizarDepartamento(nombre: string): string {
  // Algunos datasets usan "Bogotá D.C." vs "Bogotá" — normalizamos
  return nombre
    .replace("D.C.", "")
    .replace("Distrito Capital", "")
    .trim();
}

/* ─── Imagen por defecto ───────────────────────────────────────────── */
const IMAGEN_DEFAULT = "/assets/ciudades/default.jpg";

/* ─── Main ────────────────────────────────────────────────────────── */
async function main() {
  console.log("🌱 Iniciando seed de municipios de Colombia...\n");

  const datos = municipiosData as DepartamentoData[];

  // Estadísticas
  let creadas = 0;
  let omitidas = 0;
  let errores = 0;
  let departamentosNoEncontrados: string[] = [];

  // Cargar todos los departamentos de la BD para hacer match
  const departamentosDB = await prisma.departamento.findMany();
  console.log(`📍 Departamentos en BD: ${departamentosDB.length}`);

  // Map de slug → departamento para búsqueda rápida
  const mapaDepartamentos = new Map<string, { id: string; nombre: string }>();
  for (const d of departamentosDB) {
    mapaDepartamentos.set(d.slug, { id: d.id, nombre: d.nombre });
    // También indexar por nombre normalizado por si el slug no coincide
    mapaDepartamentos.set(toSlug(d.nombre), { id: d.id, nombre: d.nombre });
  }

  console.log(`\n📊 Total de municipios en dataset: ${datos.reduce((acc, d) => acc + d.ciudades.length, 0)}\n`);

  // Procesar cada departamento del dataset
  for (const deptoData of datos) {
    const nombreNormalizado = normalizarDepartamento(deptoData.departamento);
    const slugDepto = toSlug(nombreNormalizado);

    // Buscar el departamento en la BD
    const deptoDB = mapaDepartamentos.get(slugDepto);

    if (!deptoDB) {
      departamentosNoEncontrados.push(deptoData.departamento);
      console.log(`⚠️  Departamento no encontrado en BD: "${deptoData.departamento}"`);
      continue;
    }

    // Procesar cada ciudad del departamento
    for (const nombreCiudad of deptoData.ciudades) {
      const slugCiudad = toSlug(nombreCiudad);

      try {
        // Verificar si la ciudad ya existe (por slug)
        const existente = await prisma.ciudad.findUnique({
          where: { slug: slugCiudad },
        });

        if (existente) {
          omitidas++;
          continue;
        }

        // Crear la ciudad nueva
        await prisma.ciudad.create({
          data: {
            nombre: nombreCiudad,
            slug: slugCiudad,
            imagen: IMAGEN_DEFAULT,
            departamentoId: deptoDB.id,
          },
        });

        creadas++;

        if (creadas % 100 === 0) {
          console.log(`  ✓ ${creadas} ciudades creadas hasta ahora...`);
        }
      } catch (error) {
        errores++;
        console.error(`  ❌ Error con "${nombreCiudad}":`, (error as Error).message);
      }
    }
  }

  // Resumen
  console.log("\n═══════════════════════════════════════");
  console.log("📊 RESUMEN DEL SEED");
  console.log("═══════════════════════════════════════");
  console.log(`✅ Ciudades creadas:        ${creadas}`);
  console.log(`⏭️  Ciudades omitidas:       ${omitidas} (ya existían)`);
  console.log(`❌ Errores:                ${errores}`);

  if (departamentosNoEncontrados.length > 0) {
    console.log(`\n⚠️  Departamentos del dataset sin match en BD:`);
    departamentosNoEncontrados.forEach((d) => console.log(`   - ${d}`));
  }

  // Total final en BD
  const totalFinal = await prisma.ciudad.count();
  console.log(`\n🎯 Total de ciudades en BD: ${totalFinal}`);
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });