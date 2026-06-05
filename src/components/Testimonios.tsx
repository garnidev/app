"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Testimonio = {
  nombre: string;
  cita: string;
  panaderia: string;
  ciudad: string;
  imagen: string;
};

const TESTIMONIOS: Testimonio[] = [
  {
    nombre: "Paula \n Bernal",
    cita: "Empecé desde cero y aprender masa madre me dio identidad. Vendo algo hecho con tiempo y propósito.",
    panaderia: "Emprendedora \n panadera",
    ciudad: "Bogotá",
    imagen: "/assets/foto-redonda-historia.svg",
  },
  {
    nombre: "María \n Fernanda",
    cita: "Desde que empezamos a trabajar con masa madre, la gente lo nota. Nos dicen que el pan sabe como el de antes. Y eso, para mí, lo cambia todo.",
    panaderia: "Panadería La Esquina \n del Trigo",
    ciudad: "Medellín",
    imagen: "/assets/foto-redonda-historia2.svg",
  },
  {
    nombre: "Jorge \n Ramírez",
    cita: "Pensé que era solo una tendencia, pero fue una decisión que transformó mi panadería. Ahora vendemos más.",
    panaderia: "Panadería El Horno \n del Barrio",
    ciudad: "Cali",
    imagen: "/assets/foto-redonda-historia3.svg",
  },
];

/**
 * Sección de testimonios
 * - MÓVIL: carrusel horizontal con scroll-snap + dots indicadores
 * - DESKTOP (md+): grid de 2/3 columnas estático
 */
export function Testimonios() {
  return (
    <section id="historia" className="bg-white pb-12 pt-4 md:pb-28 md:pt-16">
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
    <div className="relative pb-8">
      {/* Track deslizable */}
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-2 pb-10 pt-16 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {/* Espaciador izquierdo para que la primera tarjeta quede centrada */}
        <div className="w-4 flex-shrink-0" aria-hidden="true" />

        {TESTIMONIOS.map((t, i) => (
          <div key={i} className="w-[85%] flex-shrink-0 snap-center">
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

function TestimonioCard({
  nombre,
  cita,
  panaderia,
  ciudad,
  imagen,
}: Testimonio) {
  return (
    <article className="relative mx-auto w-full max-w-sm pl-10 pt-10 md:pl-12 md:pt-12">
      <div className="relative">
        {/* Rectángulo SVG de fondo */}
        <Image
          src="/assets/fondo-testimonio.svg"
          alt=""
          width={310}
          height={393}
          className="block h-auto w-full"
          aria-hidden="true"
        />

        {/* Contenido encima del SVG */}
        <div className="absolute inset-0 px-8 pb-12 pt-16 md:px-10 md:pt-20">
          {/* Nombre - alineado a la derecha del mordisco */}
          <h3 className="-mt-10 whitespace-pre-line pl-10 text-xl text-center font-bold italic leading-tight text-support-navy md:-mt-16 md:text-3xl">
            {nombre}
          </h3>

          {/* Cita */}
          <p className="mt-[60px] text-sm leading-snug text-support-navy md:mt-[55px] md:text-[15px]">
            <span className="text-support-navy">"</span>
            {cita}
            <span className="text-support-navy">"</span>
          </p>

          {/* Meta: ubicación */}
          <div className="mt-[20px] flex flex-col items-start gap-2 md:mt-[24px]">
            <Image
              src="/assets/ubicacion-historia.svg"
              alt=""
              width={16}
              height={16}
              className="h-4 w-4 flex-shrink-0"
            />
            <p className="whitespace-pre-line text-xs leading-tight text-neutral-600">
              {panaderia} — {ciudad}
            </p>
          </div>
        </div>

        {/* Foto circular - ~mitad fuera del rectángulo por la izquierda y arriba */}
        <div className="absolute -left-[32px] -top-[20px] h-28 w-28 md:-left-[37px] md:-top-[30px] md:h-32 md:w-32">
          <Image
            src={imagen}
            alt={nombre}
            width={128}
            height={128}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Ícono circular verde - ~mitad fuera del rectángulo por la derecha y abajo */}
        <button
          type="button"
          className="absolute -bottom-[28px] -right-[4px] flex h-24 w-24 items-center justify-center rounded-full border-[8px] border-white bg-brand-green transition hover:scale-105 md:-bottom-[32px] md:-right-[8px] md:h-32 md:w-32"
          aria-label={`Ver historia de ${nombre}`}
        >
          <Image
            src="/assets/icono-seccion-historia.svg"
            alt=""
            width={96}
            height={96}
            className="h-full w-full"
          />
        </button>
      </div>
    </article>
  );
}
