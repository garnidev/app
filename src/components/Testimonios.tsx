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
    <section id="historia" className="bg-white py-20 md:py-24">
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
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [&::-webkit-scrollbar]:hidden"
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
    <article className="relative mx-auto w-full max-w-sm pt-4">
      <div className="relative">
        {/* Fondo orgánico verde (SVG) */}
        <Image
          src="/assets/fondo-historia.svg"
          alt=""
          width={420}
          height={520}
          className="pointer-events-none h-auto w-full select-none"
          aria-hidden="true"
        />

        {/* Contenido superpuesto */}
        <div className="absolute inset-0 flex flex-col px-6 pb-12 pt-6 md:px-7">
          {/* Header: foto + nombre lado a lado */}
          <div className="flex items-center gap-4">
            <div className="relative h-24 w-24 flex-shrink-0 -translate-x-2 -translate-y-6 overflow-hidden rounded-full border-[5px] border-white shadow-lg md:h-28 md:w-28">
              <Image
                src="/assets/foto-redonda-historia.svg"
                alt={nombre}
                width={120}
                height={120}
                className="h-full w-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold italic leading-tight text-support-navy md:text-2xl">
              {nombre}
            </h3>
          </div>

          {/* Cita */}
          <p className="mt-2 text-sm leading-relaxed text-support-navy md:text-[15px]">
            <span className="text-support-navy">“</span>
            {cita}
            <span className="text-support-navy">”</span>
          </p>

          {/* Meta: ubicación */}
          <div className="mt-auto flex items-start gap-2 pt-4">
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

        {/* Ícono circular verde abajo a la derecha */}
        <button
          type="button"
          className="absolute -bottom-2 right-4 flex h-14 w-14 items-center justify-center transition hover:scale-105"
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