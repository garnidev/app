"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

/**
 * Splash screen temático masa madre
 * - Fondo: degradado verde → morado
 * - Espigas de trigo dibujándose en los laterales (stroke-dasharray)
 * - Partículas de harina cayendo suavemente
 * - Logo: gris al inicio → se llena de color de abajo hacia arriba
 * - Barra de progreso determinística (0 → 100%)
 * - Fade-out al finalizar
 */
export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  // Duración total del splash
  const DURACION = 2400;

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const d = reduced ? 700 : DURACION;

    document.body.style.overflow = "hidden";

    const t1 = setTimeout(() => setFadeOut(true), d - 400);
    const t2 = setTimeout(() => {
      setVisible(false);
      // Restaurar scroll explícitamente al finalizar el splash
      document.body.style.overflow = "";
    }, d);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.style.overflow = "";
    };
  }, []);

  // Partículas de harina - posiciones aleatorias pero estables entre renders
  const particulas = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 3,
        size: 2 + Math.random() * 4,
        opacity: 0.3 + Math.random() * 0.5,
      })),
    []
  );

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] overflow-hidden bg-gradient-to-br from-brand-green via-brand-green-dark to-brand-purple-dark transition-opacity duration-400 ${
        fadeOut ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-hidden={fadeOut}
      role="status"
      aria-label="Cargando"
    >
      
      {/* Contenido centrado */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        {/* Logo con efecto de llenado */}
        <div className="relative">
          {/* Capa base: logo en gris/desaturado */}
          <Image
            src="/assets/logo-masa-madre.svg"
            alt=""
            width={220}
            height={203}
            className="h-[180px] w-auto opacity-30 grayscale md:h-[220px]"
            priority
            aria-hidden="true"
          />
          {/* Capa encima: mismo logo en color, revelado de abajo hacia arriba */}
          <div
            className="animate-logo-fill absolute inset-0 overflow-hidden"
            aria-hidden="true"
          >
            <Image
              src="/assets/logo-masa-madre.svg"
              alt="Masa Madre"
              width={220}
              height={203}
              className="h-[180px] w-auto drop-shadow-2xl md:h-[220px]"
              priority
            />
          </div>
        </div>

        {/* Barra de progreso determinística */}
        <div className="mt-10 h-1.5 w-56 overflow-hidden rounded-full bg-white/20 md:w-72">
          <div className="h-full animate-progreso rounded-full bg-white" />
        </div>

        {/* Texto */}
        <p className="mt-5 text-sm font-light italic tracking-wide text-white/85 md:text-base">
          Sabores que fermentan nuestra tierra
        </p>
      </div>
    </div>
  );
}
