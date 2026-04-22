"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "motion/react";
import Image from "next/image";
import { useRef } from "react";

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
    <section id="inicio" ref={sectionRef} className="relative">
      <div className="relative h-[720px] w-full sm:h-[780px] lg:h-[720px] xl:h-[800px] 2xl:h-[860px]">
        {/* Fondo de trigo con parallax — contenedor con overflow-hidden propio */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            style={{ y: trigoY }}
            className="absolute inset-0"
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
        </div>

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
            width={958}
            height={577}
            className="h-auto w-[360px] sm:w-[460px] md:w-[600px] lg:w-[780px] xl:w-[940px] 2xl:w-[1100px]"
            priority
          />
        </motion.div>

        {/* Curva morada inferior — línea delgada con forma de "U" que cierra el hero */}
        <svg
          viewBox="0 0 1440 300"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-0 z-20 h-28 w-full sm:h-32 md:h-40 lg:h-48"
          aria-hidden="true"
        >
          {/* Área blanca debajo de la curva — tapa el fondo de trigo para crear el corte */}
          <path d="M0,300 L0,30 Q720,400 1440,30 L1440,300 Z" fill="white" />
          {/* Línea delgada morada sobre la curva */}
          <path
            d="M0,30 Q720,400 1440,30"
            fill="none"
            stroke="#802581"
            strokeWidth="15"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* Panadera central — fuera del contenedor con h-fija para poder extenderse debajo */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[-35px] z-30 flex justify-center sm:bottom-[-45px] md:bottom-[-60px] lg:bottom-[-80px] xl:bottom-[-100px] 2xl:bottom-[-135px]">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ y: panaderaY }}
          className="pointer-events-auto"
        >
          <Image
            src="/assets/panadera-central.svg"
            alt="Chef panadera con panes de masa madre"
            width={480}
            height={658}
            className="h-auto w-[150px] sm:w-[190px] md:w-[245px] lg:w-[315px] xl:w-[380px] 2xl:w-[445px]"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
