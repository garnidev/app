"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

/**
 * Página de Login — Diseño "Tradición que nutre"
 *
 * Layout:
 * - Fondo único: imagen de trigo con degradado morado/azul
 * - Izquierda: logos + título grande + descripción
 * - Derecha: card blanca con formulario de inicio de sesión
 *
 * Responsive:
 * - Desktop: split visual (texto izquierda, card derecha)
 * - Móvil: stack vertical (logos + texto arriba, card debajo)
 */

export default function LoginPage() {
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: conectar con backend cuando esté listo
    console.log("Login:", { email, password });
  };

  return (
    <main className="relative flex min-h-screen w-full overflow-hidden">
      {/* ═══════════════════════════════════════════════════════════════
          FONDO — imagen de trigo con degradado morado/azul
          ═══════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/assets/fondo-trigo-login.svg"
          alt=""
          fill
          priority
          className="object-cover object-center"
          aria-hidden="true"
        />
        {/* Capa de degradado adicional para legibilidad del texto */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-brand-purple/20 via-brand-purple/50 to-[#681970]/80"
          aria-hidden="true"
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          CONTENIDO — grid 2 columnas en desktop, stack en móvil
          ═══════════════════════════════════════════════════════════════ */}
      <div className="container-site relative z-10 flex w-full flex-col items-center justify-center gap-10 py-12 lg:flex-row lg:justify-between lg:gap-16 lg:py-16">
        {/* ──────────────────────────────────────────────────────────────
            COLUMNA IZQUIERDA — logos + texto
            ────────────────────────────────────────────────────────────── */}
        <div className="flex w-full max-w-xl flex-col items-center text-center text-white lg:items-start lg:text-left">
          {/* Logos */}
          <div className="flex items-center gap-4">
            <Image
              src="/assets/logo-sena-menu.svg"
              alt="SENA"
              width={70}
              height={70}
              className="h-14 w-auto md:h-16"
              priority
            />
            <span className="h-12 w-px bg-white/50" aria-hidden="true" />
            <Image
              src="/assets/logo-masa-madre-menu.svg"
              alt="Masa Madre"
              width={70}
              height={70}
              className="h-14 w-auto md:h-16"
              priority
            />
          </div>

          {/* Título grande */}
          <h1
            className="mt-10 text-4xl font-extrabold italic leading-[1.05] md:text-5xl lg:text-6xl"
            style={{ textShadow: "0 4px 12px rgba(0, 0, 0, 0.8)" }}
          >
            Tradición
            <br />
            que nutre,
            <br />
            técnica que
            <br />
            transforma
          </h1>

          {/* Descripción */}
          <p className="mt-6 max-w-md text-sm leading-relaxed text-white/95 md:text-base">
            Un portal del <strong className="font-bold">SENA</strong>,{" "}
            <strong className="font-bold">CampeSENA</strong> y{" "}
            <strong className="font-bold">Full popular</strong> para fortalecer
            la panadería artesanal con Masa Madre en Colombia.
          </p>
        </div>

        {/* ──────────────────────────────────────────────────────────────
            COLUMNA DERECHA — card del formulario
            ────────────────────────────────────────────────────────────── */}
        <div className="w-full max-w-md">
          <div className="rounded-3xl bg-white/95 p-8 shadow-2xl backdrop-blur-sm md:p-10">
            {/* Título de la card */}
            <h2 className="text-center text-2xl font-extrabold italic text-brand-purpleDark md:text-3xl">
              Inicia sesión
            </h2>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
              {/* Input: Correo electrónico */}
              <div className="relative">
                <span
                  className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-neutral-500"
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Correo electrónico *"
                  required
                  aria-label="Correo electrónico"
                  className="w-full rounded-full border border-neutral-300 bg-white py-3.5 pl-14 pr-5 text-sm font-medium text-neutral-800 placeholder:text-neutral-500 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/30 md:text-base"
                />
              </div>

              {/* Input: Contraseña */}
              <div className="relative">
                <span
                  className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-neutral-500"
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                  </svg>
                </span>
                <input
                  type={mostrarPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña *"
                  required
                  aria-label="Contraseña"
                  className="w-full rounded-full border border-neutral-300 bg-white py-3.5 pl-14 pr-12 text-sm font-medium text-neutral-800 placeholder:text-neutral-500 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/30 md:text-base"
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword((v) => !v)}
                  aria-label={
                    mostrarPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-500 transition hover:text-neutral-700"
                >
                  {mostrarPassword ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Link: Olvidé mi contraseña */}
              <div className="flex justify-center">
                <button
                  type="button"
                  className="text-sm font-medium text-neutral-700 underline-offset-4 transition hover:underline"
                >
                  Olvidé mi Contraseña
                </button>
              </div>

              {/* Botón: Iniciar sesión */}
              <button
                type="submit"
                className="mt-2 w-full rounded-full bg-brand-green py-4 text-base font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-brand-greenDark hover:shadow-lg"
              >
                Iniciar sesión
              </button>

              {/* Texto inferior: Regístrate */}
              <p className="text-center text-sm text-neutral-700">
                ¿No tiene una cuenta aún?{" "}
                <button
                  type="button"
                  className="font-bold text-brand-purple transition hover:text-brand-purpleDark"
                >
                  Regístrate aquí
                </button>
              </p>
            </form>
            {/* Link volver al inicio */}
            <div className="mt-5 text-center md:mt-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 transition hover:text-brand-green"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Volver al Inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
