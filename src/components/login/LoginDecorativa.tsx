"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Particula = {
  left: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
};

/**
 * Fondo animado con gradiente + partículas de harina.
 * Se usa como fondo full-screen en móvil y como columna decorativa en desktop.
 * Es absolute para poderlo superponer con el form encima.
 */
export function LoginFondoAnimado() {
  const [particulas, setParticulas] = useState<Particula[]>([]);

  useEffect(() => {
    setParticulas(
      Array.from({ length: 20 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 6 + Math.random() * 4,
        size: 2 + Math.random() * 4,
        opacity: 0.25 + Math.random() * 0.4,
      }))
    );
  }, []);

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-gradient-to-br from-brand-purpleDark via-brand-purple to-brand-green bg-[length:200%_200%] animate-gradient-shift"
      aria-hidden="true"
    >
      {/* Textura de trigo sutil */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 mix-blend-overlay"
        style={{ backgroundImage: "url('/assets/TrigoFondoBar.png')" }}
      />

      {/* Degradado extra para dar profundidad */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />

      {/* Partículas de harina */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particulas.map((p, i) => (
          <span
            key={i}
            className="absolute -top-4 animate-flour-fall rounded-full bg-white"
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Columna decorativa para DESKTOP — incluye fondo animado + contenido institucional
 * (píldora dorada, logo, tagline, logos SENA/Masa Madre).
 * Se oculta en móvil.
 */
export function LoginDecorativa() {
  return (
    <aside
      className="relative hidden h-screen overflow-hidden lg:flex lg:flex-col lg:justify-between"
      aria-hidden="true"
    >
      {/* Fondo animado (compartido con móvil) */}
      <LoginFondoAnimado />

      {/* Contenido superior: píldora dorada */}
      <div className="relative z-10 flex justify-center pt-12">
        <div
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#E6B052] to-[#A67226] px-5 py-2.5 shadow-lg ring-1 ring-[#8B5E1F]/40 animate-fade-in-up"
          style={{
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), 0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          <Image
            src="/assets/icono-panadero-menu.svg"
            alt=""
            width={22}
            height={22}
            className="h-5 w-5 brightness-0"
            aria-hidden="true"
          />
          <span className="text-xs font-extrabold uppercase tracking-[0.15em] text-neutral-900">
            Del Horno a la Palabra
          </span>
        </div>
      </div>

      {/* Contenido central: logo + tagline */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-12 text-center">
        <div className="animate-seal-float">
          <Image
            src="/assets/logo-masa-madre.svg"
            alt="Masa Madre"
            width={280}
            height={258}
            className="h-auto w-[220px] drop-shadow-2xl xl:w-[280px]"
            priority
          />
        </div>

        <h2
          className="mt-10 text-3xl font-extrabold italic leading-tight text-white xl:text-4xl"
          style={{ textShadow: "0 4px 12px rgba(0, 0, 0, 0.4)" }}
        >
          Tradición que nutre,
          <br />
          técnica que transforma
        </h2>

        <p className="mt-6 max-w-md text-sm leading-relaxed text-white/85 xl:text-base">
          Un portal del SENA, CampeSENA y Full Popular para fortalecer la
          panadería artesanal con masa madre en Colombia.
        </p>
      </div>

      {/* Pie: logos institucionales */}
      <div className="relative z-10 flex items-center justify-center gap-5 pb-10">
        <Image
          src="/assets/logo-sena-menu.svg"
          alt="SENA"
          width={54}
          height={52}
          className="h-11 w-auto opacity-90"
        />
        <span className="h-10 w-px bg-white/40" aria-hidden="true" />
        <Image
          src="/assets/logo-masa-madre-menu.svg"
          alt="Masa Madre"
          width={66}
          height={57}
          className="h-11 w-auto opacity-90"
        />
      </div>
    </aside>
  );
}