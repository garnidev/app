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
    <section className="relative overflow-hidden bg-white py-20">
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
          {/* Tarjeta morada principal */}
          <div className="relative overflow-hidden rounded-[2rem] bg-brand-purpleDark p-6 pb-0 shadow-card md:p-12 md:pb-0 lg:p-10 lg:pb-0">
            {/* Decoración con recortes orgánicos - opacidad para textura */}
            <div
              className="pointer-events-none absolute inset-0 opacity-0"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 925 489"
                preserveAspectRatio="xMidYMid slice"
                className="h-full w-full"
              >
                <path
                  d="M57 0C50 0 46 7 47 14C48 16 48 19 48 21C48 44 31 64 9 68C4 69 0 73 0 78V356C0 362 5 366 11 366C12 365 14 365 15 365C63 366 101 404 100 451C100 460 99 468 97 475C95 482 99 489 106 489H119C124 489 128 483 128 477L128 458C129 443 141 430 156 431L367 431C382 432 394 444 394 459L394 478C394 484 397 489 403 489H441C450 489 455 475 452 467C449 461 448 455 448 449L450 106C450 79 472 57 499 57L916 59C921 59 925 55 925 50V20C925 9 916 0 905 0H57Z"
                  fill="white"
                />
              </svg>
            </div>

            <div className="relative z-10 grid items-center gap-6 md:gap-8 lg:grid-cols-2 lg:gap-12">
              {/* Video (primero en móvil, derecha en desktop) */}
              <div className="relative order-1 lg:order-2">
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
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/20 transition group-hover:bg-black/10" />
                  {/* Botón play */}
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

              {/* Texto (segundo en móvil, izquierda en desktop) */}
              <div className="order-2 lg:order-1">
                <h2 className="text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
                  Colombia huele
                  <br />a masa madre
                </h2>

                <div className="mt-6 space-y-4 text-base leading-relaxed text-white/90 md:text-[17px]">
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

            {/* Hashtag inferior: pestaña blanca ancha en móvil, pill en desktop */}
            <div className="relative z-10 mt-8 md:mt-10">
              {/* Móvil: pestaña anclada al borde inferior, ancho completo */}
              <div className="lg:hidden">
                <div className="-mx-6 rounded-t-3xl bg-white px-6 py-5 text-center md:-mx-12">
                  <span className="text-2xl font-bold italic text-brand-purple">
                    #TradiciónQueNutre
                  </span>
                </div>
              </div>

              {/* Desktop: pill flotante alineado a la izquierda */}
              <div className="hidden lg:flex lg:justify-start lg:pb-14 lg:pl-4">
                <div className="rounded-full bg-white px-12 py-5 shadow-lg">
                  <span className="text-3xl font-bold italic text-brand-purple lg:text-4xl">
                    #TradiciónQueNutre
                  </span>
                </div>
              </div>
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