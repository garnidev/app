import Image from "next/image";

type Beneficio = {
  titulo: string;
  descripcion: string;
  linea: string; // SVG de línea punteada para la disposición desktop
};

const BENEFICIOS_IZQ: Beneficio[] = [
  {
    titulo: "La fermentación natural",
    descripcion: "facilita la digestión y mejora la absorción de nutrientes.",
    linea: "/assets/linea-fermentacion.svg",
  },
  {
    titulo: "Cada pan tiene un aroma y gusto artesanal",
    descripcion: "imposible de imitar con procesos industriales.",
    linea: "/assets/linea-cada-pan.svg",
  },
  {
    titulo: "Sus propiedades prebióticas fortalecen la microbiota",
    descripcion: "y contribuyen al bienestar digestivo.",
    linea: "/assets/linea-propiedades-prebioticas.svg",
  },
];

const BENEFICIOS_DER: Beneficio[] = [
  {
    titulo: "Rescata un saber ancestral",
    descripcion:
      "y abre nuevas oportunidades de valor para las panaderías locales.",
    linea: "/assets/linea-rescata.svg",
  },
  {
    titulo: "Se mantiene fresco",
    descripcion: "por más tiempo gracias a su fermentación lenta natural.",
    linea: "/assets/linea-se-mantiene.svg",
  },
  {
    titulo: "Mayor biodisponibilidad",
    descripcion:
      "de vitaminas y minerales, ofreciendo un pan más completo y nutritivo.",
    linea: "/assets/linea-mayor-disponibilidad.svg",
  },
];

// Orden móvil: 3 arriba del pan, pan, 3 abajo del pan
const BENEFICIOS_MOVIL_ARRIBA: Beneficio[] = [
  BENEFICIOS_IZQ[0], // La fermentación natural
  BENEFICIOS_IZQ[1], // Cada pan tiene un aroma
  BENEFICIOS_IZQ[2], // Sus propiedades prebióticas
];
const BENEFICIOS_MOVIL_ABAJO: Beneficio[] = [
  BENEFICIOS_DER[2], // Mayor biodisponibilidad
  BENEFICIOS_DER[1], // Se mantiene fresco
  BENEFICIOS_DER[0], // Rescata un saber ancestral
];

/**
 * Sección "Beneficios del pan con masa madre"
 *
 * DESKTOP (lg+): 3 beneficios a cada lado del pan central, con líneas punteadas radiales
 * MÓVIL (< lg): layout lineal vertical centrado. 3 beneficios, pan, 3 beneficios.
 *               Cada item: ícono + punto verde arriba del texto (centrados), texto centrado.
 */
