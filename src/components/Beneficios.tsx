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
    <section className="relative overflow-hidden bg-white pb-24 pt-0 md:pt-0">
      {/* ===== Decoraciones de fondo ===== */}
      <Image
        src="/assets/huevo-beneficios.svg"
        alt=""
        width={200}
        height={200}
        className="pointer-events-none absolute left-6 top-10 h-auto w-[110px] md:left-20 md:top-10 md:w-[400px]"
        aria-hidden="true"
      />
      <Image
        src="/assets/amasador-beneficios.svg"
        alt=""
        width={134}
        height={759}
        className="pointer-events-none absolute -right-8 bottom-0 h-auto w-[180px] rotate-[-15deg] md:-right-4 md:w-[240px] lg:w-[280px]"
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

        {/* ========== DESKTOP (lg+): posiciones absolutas dispersas alrededor del pan ========== */}
        <div className="relative mx-auto mt-12 hidden h-[620px] max-w-[1200px] lg:block">
          {/* Imágenes de harina decorativas (detrás del contenido) */}
          <Image
            src="/assets/imagen1-beneficios.svg"
            alt=""
            width={240}
            height={180}
            className="pointer-events-none absolute right-[2%] top-[2%] h-auto w-[220px] opacity-90 xl:w-[260px]"
            aria-hidden="true"
          />
          <Image
            src="/assets/imagen2-beneficios.svg"
            alt=""
            width={240}
            height={180}
            className="pointer-events-none absolute bottom-[28%] left-[16%] h-auto w-[220px] opacity-90 xl:w-[260px]"
            aria-hidden="true"
          />

          {/* Líneas punteadas conectoras (SVG inline) */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 1200 620"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* 1. Fermentación natural → al pan (sube y se curva hacia centro) */}
            <path
              d="M 320 110 Q 450 80, 520 180"
              stroke="#989898"
              strokeWidth="1.2"
              strokeDasharray="4 6"
              fill="none"
            />
            {/* 2. Cada pan aroma → al pan */}
            <path
              d="M 280 310 Q 430 290, 500 310"
              stroke="#989898"
              strokeWidth="1.2"
              strokeDasharray="4 6"
              fill="none"
            />
            {/* 3. Prebióticas → al pan (sube hacia el pan) */}
            <path
              d="M 400 490 Q 460 450, 520 440"
              stroke="#989898"
              strokeWidth="1.2"
              strokeDasharray="4 6"
              fill="none"
            />
            {/* 4. Rescata → al pan (baja y se curva hacia centro) */}
            <path
              d="M 870 130 Q 780 110, 700 190"
              stroke="#989898"
              strokeWidth="1.2"
              strokeDasharray="4 6"
              fill="none"
            />
            {/* 5. Se mantiene fresco → al pan */}
            <path
              d="M 910 330 Q 790 310, 720 310"
              stroke="#989898"
              strokeWidth="1.2"
              strokeDasharray="4 6"
              fill="none"
            />
            {/* 6. Mayor biodisponibilidad → al pan */}
            <path
              d="M 760 500 Q 700 450, 680 430"
              stroke="#989898"
              strokeWidth="1.2"
              strokeDasharray="4 6"
              fill="none"
            />
          </svg>

          {/* Pan central */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Image
              src="/assets/pan-beneficios.svg"
              alt="Pan de masa madre rebanado sobre tabla de madera"
              width={400}
              height={600}
              className="h-auto w-[380px] drop-shadow-xl"
            />
          </div>

          {/* ----- LADO IZQUIERDO ----- */}
          {/* 1. La fermentación natural — arriba, cerca del pan */}
          <BeneficioItemPos
            {...BENEFICIOS_IZQ[0]}
            posicion="top-[10%] left-[8%]"
            iconoPos="right"
            anchoTexto="w-[280px]"
            textAlign="right"
          />

          {/* 2. Cada pan aroma — medio-izquierda, más afuera */}
          <BeneficioItemPos
            {...BENEFICIOS_IZQ[1]}
            posicion="top-[42%] left-[4%]"
            iconoPos="top-right"
            anchoTexto="w-[260px]"
            textAlign="center"
          />

          {/* 3. Sus propiedades prebióticas — abajo, hacia el centro */}
          <BeneficioItemPos
            {...BENEFICIOS_IZQ[2]}
            posicion="bottom-[8%] left-[22%]"
            iconoPos="top"
            anchoTexto="w-[280px]"
            textAlign="center"
          />

          {/* ----- LADO DERECHO ----- */}
          {/* 4. Rescata un saber — arriba, cerca del pan */}
          <BeneficioItemPos
            {...BENEFICIOS_DER[0]}
            posicion="top-[12%] right-[6%]"
            iconoPos="left"
            anchoTexto="w-[280px]"
            textAlign="left"
          />

          {/* 5. Se mantiene fresco — medio-derecha */}
          <BeneficioItemPos
            {...BENEFICIOS_DER[1]}
            posicion="top-[44%] right-[4%]"
            iconoPos="left"
            anchoTexto="w-[230px]"
            textAlign="left"
          />

          {/* 6. Mayor biodisponibilidad — abajo, hacia el centro */}
          <BeneficioItemPos
            {...BENEFICIOS_DER[2]}
            posicion="bottom-[6%] right-[22%]"
            iconoPos="top-left"
            anchoTexto="w-[260px]"
            textAlign="center"
          />
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
 * Item desktop con posición absoluta y orientación del ícono configurable
 * - iconoPos: "left" | "right" | "top" — dónde va el ícono respecto al texto
 * - posicion: clases de tailwind para absolute positioning
 * - anchoTexto: ancho del párrafo (w-[...])
 * - textAlign: alineación del texto
 */
type IconoPos = "left" | "right" | "top" | "top-left" | "top-right";
type TextAlign = "left" | "right" | "center";

function BeneficioItemPos({
  titulo,
  descripcion,
  posicion,
  iconoPos,
  anchoTexto,
  textAlign,
}: Beneficio & {
  posicion: string;
  iconoPos: IconoPos;
  anchoTexto: string;
  textAlign: TextAlign;
}) {
  const textAlignClass =
    textAlign === "left"
      ? "text-left"
      : textAlign === "right"
      ? "text-right"
      : "text-center";

  // Top centrado: columna, ícono arriba del texto centrado
  if (iconoPos === "top") {
    return (
      <div className={`absolute ${posicion} flex flex-col items-center gap-2`}>
        <IconoConPunto posicionPunto="bottom-center" />
        <p className={`${anchoTexto} ${textAlignClass} text-sm leading-relaxed md:text-[15px]`}>
          <strong className="font-bold text-gov-blue">{titulo}</strong>{" "}
          <span className="text-neutral-600">{descripcion}</span>
        </p>
      </div>
    );
  }

  // Top-left o Top-right: ícono arriba pero alineado a un lado del texto
  if (iconoPos === "top-left" || iconoPos === "top-right") {
    const alignItems = iconoPos === "top-left" ? "items-start" : "items-end";
    const punto = iconoPos === "top-left" ? "bottom-right" : "bottom-left";
    return (
      <div className={`absolute ${posicion} flex flex-col ${alignItems} gap-2`}>
        <IconoConPunto posicionPunto={punto} />
        <p className={`${anchoTexto} ${textAlignClass} text-sm leading-relaxed md:text-[15px]`}>
          <strong className="font-bold text-gov-blue">{titulo}</strong>{" "}
          <span className="text-neutral-600">{descripcion}</span>
        </p>
      </div>
    );
  }

  // Left o Right: ícono al lado del texto
  const layoutClass = iconoPos === "left" ? "flex-row items-start" : "flex-row-reverse items-start";
  const punto = iconoPos === "left" ? "right" : "left";

  return (
    <div className={`absolute ${posicion} flex gap-3 ${layoutClass}`}>
      <IconoConPunto posicionPunto={punto} />
      <p className={`${anchoTexto} ${textAlignClass} text-sm leading-relaxed md:text-[15px]`}>
        <strong className="font-bold text-gov-blue">{titulo}</strong>{" "}
        <span className="text-neutral-600">{descripcion}</span>
      </p>
    </div>
  );
}

/**
 * Ícono morado + punto verde pegado en la posición indicada
 */
function IconoConPunto({
  posicionPunto,
}: {
  posicionPunto: "left" | "right" | "bottom-center" | "bottom-left" | "bottom-right";
}) {
  const punto: Record<typeof posicionPunto, string> = {
    left: "top-1/2 -left-2 -translate-y-1/2",
    right: "top-1/2 -right-2 -translate-y-1/2",
    "bottom-center": "-bottom-2 left-1/2 -translate-x-1/2",
    "bottom-left": "-bottom-2 left-0",
    "bottom-right": "-bottom-2 right-0",
  };

  return (
    <span className="relative flex flex-shrink-0 items-center" aria-hidden="true">
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
        className={`absolute h-2 w-2 ${punto[posicionPunto]}`}
      />
    </span>
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