/**
 * Seed script — Pobla la base de datos con datos iniciales
 * ──────────────────────────────────────────────────────────
 * - 32 departamentos de Colombia
 * - 18 ciudades principales
 * - 5 panaderías mock con productos
 * - 1 usuario admin de prueba
 *
 * Ejecutar con: npx prisma db seed
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/* ════════════════════════════════════════════════════════════
   DATOS — 32 DEPARTAMENTOS
   ════════════════════════════════════════════════════════════ */

const DEPARTAMENTOS = [
  { slug: "amazonas", nombre: "Amazonas", coordsLng: -71.5, coordsLat: -1.4, zoomNivel: 6 },
  { slug: "antioquia", nombre: "Antioquia", coordsLng: -75.5, coordsLat: 7.0, zoomNivel: 7 },
  { slug: "arauca", nombre: "Arauca", coordsLng: -70.9, coordsLat: 6.8, zoomNivel: 7.5 },
  { slug: "atlantico", nombre: "Atlántico", coordsLng: -74.9, coordsLat: 10.7, zoomNivel: 8.5 },
  { slug: "bolivar", nombre: "Bolívar", coordsLng: -74.5, coordsLat: 9.0, zoomNivel: 7 },
  { slug: "boyaca", nombre: "Boyacá", coordsLng: -72.6, coordsLat: 5.6, zoomNivel: 7.5 },
  { slug: "caldas", nombre: "Caldas", coordsLng: -75.5, coordsLat: 5.2, zoomNivel: 8 },
  { slug: "caqueta", nombre: "Caquetá", coordsLng: -74.4, coordsLat: 1.0, zoomNivel: 6.5 },
  { slug: "casanare", nombre: "Casanare", coordsLng: -71.8, coordsLat: 5.7, zoomNivel: 7 },
  { slug: "cauca", nombre: "Cauca", coordsLng: -76.8, coordsLat: 2.5, zoomNivel: 7.5 },
  { slug: "cesar", nombre: "Cesar", coordsLng: -73.5, coordsLat: 9.8, zoomNivel: 7.5 },
  { slug: "choco", nombre: "Chocó", coordsLng: -77.0, coordsLat: 6.0, zoomNivel: 7 },
  { slug: "cordoba", nombre: "Córdoba", coordsLng: -75.8, coordsLat: 8.5, zoomNivel: 7.5 },
  { slug: "cundinamarca", nombre: "Cundinamarca", coordsLng: -74.1, coordsLat: 5.0, zoomNivel: 7.5 },
  { slug: "guainia", nombre: "Guainía", coordsLng: -68.5, coordsLat: 2.5, zoomNivel: 6 },
  { slug: "guaviare", nombre: "Guaviare", coordsLng: -72.0, coordsLat: 2.3, zoomNivel: 7 },
  { slug: "huila", nombre: "Huila", coordsLng: -75.5, coordsLat: 2.5, zoomNivel: 7.5 },
  { slug: "la-guajira", nombre: "La Guajira", coordsLng: -72.5, coordsLat: 11.5, zoomNivel: 7.5 },
  { slug: "magdalena", nombre: "Magdalena", coordsLng: -74.2, coordsLat: 10.4, zoomNivel: 7.5 },
  { slug: "meta", nombre: "Meta", coordsLng: -72.9, coordsLat: 3.5, zoomNivel: 7 },
  { slug: "narino", nombre: "Nariño", coordsLng: -77.5, coordsLat: 1.2, zoomNivel: 7.5 },
  { slug: "norte-de-santander", nombre: "Norte de Santander", coordsLng: -72.8, coordsLat: 8.0, zoomNivel: 7.5 },
  { slug: "putumayo", nombre: "Putumayo", coordsLng: -76.0, coordsLat: 0.5, zoomNivel: 7 },
  { slug: "quindio", nombre: "Quindío", coordsLng: -75.7, coordsLat: 4.5, zoomNivel: 9 },
  { slug: "risaralda", nombre: "Risaralda", coordsLng: -75.9, coordsLat: 5.2, zoomNivel: 8.5 },
  { slug: "san-andres", nombre: "San Andrés y Providencia", coordsLng: -81.7, coordsLat: 12.5, zoomNivel: 9 },
  { slug: "santander", nombre: "Santander", coordsLng: -73.2, coordsLat: 6.6, zoomNivel: 7.5 },
  { slug: "sucre", nombre: "Sucre", coordsLng: -75.0, coordsLat: 9.0, zoomNivel: 8 },
  { slug: "tolima", nombre: "Tolima", coordsLng: -75.2, coordsLat: 4.0, zoomNivel: 7.5 },
  { slug: "valle-del-cauca", nombre: "Valle del Cauca", coordsLng: -76.5, coordsLat: 3.8, zoomNivel: 7.5 },
  { slug: "vaupes", nombre: "Vaupés", coordsLng: -70.5, coordsLat: 0.6, zoomNivel: 6.5 },
  { slug: "vichada", nombre: "Vichada", coordsLng: -69.5, coordsLat: 4.5, zoomNivel: 6.5 },
];

