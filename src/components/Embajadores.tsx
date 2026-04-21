import Image from "next/image";
import Link from "next/link";

const CHIPS = [
  { label: "Horneando tradición", emoji: "🥖" },
  { label: "Transformando su comunidad", emoji: "🔥" },
  { label: "Pan con propósito", emoji: "❤️" },
];

/**
 * Sección "Embajadores de la Masa Madre"
 *
 * DESKTOP (lg+): texto a la izquierda, foto circular a la derecha
 * MÓVIL (< lg): foto arriba centrada, texto centrado debajo, chips apilados verticalmente,
 *               botón ancho centrado
 */
export function Embajadores() {
  return (
    <section className="relative overflow-hidden bg-brand-purpleDark py-16 md:py-20">
      <div className="container-site">
        <div className="flex flex-col items-center gap-8 lg:grid lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-12">
          {/* Columna de texto (segunda en móvil, primera en desktop) */}
          <div className="order-2 w-full text-center text-white lg:order-1 lg:text-left">
            <h2 className="text-3xl font-bold italic leading-tight md:text-4xl lg:text-5xl">
              Embajadores
              <br />
              de la Masa Madre
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/90 md:text-[15px] lg:mx-0">
              Personas que decidieron volver a lo auténtico y hoy inspiran a sus
              comunidades con pan hecho con tiempo, respeto y tradición.
              Guardianes del sabor real. Cada uno de ellos decidió apostar por
              la masa madre, respetar los procesos y devolverle al pan el lugar
              que merece en nuestra mesa.
            </p>

            {/* Chips — apilados en móvil, en fila en desktop */}
            <ul className="mt-6 flex flex-col items-center gap-3 lg:flex-row lg:flex-wrap lg:items-start">
              {CHIPS.map((chip) => (
                <li key={chip.label}>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/5 px-5 py-2 text-xs font-medium text-white md:text-sm">
                    <span aria-hidden="true">{chip.emoji}</span>
                    {chip.label}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA verde — ancho en móvil, auto en desktop */}
            <div className="mt-8 flex justify-center lg:justify-start">
              <Link
                href="#ser-embajador"
                className="inline-flex w-full max-w-xs items-center justify-center gap-3 rounded-full bg-brand-green px-8 py-4 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-brand-green-dark hover:shadow-lg md:text-base lg:w-auto lg:max-w-none lg:px-6 lg:py-3"
              >
                Quiero ser embajador
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 8h10m0 0l-4-4m4 4l-4 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Columna de foto (primera en móvil, segunda en desktop) */}
          <div className="relative order-1 flex -mt-20 justify-center lg:order-2 lg:mt-0 lg:justify-end">
            <div className="relative h-[320px] w-[320px] sm:h-[380px] sm:w-[380px] md:h-[460px] md:w-[460px] lg:h-[500px] lg:w-[500px]">
              {/* Círculo de fondo con borde blanco */}
              <div className="absolute inset-0 overflow-hidden rounded-full border-[6px] border-white md:border-8">
                <Image
                  src="/assets/fondo-foto-embajadores.svg"
                  alt=""
                  fill
                  className="object-cover"
                  aria-hidden="true"
                />
              </div>

              {/* Foto de la embajadora — sobresale del círculo */}
              <Image
                src="/assets/imagen-embajadores.svg"
                alt="Embajadora de la masa madre"
                width={560}
                height={640}
                className="absolute bottom-0 left-1/2 z-10 h-[115%] w-auto max-w-none -translate-x-1/2 object-contain"
                priority={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}