export function Beneficios() {
  return (
    <section className="relative overflow-hidden bg-white pb-24 pt-16 md:pt-24">
      {/* ===== Decoraciones de fondo ===== */}
      <Image
        src="/assets/huevo-beneficios.svg"
        alt=""
        width={200}
        height={200}
        className="pointer-events-none absolute left-6 top-10 h-auto w-[110px] md:left-16 md:top-16 md:w-[140px]"
        aria-hidden="true"
      />
      <Image
        src="/assets/imagen1-beneficios.svg"
        alt=""
        width={200}
        height={300}
        className="pointer-events-none absolute left-0 top-48 h-auto w-[140px] md:top-56 md:w-[180px]"
        aria-hidden="true"
      />
      <Image
        src="/assets/imagen2-beneficios.svg"
        alt=""
        width={200}
        height={300}
        className="pointer-events-none absolute bottom-16 left-1/2 hidden h-auto w-[220px] -translate-x-1/2 opacity-80 md:block md:w-[280px]"
        aria-hidden="true"
      />
      <Image
        src="/assets/amasador-beneficios.svg"
        alt=""
        width={134}
        height={759}
        className="pointer-events-none absolute -right-8 bottom-0 h-auto w-[180px] rotate-[25deg] md:-right-4 md:w-[240px] lg:w-[280px]"
        aria-hidden="true"
      />

      <div className="container-site relative z-10">
        {/* Título */}
        <h2 className="mx-auto max-w-3xl text-center text-4xl font-bold italic leading-tight md:text-5xl lg:text-6xl">
          <span className="text-brand-green">Beneficios del pan</span>
          <br />
          <span className="text-gov-blue">con masa madre</span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-center text-base text-neutral-700 md:text-lg">
          El pan de masa madre no es solo alimento, es una tradición, salud y
          sabor que nos conecta con lo auténtico de nuestra tierra.
        </p>

        {/* ========== DESKTOP (lg+): grid de 3 columnas con líneas radiales ========== */}
        <div className="relative mt-16 hidden lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-6">
          <ul className="flex flex-col justify-around gap-12 lg:items-end lg:text-right">
            {BENEFICIOS_IZQ.map((b, i) => (
              <BeneficioItemDesktop key={i} {...b} alineacion="izquierda" />
            ))}
          </ul>

          <div className="relative flex items-center justify-center">
            <Image
              src="/assets/pan-beneficios.svg"
              alt="Pan de masa madre rebanado sobre tabla de madera"
              width={400}
              height={600}
              className="h-auto w-[380px] drop-shadow-xl"
            />
          </div>

          <ul className="flex flex-col justify-around gap-12 lg:text-left">
            {BENEFICIOS_DER.map((b, i) => (
              <BeneficioItemDesktop key={i} {...b} alineacion="derecha" />
            ))}
          </ul>
        </div>

        {/* ========== MÓVIL (< lg): layout vertical centrado ========== */}
        <div className="mt-12 flex flex-col items-center gap-10 lg:hidden">
          {/* Beneficios de arriba */}
          {BENEFICIOS_MOVIL_ARRIBA.map((b, i) => (
            <BeneficioItemMovil key={`top-${i}`} {...b} />
          ))}

          {/* Pan en el medio */}
          <div className="flex justify-center py-2">
            <Image
              src="/assets/pan-beneficios.svg"
              alt="Pan de masa madre rebanado sobre tabla de madera"
              width={400}
              height={600}
              className="h-auto w-[280px] drop-shadow-xl md:w-[340px]"
            />
          </div>

          {/* Beneficios de abajo */}
          {BENEFICIOS_MOVIL_ABAJO.map((b, i) => (
            <BeneficioItemMovil key={`bot-${i}`} {...b} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Item desktop - con línea punteada radial hacia el pan central
 */
function BeneficioItemDesktop({
  titulo,
  descripcion,
  linea,
  alineacion,
}: Beneficio & { alineacion: "izquierda" | "derecha" }) {
  const isRight = alineacion === "derecha";

  return (
    <li
      className={`relative flex max-w-sm items-start gap-3 ${
        isRight ? "" : "flex-row-reverse"
      }`}
    >
      {/* Ícono morado + punto verde */}
      <span
        className="relative mt-1 flex flex-shrink-0 items-center"
        aria-hidden="true"
      >
        <Image
          src="/assets/icono-morado.svg"
          alt=""
          width={23}
          height={30}
          className="h-7 w-auto"
        />
        <Image
          src="/assets/punto-verde.svg"
          alt=""
          width={7}
          height={7}
          className={`absolute top-1/2 h-2 w-2 -translate-y-1/2 ${
            isRight ? "-left-2" : "-right-2"
          }`}
        />
      </span>

      <p className="text-sm leading-relaxed md:text-[15px]">
        <strong className="font-bold text-gov-blue">{titulo}</strong>{" "}
        <span className="text-neutral-600">{descripcion}</span>
      </p>

      {/* Línea punteada radial hacia el pan */}
      <Image
        src={linea}
        alt=""
        width={170}
        height={80}
        className={`pointer-events-none absolute top-1/2 h-auto -translate-y-1/2 ${
          isRight ? "right-full mr-1 w-auto" : "left-full ml-1 w-auto"
        }`}
        aria-hidden="true"
      />
    </li>
  );
}

/**
 * Item móvil - ícono + punto verde arriba del texto (centrados), texto centrado,
 * con una línea punteada serpenteante decorativa encima de cada item.
 */
function BeneficioItemMovil({ titulo, descripcion }: Beneficio) {
  return (
    <div className="relative flex w-full max-w-sm flex-col items-center px-4">
      {/* Línea punteada decorativa serpenteante (separador) */}
      <svg
        className="pointer-events-none absolute -top-8 left-0 right-0 h-8 w-full"
        viewBox="0 0 320 32"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 16 C 60 0, 120 32, 180 16 S 280 0, 320 16"
          stroke="#989898"
          strokeWidth="1"
          strokeDasharray="5 5"
          fill="none"
        />
      </svg>

      {/* Ícono morado + punto verde - arriba centrados */}
      <div className="mb-3 flex items-center gap-1.5" aria-hidden="true">
        <Image
          src="/assets/icono-morado.svg"
          alt=""
          width={23}
          height={30}
          className="h-7 w-auto"
        />
        <Image
          src="/assets/punto-verde.svg"
          alt=""
          width={7}
          height={7}
          className="h-2 w-2"
        />
      </div>

      {/* Texto centrado */}
      <p className="text-center text-sm leading-relaxed md:text-[15px]">
        <strong className="font-bold text-gov-blue">{titulo}</strong>{" "}
        <span className="text-neutral-600">{descripcion}</span>
      </p>
    </div>
  );
}