/* ════════════════════════════════════════════════════════════
   DATOS — 18 CIUDADES
   ════════════════════════════════════════════════════════════ */

const CIUDADES = [
  { slug: "bogota", nombre: "Bogotá", departamentoSlug: "cundinamarca" },
  { slug: "medellin", nombre: "Medellín", departamentoSlug: "antioquia" },
  { slug: "cali", nombre: "Cali", departamentoSlug: "valle-del-cauca" },
  { slug: "barranquilla", nombre: "Barranquilla", departamentoSlug: "atlantico" },
  { slug: "cartagena", nombre: "Cartagena", departamentoSlug: "bolivar" },
  { slug: "bucaramanga", nombre: "Bucaramanga", departamentoSlug: "santander" },
  { slug: "pereira", nombre: "Pereira", departamentoSlug: "risaralda" },
  { slug: "santa-marta", nombre: "Santa Marta", departamentoSlug: "magdalena" },
  { slug: "manizales", nombre: "Manizales", departamentoSlug: "caldas" },
  { slug: "ibague", nombre: "Ibagué", departamentoSlug: "tolima" },
  { slug: "armenia", nombre: "Armenia", departamentoSlug: "quindio" },
  { slug: "popayan", nombre: "Popayán", departamentoSlug: "cauca" },
  { slug: "neiva", nombre: "Neiva", departamentoSlug: "huila" },
  { slug: "villavicencio", nombre: "Villavicencio", departamentoSlug: "meta" },
  { slug: "pasto", nombre: "Pasto", departamentoSlug: "narino" },
  { slug: "monteria", nombre: "Montería", departamentoSlug: "cordoba" },
  { slug: "valledupar", nombre: "Valledupar", departamentoSlug: "cesar" },
  { slug: "cucuta", nombre: "Cúcuta", departamentoSlug: "norte-de-santander" },
];

/* ════════════════════════════════════════════════════════════
   DATOS — 5 PANADERÍAS MOCK
   ════════════════════════════════════════════════════════════ */

