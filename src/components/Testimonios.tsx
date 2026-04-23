"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Testimonio = {
  nombre: string;
  cita: string;
  panaderia: string;
  ciudad: string;
};

const TESTIMONIOS: Testimonio[] = [
  {
    nombre: "Jorge Ramírez",
    cita: "Empecé desde cero y aprender masa madre me dio identidad. Vendo algo hecho con tiempo y propósito.",
    panaderia: "Emprendedora panadera",
    ciudad: "Bogotá",
  },
  {
    nombre: "María Fernanda",
    cita: "Desde que empezamos a trabajar con masa madre, la gente lo nota. Nos dicen que el pan sabe como el de antes. Y eso, para mí, lo cambia todo.",
    panaderia: "Panadería La Esquina del Trigo",
    ciudad: "Medellín",
  },
  {
    nombre: "Jorge Ramírez",
    cita: "Pensé que era solo una tendencia, pero fue una decisión que transformó mi panadería. Ahora vendemos más.",
    panaderia: "Panadería El Horno del Barrio",
    ciudad: "Cali",
  },
];

/**
 * Sección de testimonios
 * - MÓVIL: carrusel horizontal con scroll-snap + dots indicadores
 * - DESKTOP (md+): grid de 2/3 columnas estático
 */
export function Testimonios() {
  return (
    <section id="historia" className="bg-white py-40 md:py-40">
      {/* Desktop: grid estático */}
      <div className="container-site hidden md:block">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-6">
          {TESTIMONIOS.map((t, i) => (
            <TestimonioCard key={i} {...t} />
          ))}
        </div>
      </div>

      {/* Móvil: carrusel deslizable */}
      <div className="md:hidden">
        <CarruselMovil />
      </div>
    </section>
  );
}

function CarruselMovil() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState(0);

  // Detectar qué tarjeta está centrada al hacer scroll
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const onScroll = () => {
      // Ancho real de cada slide (incluye gap) = scrollWidth / número de slides
      const paso = el.scrollWidth / TESTIMONIOS.length;
      const indice = Math.round(el.scrollLeft / paso);
      setActivo(Math.min(indice, TESTIMONIOS.length - 1));
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const irA = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const paso = el.scrollWidth / TESTIMONIOS.length;
    el.scrollTo({ left: paso * i, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Track deslizable */}
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-2 pb-10 pt-16 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {/* Espaciador izquierdo para que la primera tarjeta quede centrada */}
        <div className="w-4 flex-shrink-0" aria-hidden="true" />

        {TESTIMONIOS.map((t, i) => (
          <div
            key={i}
            className="w-[85%] flex-shrink-0 snap-center"
          >
            <TestimonioCard {...t} />
          </div>
        ))}

        {/* Espaciador derecho para que la última tarjeta quede centrada */}
        <div className="w-4 flex-shrink-0" aria-hidden="true" />
      </div>

      {/* Dots indicadores */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {TESTIMONIOS.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => irA(i)}
            aria-label={`Ir al testimonio ${i + 1}`}
            aria-current={activo === i}
            className={`h-2.5 rounded-full transition-all ${
              activo === i
                ? "w-6 bg-brand-green"
                : "w-2.5 bg-neutral-200 hover:bg-neutral-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function TestimonioCard({ nombre, cita, panaderia, ciudad }: Testimonio) {
  return (
    <article className="relative mx-auto w-full max-w-sm pl-14 pt-14 md:pl-16 md:pt-16">
      <div className="relative">
        {/* Rectángulo de fondo verde claro con esquinas cóncavas (mordiscos circulares) */}
        <div
          className="min-h-[340px] rounded-bl-[6rem] rounded-tr-[6rem] bg-brand-greenSoft px-8 pb-12 pt-16 md:min-h-[380px] md:px-10 md:pt-20"
          style={{
            WebkitMaskImage: `
              radial-gradient(circle 80px at 0% 0%, transparent 98%, black 100%),
              radial-gradient(circle 50px at 100% 100%, transparent 98%, black 100%),
              linear-gradient(black, black)
            `,
            WebkitMaskComposite: "source-in",
            maskImage: `
              radial-gradient(circle 80px at 0% 0%, transparent 98%, black 100%),
              radial-gradient(circle 50px at 100% 100%, transparent 98%, black 100%),
              linear-gradient(black, black)
            `,
            maskComposite: "intersect",
          }}
        >
          {/* Nombre - alineado a la derecha del mordisco */}
          <h3 className="pl-10 text-xl font-bold italic  text-support-navy md:pl- md:text-2xl">
            {nombre}
          </h3>

          {/* Cita */}
          <p className="mt-6 text-sm leading-none text-support-navy md:text-[15px]">
            <span className="text-support-navy">“</span>
            {cita}
            <span className="text-support-navy">”</span>
          </p>

          {/* Meta: ubicación */}
          <div className="mt-6 flex items-start gap-2">
            <Image
              src="/assets/ubicacion-historia.svg"
              alt=""
              width={16}
              height={16}
              className="mt-0.5 h-4 w-4 flex-shrink-0"
            />
            <p className="text-xs leading-tight text-neutral-600">
              {panaderia} — {ciudad}
            </p>
          </div>
        </div>

        {/* Foto circular - ~mitad fuera del rectángulo por la izquierda y arriba */}
        <div className="absolute -left-14 -top-14 h-28 w-28 overflow-hidden rounded-full border-[5px] border-white shadow-lg md:-left-16 md:-top-16 md:h-32 md:w-32">
          <Image
            src="/assets/foto-redonda-historia.svg"
            alt={nombre}
            width={128}
            height={128}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Ícono circular verde - ~mitad fuera del rectángulo por la derecha y abajo */}
        <button
          type="button"
          className="absolute -bottom-10 -right-1 flex h-24 w-24 items-center justify-center rounded-full border-[8px] border-white bg-brand-green transition hover:scale-105"
          aria-label={`Ver historia de ${nombre}`}
        >
          <Image
            src="/assets/icono-seccion-historia.svg"
            alt=""
            width={56}
            height={56}
            className="h-full w-full"
          />
        </button>
      </div>
    </article>
  );
}