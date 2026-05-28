"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type Estado = "PENDIENTE" | "APROBADO" | "RECHAZADO";

type Comentario = {
  id: string;
  texto: string;
  autor: string;
  avatar: string | null;
  fecha: string;
  estado: Estado;
  post: {
    id: string;
    slug: string;
    titulo: string;
  };
};

type Totales = {
  pendientes: number;
  aprobados: number;
  rechazados: number;
};

type Props = {
  /** Si se proporciona, filtra solo los comentarios de ese post */
  postSlug?: string;
  /** Si se proporciona, oculta el link "En: post título" porque ya estamos en el contexto del post */
  mostrarPostLink?: boolean;
};

export function ComentariosClient({
  postSlug,
  mostrarPostLink = true,
}: Props = {}) {
  const [estadoActivo, setEstadoActivo] = useState<Estado>("PENDIENTE");
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [totales, setTotales] = useState<Totales>({
    pendientes: 0,
    aprobados: 0,
    rechazados: 0,
  });
  const [cargando, setCargando] = useState(true);

  /* ─── Construir URL del endpoint según contexto ────────────────── */
  const construirUrl = useCallback(
    (estado: Estado, limit?: number) => {
      // Si hay postSlug, usamos el endpoint del post (público)
      // Si no, usamos el endpoint global (admin)
      const base = postSlug
        ? `/api/posts/${postSlug}/comentarios?estado=${estado}`
        : `/api/comentarios?estado=${estado}`;
      return limit ? `${base}&limit=${limit}` : base;
    },
    [postSlug],
  );

  /* ─── Cargar comentarios del estado activo ─────────────────────── */
  const cargarComentarios = useCallback(async () => {
    setCargando(true);
    try {
      const res = await fetch(construirUrl(estadoActivo));
      if (!res.ok) throw new Error("Error al cargar comentarios");
      const data = await res.json();
      setComentarios(data.comentarios);
    } catch (error) {
      console.error("Error cargando comentarios:", error);
      setComentarios([]);
    } finally {
      setCargando(false);
    }
  }, [estadoActivo, construirUrl]);

  /* ─── Cargar totales de los 3 estados ──────────────────────────── */
  const cargarTotales = useCallback(async () => {
    try {
      const [pendRes, aprobRes, rechRes] = await Promise.all([
        fetch(construirUrl("PENDIENTE", 1)),
        fetch(construirUrl("APROBADO", 1)),
        fetch(construirUrl("RECHAZADO", 1)),
      ]);

      const [pend, aprob, rech] = await Promise.all([
        pendRes.ok ? pendRes.json() : { total: 0 },
        aprobRes.ok ? aprobRes.json() : { total: 0 },
        rechRes.ok ? rechRes.json() : { total: 0 },
      ]);

      setTotales({
        pendientes: pend.total,
        aprobados: aprob.total,
        rechazados: rech.total,
      });
    } catch (error) {
      console.error("Error cargando totales:", error);
    }
  }, [construirUrl]);

  useEffect(() => {
    cargarComentarios();
  }, [cargarComentarios]);

  useEffect(() => {
    cargarTotales();
  }, [cargarTotales]);

  /* ─── Acciones de moderación ───────────────────────────────────── */
  const moderar = async (id: string, nuevoEstado: Estado) => {
    try {
      const res = await fetch(`/api/comentarios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      if (!res.ok) throw new Error("Error al moderar");
      await cargarComentarios();
      await cargarTotales();
    } catch (error) {
      console.error("Error moderando:", error);
      alert("No se pudo moderar el comentario");
    }
  };

  const eliminar = async (id: string) => {
    if (!confirm("¿Eliminar este comentario permanentemente?")) return;

    try {
      const res = await fetch(`/api/comentarios/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      await cargarComentarios();
      await cargarTotales();
    } catch (error) {
      console.error("Error eliminando:", error);
      alert("No se pudo eliminar el comentario");
    }
  };

  /* ─── Render ───────────────────────────────────────────────────── */
  return (
    <div className="mt-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-neutral-200">
        <TabButton
          activo={estadoActivo === "PENDIENTE"}
          onClick={() => setEstadoActivo("PENDIENTE")}
          label="Pendientes"
          count={totales.pendientes}
          variant="warning"
        />
        <TabButton
          activo={estadoActivo === "APROBADO"}
          onClick={() => setEstadoActivo("APROBADO")}
          label="Aprobados"
          count={totales.aprobados}
          variant="success"
        />
        <TabButton
          activo={estadoActivo === "RECHAZADO"}
          onClick={() => setEstadoActivo("RECHAZADO")}
          label="Rechazados"
          count={totales.rechazados}
          variant="danger"
        />
      </div>

      {/* Listado */}
      <div className="mt-6 flex flex-col gap-3">
        {cargando ? (
          <LoadingState />
        ) : comentarios.length === 0 ? (
          <EmptyState estado={estadoActivo} />
        ) : (
          comentarios.map((c) => (
            <ComentarioCard
              key={c.id}
              comentario={c}
              mostrarPostLink={mostrarPostLink}
              onAprobar={() => moderar(c.id, "APROBADO")}
              onRechazar={() => moderar(c.id, "RECHAZADO")}
              onEliminar={() => eliminar(c.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   COMPONENTES INTERNOS
   ═══════════════════════════════════════════════════════════════════════ */

function TabButton({
  activo,
  onClick,
  label,
  count,
  variant,
}: {
  activo: boolean;
  onClick: () => void;
  label: string;
  count: number;
  variant: "warning" | "success" | "danger";
}) {
  const colorBadge =
    variant === "warning"
      ? "bg-amber-100 text-amber-700"
      : variant === "success"
        ? "bg-brand-greenSoft text-brand-greenDark"
        : "bg-red-100 text-red-700";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
        activo
          ? "border-brand-purple text-brand-purpleDark"
          : "border-transparent text-neutral-500 hover:text-neutral-700"
      }`}
    >
      <span>{label}</span>
      <span
        className={`flex h-5 min-w-[1.5rem] items-center justify-center rounded-full px-2 text-xs font-bold ${colorBadge}`}
      >
        {count}
      </span>
    </button>
  );
}

function ComentarioCard({
  comentario,
  mostrarPostLink,
  onAprobar,
  onRechazar,
  onEliminar,
}: {
  comentario: Comentario;
  mostrarPostLink: boolean;
  onAprobar: () => void;
  onRechazar: () => void;
  onEliminar: () => void;
}) {
  const fecha = new Date(comentario.fecha).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-300 md:p-6">
      {/* Header: autor + fecha + estado */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-greenSoft text-sm font-bold text-brand-greenDark">
            {comentario.autor.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-900">
              {comentario.autor}
            </p>
            <p className="text-xs text-neutral-500">{fecha}</p>
          </div>
        </div>
        <EstadoBadge estado={comentario.estado} />
      </div>

      {/* Texto del comentario */}
      <p className="mt-4 text-sm leading-relaxed text-neutral-700 md:text-base">
        {comentario.texto}
      </p>

      {/* Post asociado (solo en la vista global) */}
      {mostrarPostLink && comentario.post && (
        <Link
          href={`/blog/${comentario.post.slug}`}
          target="_blank"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-brand-purpleDark hover:underline"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
            aria-hidden="true"
          >
            <path d="M14 3h7v7M10 14L21 3M21 14v7H3V3h7" />
          </svg>
          <span>En: {comentario.post.titulo}</span>
        </Link>
      )}

      {/* Acciones */}
      <div className="mt-5 flex flex-wrap gap-2 border-t border-neutral-100 pt-4">
        {comentario.estado !== "APROBADO" && (
          <button
            type="button"
            onClick={onAprobar}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-green px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-greenDark"
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
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Aprobar</span>
          </button>
        )}

        {comentario.estado !== "RECHAZADO" && (
          <button
            type="button"
            onClick={onRechazar}
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-4 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-200"
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
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            <span>Rechazar</span>
          </button>
        )}

        <button
          type="button"
          onClick={onEliminar}
          className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
            aria-hidden="true"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6" />
            <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
          </svg>
          <span>Eliminar</span>
        </button>
      </div>
    </article>
  );
}

function EstadoBadge({ estado }: { estado: Estado }) {
  const config = {
    PENDIENTE: {
      label: "Pendiente",
      className: "bg-amber-100 text-amber-700",
    },
    APROBADO: {
      label: "Aprobado",
      className: "bg-brand-greenSoft text-brand-greenDark",
    },
    RECHAZADO: {
      label: "Rechazado",
      className: "bg-red-100 text-red-700",
    },
  };

  const { label, className } = config[estado];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}
    >
      {label}
    </span>
  );
}

function LoadingState() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-neutral-200 bg-white p-5"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-full bg-neutral-200" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-32 animate-pulse rounded bg-neutral-200" />
              <div className="h-2 w-20 animate-pulse rounded bg-neutral-200" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full animate-pulse rounded bg-neutral-200" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-neutral-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ estado }: { estado: Estado }) {
  const mensajes = {
    PENDIENTE: "No hay comentarios pendientes de moderación",
    APROBADO: "Aún no hay comentarios aprobados",
    RECHAZADO: "No hay comentarios rechazados",
  };

  return (
    <div className="rounded-3xl bg-white p-10 text-center ring-1 ring-neutral-200">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-greenSoft">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-7 w-7 text-brand-green"
          aria-hidden="true"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <h2 className="mt-4 text-lg font-bold text-neutral-900">
        {mensajes[estado]}
      </h2>
      <p className="mt-2 text-sm text-neutral-600">
        {estado === "PENDIENTE"
          ? "Cuando un usuario deje un comentario, aparecerá aquí para moderar."
          : "Los comentarios que apruebas o rechazas aparecen en sus respectivas pestañas."}
      </p>
    </div>
  );
}