const PANADERIAS = [
  {
    nombre: "Panadería La Esquina del Trigo",
    descripcionCorta: "Pan artesanal con masa madre cultivada por más de 5 años.",
    telefono: "+57 1 234 5678",
    email: "contacto@esquinadeltrigo.co",
    direccion: "Cra. 13 #45-67, Chapinero",
    ciudadSlug: "bogota",
    urlGoogleMaps: "https://maps.app.goo.gl/PU15qRLKnANgZ",
    imagen: "/assets/panaderias/panaderia-1.jpg",
    horario: "Abre: 7:00 AM - Cierra: 10:00 PM",
    coordsLng: -74.0721,
    coordsLat: 4.7110,
    productos: [
      { nombre: "Pan masa madre", precio: 10800, imagen: "/assets/productos/pan-masa-madre.jpg" },
      { nombre: "Croissant masa madre", precio: 15800, imagen: "/assets/productos/croissant.jpg" },
      { nombre: "Pan con queso y mermelada", precio: 6800, imagen: "/assets/productos/pan-queso.jpg" },
      { nombre: "Pan casero masa madre", precio: 10800, imagen: "/assets/productos/pan-casero.jpg" },
    ],
  },
  {
    nombre: "El Horno del Barrio",
    descripcionCorta: "Hornadas tradicionales todas las mañanas a las 5 a.m.",
    telefono: "+57 4 444 5678",
    email: "info@elhornodelbarrio.co",
    direccion: "Cl. 70 #45-12, Laureles",
    ciudadSlug: "medellin",
    urlGoogleMaps: "https://maps.app.goo.gl/medellin-horno",
    imagen: "/assets/panaderias/panaderia-2.jpg",
    horario: "Abre: 5:00 AM - Cierra: 9:00 PM",
    coordsLng: -75.5636,
    coordsLat: 6.2476,
    productos: [
      { nombre: "Pan campesino", precio: 8500, imagen: "/assets/productos/pan-campesino.jpg" },
      { nombre: "Mogollas integrales", precio: 4200, imagen: "/assets/productos/mogollas.jpg" },
      { nombre: "Almojábanas", precio: 3500, imagen: "/assets/productos/almojabanas.jpg" },
    ],
  },
  {
    nombre: "Trigo y Madera",
    descripcionCorta: "Especialidad en panes integrales y fermentación natural.",
    telefono: "+57 2 555 1234",
    email: null,
    direccion: "Av. 6N #25-30, Granada",
    ciudadSlug: "cali",
    urlGoogleMaps: "https://maps.app.goo.gl/cali-trigo",
    imagen: "/assets/panaderias/panaderia-3.jpg",
    horario: "Abre: 6:30 AM - Cierra: 8:00 PM",
    coordsLng: -76.5320,
    coordsLat: 3.4516,
    productos: [
      { nombre: "Pan de centeno", precio: 12000, imagen: "/assets/productos/pan-centeno.jpg" },
      { nombre: "Baguette tradicional", precio: 7500, imagen: "/assets/productos/baguette.jpg" },
      { nombre: "Focaccia con romero", precio: 18500, imagen: "/assets/productos/focaccia.jpg" },
      { nombre: "Pan brioche", precio: 14000, imagen: "/assets/productos/brioche.jpg" },
    ],
  },
  {
    nombre: "Masa Viva Cartagena",
    descripcionCorta: "Pan artesanal con harinas locales del Caribe.",
    telefono: "+57 5 660 7890",
    email: "hola@masaviva.co",
    direccion: "Centro histórico, Cl. Don Sancho #36-50",
    ciudadSlug: "cartagena",
    urlGoogleMaps: "https://maps.app.goo.gl/cartagena-viva",
    imagen: "/assets/panaderias/panaderia-4.jpg",
    horario: "Abre: 7:00 AM - Cierra: 9:00 PM",
    coordsLng: -75.5147,
    coordsLat: 10.3910,
    productos: [
      { nombre: "Pan de yuca", precio: 5500, imagen: "/assets/productos/pan-yuca.jpg" },
      { nombre: "Pan de bono", precio: 4000, imagen: "/assets/productos/pan-bono.jpg" },
      { nombre: "Arepa de huevo dulce", precio: 6800, imagen: "/assets/productos/arepa-huevo.jpg" },
    ],
  },
  {
    nombre: "Tostipan",
    descripcionCorta: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    telefono: "3146228909 - 3276549087",
    email: null,
    direccion: "Av. 6N #23-52 Pereira, Risaralda",
    ciudadSlug: "pereira",
    urlGoogleMaps: "https://maps.app.goo.gl/PU15qRLKnANgZ",
    imagen: "/assets/panaderias/panaderia-5.jpg",
    horario: "Abre: 7:30 AM - Cierra: 10:30 PM",
    coordsLng: -75.6906,
    coordsLat: 4.8133,
    productos: [
      { nombre: "Pan masa madre", precio: 10800, imagen: "/assets/productos/pan-masa-madre.jpg" },
      { nombre: "Croissant masa madre", precio: 15800, imagen: "/assets/productos/croissant.jpg" },
      { nombre: "Pan con queso y mermelada", precio: 6800, imagen: "/assets/productos/pan-queso.jpg" },
      { nombre: "Pan casero masa madre", precio: 10800, imagen: "/assets/productos/pan-casero.jpg" },
    ],
  },
];

/* ════════════════════════════════════════════════════════════
   FUNCIÓN PRINCIPAL — SEED
   ════════════════════════════════════════════════════════════ */

