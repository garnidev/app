"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from "motion/react";

/**
 * Hero principal
 *
 * MÓVIL (vertical):
 *   1. Título arriba centrado
 *   2. Sello grande centrado debajo
 *   3. Personas + panadera al final cruzando la curva morada
 *
 * DESKTOP (lg+, horizontal):
 *   - Título centrado-izquierda, sello arriba-derecha flotando
 *   - Personas + panadera centradas abajo
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const panaderaY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [0, -60]
  );
  const trigoY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [0, 50]
  );

  const tituloContainer: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  };
  const tituloItem: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      id="inicio"
      ref={sectionRef}
      className="relative isolate overflow-hidden"
    >
      <div className="relative h-[780px] w-full sm:h-[820px] lg:h-[680px]">
        {/* Fondo de trigo con parallax */}
        <motion.div
          style={{ y: trigoY }}
          className="absolute inset-0 -z-10"
          aria-hidden="true"
        >
          <Image
            src="/assets/fondo-trigo.svg"
            alt=""
            fill
            priority
            className="object-cover object-center"
          />
        </motion.div>

        {/* Overlay sutil */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/10"
          aria-hidden="true"
        />

        {/* ========== MÓVIL / TABLET (< lg): layout vertical ========== */}
        <div className="flex h-full flex-col items-center px-4 pt-8 lg:hidden">
          {/* Título centrado */}
          <motion.h1
            variants={tituloContainer}
            initial="hidden"
            animate="visible"
            className="z-10 text-center text-3xl font-bold leading-tight text-white drop-shadow-lg sm:text-4xl"
          >
            <motion.span variants={tituloItem} className="block">
              ¡<span className="font-bold">Tradición</span>{" "}
              <span className="font-light">que nutre,</span>
            </motion.span>
            <motion.span variants={tituloItem} className="block">
              <span className="font-light">técnica que </span>
              <span className="font-bold">transforma</span>
            </motion.span>
          </motion.h1>

          {/* Sello grande centrado */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
            className="z-10 mt-6 sm:mt-8"
          >
            <div className={shouldReduceMotion ? "" : "animate-seal-float"}>
              <Image
                src="/assets/logo-masa-madre.svg"
                alt="Sabores que fermentan nuestra tierra"
                width={310}
                height={286}
                className="h-[200px] w-auto drop-shadow-xl sm:h-[240px]"
                priority
              />
            </div>
          </motion.div>
        </div>

        {/* ========== DESKTOP (lg+): título + sello posicionados ========== */}
        <div className="hidden lg:block">
          {/* Título centrado-izquierda */}
          <motion.h1
            variants={tituloContainer}
            initial="hidden"
            animate="visible"
            className="absolute left-1/2 top-14 z-10 -translate-x-[55%] text-center text-5xl font-bold leading-tight text-white drop-shadow-lg"
          >
            <motion.span variants={tituloItem} className="block">
              ¡<span className="font-bold">Tradición</span>{" "}
              <span className="font-light">que nutre,</span>
            </motion.span>
            <motion.span variants={tituloItem} className="block">
              <span className="font-light">técnica que </span>
              <span className="font-bold">transforma</span>
            </motion.span>
          </motion.h1>

          {/* Sello arriba-derecha */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
            className="absolute right-6 top-8 z-20 xl:right-12"
          >
            <div className={shouldReduceMotion ? "" : "animate-seal-float"}>
              <Image
                src="/assets/logo-masa-madre.svg"
                alt="Sabores que fermentan nuestra tierra"
                width={310}
                height={286}
                className="h-[180px] w-auto drop-shadow-xl xl:h-[220px]"
                priority
              />
            </div>
          </motion.div>
        </div>

        {/* ========== PERSONAS + PANADERA (común a móvil y desktop) ========== */}
        {/* Personas laterales — centradas abajo */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-center"
        >
          <Image
            src="/assets/personas-primera-seccion.svg"
            alt="Emprendedores agrícolas"
            width={782}
            height={1023}
            className="h-auto w-[340px] sm:w-[420px] md:w-[540px] lg:w-[680px] xl:w-[760px]"
            priority
          />
        </motion.div>

        {/* Curva morada inferior */}
        {/* <div
          className="absolute inset-x-0 bottom-0 z-20 h-20 bg-brand-purple sm:h-24 md:h-28"
          style={{ clipPath: "ellipse(60% 100% at 50% 0%)" }}
          aria-hidden="true"
        /> */}

        {/* Panadera central — encaja en el hueco entre los laterales */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ y: panaderaY }}
          className="absolute bottom-0 left-1/2 z-30 -translate-x-1/2 translate-y-[15%]"
        >
          <Image
            src="/assets/panadera-central.svg"
            alt="Chef panadera con panes de masa madre"
            width={996}
            height={1351}
            className="h-auto w-[200px] sm:w-[260px] md:w-[340px] lg:w-[440px] xl:w-[500px]"
            priority
          />
        </motion.div>
      </div>

      {/* Base morada — continúa debajo para alojar a la panadera */}
      {/* <div className="h-24 bg-brand-purple sm:h-28 md:h-32" aria-hidden="true" />       */}
    </section>
  );
}