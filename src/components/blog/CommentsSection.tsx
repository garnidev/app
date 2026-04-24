"use client";

import Image from "next/image";
import { useState } from "react";
import type { Comentario } from "@/data/posts";

type Props = {
  comentariosIniciales: Comentario[];
};

/**
 * Sección de comentarios del artículo
 * - Renderiza lista de comentarios (con expansión "Ver más/menos" para textos largos)
 * - Formulario que agrega comentarios al estado local (no persiste al recargar)
 *
 * Cuando se integre la BD, el handler de submit hará un POST a la API,
 * y la lista inicial vendrá como prop desde el server component padre.
 */
export function CommentsSection({ comentariosIniciales }: Props) {
  const [comentarios, setComentarios] =
    useState<Comentario[]>(comentariosIniciales);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !email.trim() || !texto.trim()) return;

    setEnviando(true);

    // Simulamos un pequeño delay para dar sensación de envío
    setTimeout(() => {
      const nuevo: Comentario = {
        id: `c-${Date.now()}`,
        autor: nombre.trim(),
        avatar: "/assets/blog/avatar-default.jpg",
        texto: texto.trim(),
        fechaISO: new Date().toISOString().slice(0, 10),
      };
      setComentarios((prev) => [...prev, nuevo]);
      setNombre("");
      setEmail("");
      setTexto("");
      setEnviando(false);
    }, 300);
  };

  return (
    <section className="mx-auto mt-12 max-w-3xl md:mt-16">
      {/* Encabezado */}
      <h2 className="flex items-center gap-3 text-xl font-bold italic text-neutral-900 md:text-2xl">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-greenSoft">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-brand-green"
            aria-hidden="true"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </span>
        Comentarios
      </h2>

      {/* Lista de comentarios */}
      <div className="mt-6 space-y-4">
        {comentarios.length === 0 ? (
          <p className="rounded-2xl bg-neutral-50 px-6 py-5 text-center text-sm text-neutral-500">
            Sé el primero en comentar este artículo.
          </p>
        ) : (
          comentarios.map((c) => <CommentCard key={c.id} comentario={c} />)
        )}
      </div>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="mt-10 rounded-2xl bg-white md:mt-12"
        aria-label="Formulario de comentarios"
      >
        <h3 className="flex items-center gap-3 text-lg font-bold italic text-neutral-900 md:text-xl">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-greenSoft">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-brand-green"
              aria-hidden="true"
            >
              <path d="M20 12c0 4.4-3.6 8-8 8a8 8 0 0 1-4-1l-5 1 1.5-4.5A8 8 0 0 1 4 12a8 8 0 1 1 16 0z" />
              <path d="M9 10h6M9 14h4" />
            </svg>
          </span>
          Deja tu comentario
        </h3>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <InputConIcono
            tipo="text"
            valor={nombre}
            onChange={setNombre}
            placeholder="Tu nombre"
            icon={
              <>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </>
            }
            required
          />
          <InputConIcono
            tipo="email"
            valor={email}
            onChange={setEmail}
            placeholder="Correo electrónico (no se publica)"
            icon={
              <>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </>
            }
            required
          />
        </div>

        <div className="mt-4">
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="¿Qué piensas sobre este artículo?"
            rows={5}
            required
            className="w-full rounded-2xl border border-neutral-200 px-5 py-4 text-sm text-neutral-800 placeholder:text-neutral-500 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/30"
          />
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            disabled={enviando}
            className="inline-flex items-center gap-2 rounded-full bg-brand-green px-6 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-brand-greenDark disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span>{enviando ? "Publicando..." : "Publicar comentario"}</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </form>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   TARJETA DE COMENTARIO (con Ver más / Ver menos)
   ═══════════════════════════════════════════════════════════════════════ */

const LIMITE_CARACTERES = 180;

function CommentCard({ comentario }: { comentario: Comentario }) {
  const [expandido, setExpandido] = useState(false);
  const esLargo = comentario.texto.length > LIMITE_CARACTERES;
  const textoVisible =
    esLargo && !expandido
      ? comentario.texto.slice(0, LIMITE_CARACTERES).trimEnd() + "…"
      : comentario.texto;

  return (
    <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-black/5 md:p-6">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-brand-greenSoft ring-2 ring-brand-green/30">
          <Image
            src={comentario.avatar}
            alt={`Avatar de ${comentario.autor}`}
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>

        {/* Contenido */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="text-sm font-bold italic text-neutral-900 md:text-base">
              {comentario.autor}
            </h4>
            <span className="text-xs italic text-neutral-500">
              {formatearFechaComentario(comentario.fechaISO)}
            </span>
          </div>

          <p className="mt-1.5 text-sm leading-relaxed text-neutral-700">
            {textoVisible}
          </p>

          {esLargo && (
            <button
              type="button"
              onClick={() => setExpandido((v) => !v)}
              className="mt-2 text-xs font-semibold text-brand-purple hover:text-brand-purpleDark md:text-sm"
            >
              {expandido ? "Ver menos" : "Ver más"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   INPUT REUTILIZABLE CON ICONO
   ═══════════════════════════════════════════════════════════════════════ */

type InputProps = {
  tipo: string;
  valor: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  required?: boolean;
};

function InputConIcono({
  tipo,
  valor,
  onChange,
  placeholder,
  icon,
  required,
}: InputProps) {
  return (
    <div className="relative">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
        aria-hidden="true"
      >
        {icon}
      </svg>
      <input
        type={tipo}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-full border border-neutral-200 py-3 pl-12 pr-5 text-sm text-neutral-800 placeholder:text-neutral-500 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/30"
      />
    </div>
  );
}

/* ─── Formato de fecha para comentarios ───────────────────────────── */

const DIAS = [
  "Domingo", "Lunes", "Martes", "Miércoles",
  "Jueves", "Viernes", "Sábado",
];
const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function formatearFechaComentario(iso: string): string {
  const d = new Date(iso);
  const dia = DIAS[d.getUTCDay()];
  const num = d.getUTCDate();
  const mes = MESES[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return `${dia} ${num} de ${mes} ${year}`;
}