async function main() {
  console.log("🌱 Iniciando seed...\n");

/* ──────────────────────────────────────────
     1. Limpiar datos existentes
     ────────────────────────────────────────── */
  console.log("🧹 Limpiando datos existentes...");
  await prisma.comentario.deleteMany();
  await prisma.postTag.deleteMany();
  await prisma.post.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.panaderia.deleteMany();
  await prisma.ciudad.deleteMany();
  await prisma.departamento.deleteMany();
  await prisma.usuario.deleteMany();
  console.log("✅ Datos previos eliminados\n");

  /* ──────────────────────────────────────────
     2. Crear usuario admin de prueba
     ────────────────────────────────────────── */
  console.log("👤 Creando usuario admin...");
  const passwordHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.usuario.create({
    data: {
      email: "admin@masamadre.co",
      nombre: "Administrador Masa Madre",
      passwordHash,
      rol: "ADMIN",
    },
  });
  console.log(`✅ Admin creado: ${admin.email} (contraseña: admin123)\n`);

  /* ──────────────────────────────────────────
     3. Crear departamentos
     ────────────────────────────────────────── */
  console.log("🗺️  Creando 32 departamentos...");
  for (const depto of DEPARTAMENTOS) {
    await prisma.departamento.create({
      data: {
        ...depto,
        imagen: `/assets/departamentos/${depto.slug}.jpg`,
      },
    });
  }
  console.log(`✅ ${DEPARTAMENTOS.length} departamentos creados\n`);

  /* ──────────────────────────────────────────
     4. Crear ciudades
     ────────────────────────────────────────── */
  console.log("🏙️  Creando 18 ciudades...");
  for (const ciudad of CIUDADES) {
    const depto = await prisma.departamento.findUnique({
      where: { slug: ciudad.departamentoSlug },
    });
    if (!depto) continue;

    await prisma.ciudad.create({
      data: {
        slug: ciudad.slug,
        nombre: ciudad.nombre,
        imagen: `/assets/ciudades/${ciudad.slug}.jpg`,
        departamentoId: depto.id,
      },
    });
  }
  console.log(`✅ ${CIUDADES.length} ciudades creadas\n`);

  /* ──────────────────────────────────────────
     5. Crear panaderías con productos
     ────────────────────────────────────────── */
  console.log("🥖 Creando 5 panaderías con productos...");
  for (const pan of PANADERIAS) {
    const ciudad = await prisma.ciudad.findUnique({
      where: { slug: pan.ciudadSlug },
      include: { departamento: true },
    });
    if (!ciudad) continue;

    await prisma.panaderia.create({
      data: {
        nombre: pan.nombre,
        descripcionCorta: pan.descripcionCorta,
        telefono: pan.telefono,
        email: pan.email,
        direccion: pan.direccion,
        urlGoogleMaps: pan.urlGoogleMaps,
        imagen: pan.imagen,
        horario: pan.horario,
        coordsLng: pan.coordsLng,
        coordsLat: pan.coordsLat,
        imagenesCarrusel: [],
        ciudadId: ciudad.id,
        departamentoId: ciudad.departamentoId,
        estado: "ACTIVA",
        productos: {
          create: pan.productos,
        },
      },
    });
  }
  console.log(`✅ ${PANADERIAS.length} panaderías creadas\n`);

  /* ──────────────────────────────────────────
     6. Crear posts del blog con tags
     ────────────────────────────────────────── */
  console.log("📝 Creando posts del blog...");
  for (const postData of POSTS) {
    await prisma.post.create({
      data: {
        slug: postData.slug,
        titulo: postData.titulo,
        descripcion: postData.descripcion,
        contenido: postData.contenido,
        categoria: postData.categoria,
        keyword: postData.keyword,
        imagen: postData.imagen,
        fechaIso: postData.fechaIso,
        estado: postData.estado,
        autorId: admin.id,
        tags: {
          create: postData.tags,
        },
      },
    });
  }
  console.log(`✅ ${POSTS.length} posts creados\n`);

  /* ──────────────────────────────────────────
     Resumen
     ────────────────────────────────────────── */
  console.log("🎉 Seed completado exitosamente!\n");
console.log("📊 Resumen:");
console.log(`   - 1 usuario admin (admin@masamadre.co / admin123)`);
console.log(`   - ${DEPARTAMENTOS.length} departamentos`);
console.log(`   - ${CIUDADES.length} ciudades`);
console.log(`   - ${PANADERIAS.length} panaderías`);
console.log(
  `   - ${PANADERIAS.reduce((acc, p) => acc + p.productos.length, 0)} productos`
);
console.log(`   - ${POSTS.length} posts del blog`);
console.log(
  `   - ${POSTS.reduce((acc, p) => acc + p.tags.length, 0)} tags`
);
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/* ════════════════════════════════════════════════════════════
   DATOS — POSTS DEL BLOG
   ════════════════════════════════════════════════════════════ */

const POSTS = [
  {
    slug: "historia-de-la-masa-madre-en-colombia",
    titulo: "La historia de la masa madre en Colombia",
    descripcion:
      "Un recorrido por las raíces de la panadería artesanal en nuestro país y cómo la masa madre se ha convertido en un movimiento cultural.",
    contenido: `# La historia de la masa madre en Colombia

La masa madre es mucho más que una técnica de panificación: es una tradición viva que conecta generaciones de panaderos con la tierra, el tiempo y el sabor auténtico del pan.

## Los orígenes

En Colombia, la panadería artesanal tiene raíces profundas que se remontan a las primeras comunidades campesinas. Hoy, gracias a iniciativas como el programa Masa Madre del SENA, esta tradición está renaciendo con fuerza.

## Un movimiento que crece

Cada vez más panaderos en el país están redescubriendo el valor de la fermentación natural. No es solo una moda: es una forma de honrar el oficio y devolverle al pan su dignidad.

> "El pan con masa madre tiene alma. Cada hogaza es única, como cada panadero que la elabora."

## El futuro de la masa madre

Con el apoyo de CampeSENA y Full Popular, panaderos de todo el país están fortaleciendo sus emprendimientos, mejorando técnicas y conectando con consumidores que valoran lo artesanal.`,
    categoria: "Tradición",
    keyword: "masa madre",
    imagen: "/assets/blog/historia-masa-madre.jpg",
    fechaIso: new Date("2026-04-15"),
    estado: "PUBLICADO" as const,
    tags: [
      { label: "Tradición", icon: "🌾" },
      { label: "Cultura", icon: "📜" },
      { label: "Colombia", icon: "🇨🇴" },
    ],
  },
  {
    slug: "5-pasos-para-cuidar-tu-masa-madre",
    titulo: "5 pasos para cuidar tu masa madre",
    descripcion:
      "Aprende a mantener tu cultivo activo y saludable con estos consejos prácticos de panaderos expertos.",
    contenido: `# 5 pasos para cuidar tu masa madre

Cuidar una masa madre es como cuidar una mascota: requiere atención, paciencia y constancia. Aquí tienes los pasos esenciales para mantenerla viva y activa.

## 1. Alimentación regular

Tu masa madre necesita alimentarse cada 12-24 horas si está a temperatura ambiente, o cada 5-7 días si la guardas en refrigeración.

## 2. Proporciones correctas

La regla general es 1:1:1 (masa madre : harina : agua). Por ejemplo: 50g de masa madre, 50g de harina, 50g de agua.

## 3. Temperatura ideal

Mantén tu masa madre entre 22°C y 26°C para una fermentación óptima. Evita los lugares con corrientes de aire frío.

## 4. Hidratación adecuada

Usa agua filtrada o reposada. El cloro del agua del grifo puede matar las bacterias beneficiosas de tu cultivo.

## 5. Observa los signos vitales

Una masa madre saludable se duplica en 4-8 horas después de alimentarla. Si no sube, necesita más alimentación o un ambiente más cálido.`,
    categoria: "Técnica",
    keyword: "cuidado masa madre",
    imagen: "/assets/blog/cuidar-masa-madre.jpg",
    fechaIso: new Date("2026-04-22"),
    estado: "PUBLICADO" as const,
    tags: [
      { label: "Técnica", icon: "🥖" },
      { label: "Tutorial", icon: "📚" },
    ],
  },
  {
    slug: "beneficios-del-pan-con-masa-madre",
    titulo: "Los beneficios del pan con masa madre",
    descripcion:
      "Descubre por qué el pan con masa madre no solo sabe mejor, sino que también es más saludable y fácil de digerir.",
    contenido: `# Los beneficios del pan con masa madre

El pan con masa madre no es solo delicioso: es una elección consciente que aporta múltiples beneficios para tu salud y bienestar.

## 1. Mejor digestión

La fermentación larga descompone parte del gluten y los azúcares complejos, haciendo el pan más fácil de digerir, incluso para personas con sensibilidad al gluten (no celíacas).

## 2. Mayor valor nutricional

Durante la fermentación, los nutrientes de la harina se vuelven más biodisponibles. Esto significa que tu cuerpo absorbe mejor las vitaminas y minerales.

## 3. Sin conservantes artificiales

El proceso natural de fermentación crea ácidos que actúan como conservantes naturales, prolongando la vida del pan sin necesidad de químicos.

## 4. Índice glucémico bajo

El pan con masa madre tiene un índice glucémico más bajo que el pan industrial, lo que ayuda a mantener niveles estables de azúcar en sangre.

## 5. Sabor incomparable

Y, por supuesto, el sabor. Cada hogaza tiene notas complejas y aromas que el pan industrial nunca podrá igualar.`,
    categoria: "Salud",
    keyword: "beneficios masa madre",
    imagen: "/assets/blog/beneficios.jpg",
    fechaIso: new Date("2026-05-01"),
    estado: "PUBLICADO" as const,
    tags: [
      { label: "Salud", icon: "❤️" },
      { label: "Nutrición", icon: "🥗" },
    ],
  },
  {
    slug: "panaderias-aliadas-del-programa",
    titulo: "Conoce las panaderías aliadas del programa",
    descripcion:
      "Un mapa por las panaderías que están transformando la forma de hacer pan en Colombia.",
    contenido: `# Conoce las panaderías aliadas del programa

El programa Masa Madre del SENA ha unido a panaderos de todo el país en un movimiento que celebra la tradición y la calidad.

## Una red que crece

Desde Bogotá hasta Pereira, pasando por Medellín, Cali y Cartagena, cada panadería aliada es un punto de referencia para los amantes del buen pan.

## Compromiso compartido

Todas las panaderías del programa comparten valores comunes:

- **Calidad** en cada producto
- **Tradición** en sus métodos
- **Innovación** en sus propuestas
- **Comunidad** en su impacto local

## Visítalas

Te invitamos a recorrer nuestro mapa de panaderías aliadas y descubrir el sabor auténtico del pan colombiano hecho con masa madre.`,
    categoria: "Comunidad",
    keyword: "panaderías Colombia",
    imagen: "/assets/blog/panaderias-aliadas.jpg",
    fechaIso: new Date("2026-05-10"),
    estado: "PUBLICADO" as const,
    tags: [
      { label: "Comunidad", icon: "👥" },
      { label: "Aliados", icon: "🤝" },
    ],
  },
  {
    slug: "como-empezar-tu-propia-panaderia",
    titulo: "Cómo empezar tu propia panadería con masa madre",
    descripcion:
      "Guía paso a paso para emprender en el mundo de la panadería artesanal con bases sólidas.",
    contenido: `# Cómo empezar tu propia panadería con masa madre

Emprender en panadería es un viaje apasionante. Te compartimos los pasos esenciales para que tu sueño se convierta en realidad.

## 1. Aprende el oficio

Antes de pensar en el negocio, domina la técnica. Inscríbete en cursos del SENA, busca mentores y practica constantemente.

## 2. Define tu propuesta de valor

¿Qué te hace diferente? ¿Es tu técnica, tus ingredientes locales, tu compromiso con la comunidad? Define tu propósito.

## 3. Conoce tus costos

Calcula con precisión:
- Materia prima (harina, sal, agua)
- Mano de obra
- Servicios (electricidad, gas, agua)
- Empaque y entrega

## 4. Construye tu marca

Tu marca es más que un logo: es la historia que cuentas. Sé auténtico y consistente.

## 5. Empieza pequeño, crece sostenidamente

No necesitas un local enorme para empezar. Muchas panaderías exitosas comenzaron en cocinas caseras.`,
    categoria: "Emprendimiento",
    keyword: "panadería negocio",
    imagen: "/assets/blog/emprender-panaderia.jpg",
    fechaIso: new Date("2026-05-18"),
    estado: "PUBLICADO" as const,
    tags: [
      { label: "Emprendimiento", icon: "💼" },
      { label: "Guía", icon: "🧭" },
    ],
  },
  {
    slug: "diferencias-pan-industrial-vs-artesanal",
    titulo: "Pan industrial vs. pan artesanal: ¿cuál es la diferencia?",
    descripcion:
      "Una comparación honesta entre el pan que encuentras en el supermercado y el que hace un panadero con sus manos.",
    contenido: `# Pan industrial vs. pan artesanal: ¿cuál es la diferencia?

A simple vista, ambos panes pueden parecer similares. Pero la diferencia está en los detalles.

## Tiempo de fermentación

- **Industrial:** 1-2 horas con levadura química
- **Artesanal con masa madre:** 12-24 horas con fermentación natural

## Ingredientes

- **Industrial:** Harina refinada, conservantes, mejoradores, emulsionantes
- **Artesanal:** Harina, agua, sal y masa madre. Nada más.

## Sabor

- **Industrial:** Sabor uniforme, predecible
- **Artesanal:** Sabor complejo, con notas únicas en cada hogaza

## Digestibilidad

- **Industrial:** Puede causar pesadez
- **Artesanal:** Más fácil de digerir gracias a la fermentación larga

## Precio

El pan artesanal cuesta más, pero estás pagando por:
- Tiempo de elaboración
- Ingredientes de calidad
- El trabajo de un artesano

## La elección es tuya

No se trata de demonizar al pan industrial, sino de entender qué estás comiendo y por qué.`,
    categoria: "Educación",
    keyword: "pan artesanal",
    imagen: "/assets/blog/pan-vs-pan.jpg",
    fechaIso: new Date("2026-05-25"),
    estado: "PUBLICADO" as const,
    tags: [
      { label: "Educación", icon: "🎓" },
      { label: "Comparativa", icon: "⚖️" },
    ],
  },
  {
    slug: "receta-pan-rustico-masa-madre",
    titulo: "Receta: pan rústico de masa madre paso a paso",
    descripcion:
      "Una receta clásica para que prepares en casa el pan rústico con corteza crujiente y miga aireada.",
    contenido: `# Receta: pan rústico de masa madre paso a paso

Esta receta es perfecta para empezar tu aventura con la masa madre. Pan crujiente por fuera, esponjoso por dentro.

## Ingredientes (para 1 hogaza)

- 500g de harina panadera
- 350g de agua a temperatura ambiente
- 100g de masa madre activa
- 10g de sal

## Paso 1: Autolisis

Mezcla la harina y 320g de agua. Deja reposar 1 hora cubierto con un paño.

## Paso 2: Incorpora la masa madre

Añade la masa madre y mezcla bien con tus manos. Deja reposar 30 minutos.

## Paso 3: Sal y agua restante

Disuelve la sal en los 30g de agua restante y añade a la masa. Amasa hasta integrar.

## Paso 4: Fermentación en bloque

Deja la masa fermentar 4-6 horas a temperatura ambiente, haciendo 4 pliegues cada 30 minutos al principio.

## Paso 5: Formado

Pasa la masa a la mesa enharinada, forma una bola y deja reposar 30 minutos.

## Paso 6: Fermentación final

Coloca la masa en un banneton enharinado, cubre y refrigera 8-12 horas.

## Paso 7: Horneado

Precalienta el horno a 240°C con una olla de hierro fundido dentro. Coloca la masa en la olla, tapa y hornea 25 minutos. Destapa y hornea 15 minutos más.

## ¡Listo!

Deja enfriar al menos 1 hora antes de cortar. ¡Disfruta!`,
    categoria: "Recetas",
    keyword: "receta pan rústico",
    imagen: "/assets/blog/receta-pan-rustico.jpg",
    fechaIso: new Date("2026-05-20"),
    estado: "BORRADOR" as const,
    tags: [
      { label: "Recetas", icon: "📖" },
      { label: "Pan", icon: "🍞" },
    ],
  },
];