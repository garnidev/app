"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Sección "Colombia huele a masa madre"
 * - Tarjeta morada grande con recortes orgánicos (rectangulo + complemento)
 * - Izquierda: título blanco + copy + hashtag pill
 * - Derecha: thumbnail del video con botón play
 * - Decoración flotante: taza de café a la izquierda
 */
export function ColombiaHuele() {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-white py-10">
      {/* Taza de café decorativa flotante */}
      <Image
        src="/assets/tasa-beneficios.svg"
        alt=""
        width={180}
        height={180}
        className="pointer-events-none absolute -left-6 top-1/2 hidden h-auto w-[140px] -translate-y-1/2 md:block lg:w-[170px]"
        aria-hidden="true"
      />

      <div className="container-site">
        <div className="relative mx-auto max-w-6xl">
          {/* ============================================================ */}
          {/* ==============  MÓVIL / TABLET (< lg) — intacto  =========== */}
          {/* ============================================================ */}
          <div className="relative overflow-hidden rounded-[2rem] bg-brand-purpleDark p-6 pb-0 shadow-card md:p-12 md:pb-0 lg:hidden">
            <div className="relative z-10 grid items-center gap-6 md:gap-8">
              {/* Video */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setVideoOpen(true)}
                  className="group relative block w-full overflow-hidden rounded-2xl border-[6px] border-white shadow-intense md:border-8"
                  aria-label="Reproducir video"
                >
                  <Image
                    src="/assets/imagen-referencia-video-beneficios.svg"
                    alt="Video: preparación de masa madre"
                    width={700}
                    height={400}
                    className="h-auto w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 transition group-hover:bg-black/10" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src="/assets/logo-play-video.svg"
                      alt=""
                      width={110}
                      height={110}
                      className="h-20 w-20 transition duration-300 group-hover:scale-110 md:h-24 md:w-24"
                    />
                  </div>
                </button>
              </div>

              {/* Texto */}
              <div>
                <h2 className="text-3xl font-bold leading-tight text-white md:text-4xl">
                  Colombia huele
                  <br />a masa madre
                </h2>

                <div className="mt-6 space-y-3 text-base leading-relaxed text-white/90 md:text-[17px]">
                  <p>
                    Masa madre que transforma
                    <br />
                    Más que una técnica, es un movimiento.
                  </p>
                  <p>
                    Junto a CampeSENA y Full Popular, estamos llevando la
                    tradición del pan con masa madre a todo el país para
                    fortalecer comunidades y recuperar el sabor auténtico.
                  </p>
                </div>
              </div>
            </div>

            {/* Hashtag inferior: pestaña anclada al borde inferior */}
            <div className="relative z-10 mt-8 md:mt-10">
              <div className="-mx-6 rounded-t-3xl bg-white px-6 py-5 text-center md:-mx-12">
                <span className="text-2xl font-bold italic text-brand-purple">
                  #TradiciónQueNutre
                </span>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* ==============  DESKTOP (lg+) — nueva estructura  ========== */}
          {/* ============================================================ */}
          <div className="relative hidden lg:block">
            {/* Rectángulo morado: ~62% del ancho, alto propio */}
            <div className="relative w-[80%] rounded-[2rem] bg-brand-purpleDark pb-24 pl-14 pr-10 pt-16 shadow-card">
              {/* Título */}
              <h2 className="text-5xl font-bold leading-tight text-white">
                Colombia huele
                <br />a masa madre
              </h2>

              {/* Texto */}
              <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-white/90">
                <p>
                  Masa madre que transforma
                  <br />
                  Más que una técnica, es un movimiento.
                </p>
                <p>
                  Junto a CampeSENA y Full Popular, estamos llevando la
                  tradición <br/> del pan con masa madre a todo el país para
                  fortalecer <br/> comunidades y recuperar el sabor auténtico.
                </p>
              </div>

              {/* Hashtag pill blanco — pegado al borde inferior izquierdo del rectángulo */}
              <div className="absolute -bottom-10 left-20 rounded-[2rem] bg-white py-5 pl-14 pr-20 ">
                <span className="text-3xl font-bold italic text-brand-purple xl:text-4xl">
                  #TradiciónQueNutre
                </span>
              </div>
            </div>

            {/* Video — posicionado absoluto, sobresale del rectángulo morado */}
            <div className="absolute right-20 top-1/2 w-[40%] -translate-y-1/2">
              <button
                type="button"
                onClick={() => setVideoOpen(true)}
                className="group relative block w-full overflow-hidden rounded-2xl border-8 border-white shadow-intense"
                aria-label="Reproducir video"
              >
                <Image
                  src="/assets/imagen-referencia-video-beneficios.svg"
                  alt="Video: preparación de masa madre"
                  width={700}
                  height={400}
                  className="h-auto w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 transition group-hover:bg-black/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/assets/logo-play-video.svg"
                    alt=""
                    width={110}
                    height={110}
                    className="h-24 w-24 transition duration-300 group-hover:scale-110"
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal simple para el video (placeholder) */}
      {videoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setVideoOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-4xl rounded-xl bg-black p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setVideoOpen(false)}
              className="absolute -right-2 -top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-purple shadow-lg"
              aria-label="Cerrar"
            >
              ✕
            </button>
            <div className="aspect-video w-full rounded-lg bg-neutral-900 flex items-center justify-center text-white/60">
              <p>Aquí va el video embebido (YouTube/Vimeo)</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}