"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Comentario } from "@/data/posts";

type Props = {
  slug: string;
};

/**
 * Sección de comentarios del artículo
 * ───────────────────────────────────
 * - Carga comentarios aprobados del backend al montar
 * - El submit envía al backend y queda en estado PENDIENTE (moderación)
 * - Muestra mensaje de éxito explicando la moderación
 *
 * Endpoint: /api/posts/[slug]/comentarios
 */
export function CommentsSection({ slug }: Props) {
  // Estado de la lista de comentarios
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [cargando, setCargando] = useState(true);

  // Estado del formulario
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar comentarios aprobados al montar
  useEffect(() => {
    let activo = true;

    (async () => {
      try {
        setCargando(true);
        const res = await fetch(`/api/posts/${slug}/comentarios`);
        if (!res.ok) throw new Error("Error al cargar comentarios");

        const data = await res.json();

        if (activo) {
          // Adaptar formato del backend al frontend
          const adaptados: Comentario[] = data.comentarios.map(
            (c: {
              id: string;
              autor: string;
              avatar: string | null;
              texto: string;
              fecha: string;
            }) => ({
              id: c.id,
              autor: c.autor,
              avatar: c.avatar || "/assets/blog/avatar-default.jpg",
              texto: c.texto,
              fechaISO: c.fecha.split("T")[0],
            })
          );
          setComentarios(adaptados);
        }
      } catch (err) {
        console.error("Error cargando comentarios:", err);
      } finally {
        if (activo) setCargando(false);
      }
    })();

    return () => {
      activo = false;
    };
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !email.trim() || !texto.trim()) return;

    setEnviando(true);
    setError(null);
    setExito(false);

    try {
      const res = await fetch(`/api/posts/${slug}/comentarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          texto: texto.trim(),
          autor: nombre.trim(),
          // email no se envía al backend (estructura no lo guarda)
          // se usa solo para validación frontend o futuras notificaciones
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al enviar el comentario");
      }

      // Éxito: limpiar formulario y mostrar mensaje
      setNombre("");
      setEmail("");
      setTexto("");
      setExito(true);

      // Ocultar mensaje de éxito después de 6 segundos
      setTimeout(() => setExito(false), 6000);
    } catch (err) {
      const mensaje =
        err instanceof Error ? err.message : "Error desconocido";
      setError(mensaje);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="mx-auto mt-12 max-w-3xl md:mt-16">
      {/* Encabezado */}
      <h2 className="flex items-center gap-3 text-xl font-bold italic text-blueDark md:text-2xl">
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
        {cargando ? (
          <CommentSkeleton />
        ) : comentarios.length === 0 ? (
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
        className="mt-10 rounded-2xl  md:mt-12"
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
            minLength={5}
            maxLength={2000}
            className="w-full rounded-2xl border border-neutral-200 px-5 py-4 text-sm text-neutral-800 placeholder:text-neutral-500 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/30"
          />
        </div>

        {/* Mensaje de éxito */}
        {exito && (
          <div className="mt-4 rounded-2xl border border-brand-green/30 bg-brand-greenSoft px-5 py-4 text-sm text-brand-greenDark">
            <p className="flex items-start gap-2">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-0.5 h-5 w-5 shrink-0 text-brand-green"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>
                <strong>¡Comentario recibido!</strong> Tu mensaje será publicado
                una vez que sea revisado por un moderador.
              </span>
            </p>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            <p className="flex items-start gap-2">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-0.5 h-5 w-5 shrink-0 text-red-600"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </p>
          </div>
        )}

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
    <div className="relative ml-10 rounded-2xl bg-white p-5 pl-16 shadow-soft ring-1 ring-black/5 md:ml-12 md:p-6 md:pl-20">
      {/* Avatar — sobresale por la esquina superior izquierda */}
      <div className="absolute -left-10 -top-1 h-20 w-20 overflow-hidden rounded-full bg-brand-greenSoft ring-4 ring-brand-green/40 md:-left-18 md:h-15 md:w-15">
        <Image
          src={comentario.avatar}
          alt={`Avatar de ${comentario.autor}`}
          fill
          sizes="96px"
          className="object-cover"
        />
      </div>

      {/* Contenido */}
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h4 className="text-base font-bold italic text-support-navy md:text-lg">
          {comentario.autor}
        </h4>
        <span className="text-xs italic text-neutral-500">
          {formatearFechaComentario(comentario.fechaISO)}
        </span>
      </div>

      <p className="mt-1.5 text-sm leading-relaxed text-neutral-700 md:text-base">
        {textoVisible}
      </p>

      {esLargo && (
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={() => setExpandido((v) => !v)}
            className="text-xs font-semibold text-brand-green hover:text-brand-purpleDark md:text-sm"
          >
            {expandido ? "Ver menos" : "Ver más"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SKELETON DE CARGA
   ═══════════════════════════════════════════════════════════════════════ */

function CommentSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="relative ml-10 rounded-2xl bg-white p-5 pl-16 shadow-soft ring-1 ring-black/5 md:ml-12 md:p-6 md:pl-20"
        >
          <div className="absolute -left-10 -top-1 h-20 w-20 animate-pulse rounded-full bg-neutral-200" />
          <div className="h-5 w-32 animate-pulse rounded bg-neutral-200" />
          <div className="mt-3 h-4 w-full animate-pulse rounded bg-neutral-200" />
          <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-neutral-200" />
        </div>
      ))}
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
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];
const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function formatearFechaComentario(iso: string): string {
  const d = new Date(iso);
  const dia = DIAS[d.getUTCDay()];
  const num = d.getUTCDate();
  const mes = MESES[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return `${dia} ${num} de ${mes} ${year}`;
}