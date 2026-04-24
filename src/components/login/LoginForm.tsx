"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

/**
 * Formulario de login (columna derecha)
 *
 * - En móvil: se renderiza como card blanca flotante con sombra, sobre el fondo animado
 * - En desktop: se renderiza como panel fijo a la derecha (45%)
 */
export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const [recordar, setRecordar] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setEnviando(true);
    // TODO: conectar con backend real
    setTimeout(() => {
      setEnviando(false);
      alert("Login simulado — integrar backend");
    }, 800);
  };

  return (
    <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-4 py-10 md:px-6 lg:w-[45%] lg:bg-white lg:px-16 lg:py-0">
      {/* Card blanca (solo visible en móvil/tablet, en desktop el fondo es del div padre) */}
      <div className="w-full max-w-md animate-fade-in-up rounded-3xl bg-white p-7 shadow-2xl ring-1 ring-black/5 md:p-10 lg:max-w-md lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none lg:ring-0">
        {/* Logo superior (solo visible en móvil/tablet) */}
        <div className="flex justify-center lg:hidden">
          <Image
            src="/assets/logo-masa-madre.svg"
            alt="Masa Madre"
            width={120}
            height={110}
            className="h-auto w-20 drop-shadow-md"
            priority
          />
        </div>

        {/* Encabezado */}
        <div className="mt-5 text-center lg:mt-0 lg:text-left">
          <h1 className="text-2xl font-extrabold italic text-neutral-900 md:text-3xl lg:text-4xl">
            Iniciar Sesión
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600 md:text-base">
            Bienvenido a la Red Masa Madre. Ingresa tus credenciales para
            continuar.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 md:mt-8 md:space-y-5">
          {/* Campo email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-neutral-800"
            >
              Correo electrónico
            </label>
            <div className="relative">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                aria-hidden="true"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                required
                autoComplete="email"
                className="w-full rounded-full border border-neutral-200 bg-neutral-50/50 py-3.5 pl-12 pr-5 text-sm text-neutral-800 transition placeholder:text-neutral-400 focus:border-brand-green focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-green/15"
              />
            </div>
          </div>

          {/* Campo contraseña con toggle */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-neutral-800"
            >
              Contraseña
            </label>
            <div className="relative">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                aria-hidden="true"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                id="password"
                type={verPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full rounded-full border border-neutral-200 bg-neutral-50/50 py-3.5 pl-12 pr-14 text-sm text-neutral-800 transition placeholder:text-neutral-400 focus:border-brand-green focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-green/15"
              />
              <button
                type="button"
                onClick={() => setVerPassword((v) => !v)}
                aria-label={verPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-400 transition hover:text-brand-green"
              >
                {verPassword ? (
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
          </div>

          {/* Fila: recordarme + olvidé contraseña */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <label className="inline-flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={recordar}
                onChange={(e) => setRecordar(e.target.checked)}
                className="h-4 w-4 cursor-pointer rounded border-neutral-300 text-brand-green focus:ring-2 focus:ring-brand-green/30"
              />
              <span className="text-neutral-700">Recordarme</span>
            </label>

            <Link
              href="/login/recuperar"
              className="font-semibold text-brand-purple transition hover:text-brand-purpleDark"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Botón principal */}
          <button
            type="submit"
            disabled={enviando}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-brand-green px-6 py-4 text-sm font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-brand-greenDark hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 md:text-base"
          >
            <span>{enviando ? "Ingresando..." : "Iniciar Sesión"}</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </form>

        {/* Link a registro */}
        <p className="mt-6 text-center text-sm text-neutral-600 md:mt-8">
          ¿No tienes cuenta?{" "}
          <Link
            href="/login/registro"
            className="font-bold text-brand-purple transition hover:text-brand-purpleDark"
          >
            Regístrate aquí
          </Link>
        </p>

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
  );
}