"use client";

import { useState } from "react";

export function PasswordForm() {
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [passwordConfirmar, setPasswordConfirmar] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  const handleGuardar = async () => {
    // Validaciones cliente
    if (!passwordActual) {
      setError("Ingresa tu contraseña actual");
      return;
    }
    if (passwordNueva.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres");
      return;
    }
    if (passwordNueva !== passwordConfirmar) {
      setError("Las contraseñas nuevas no coinciden");
      return;
    }
    if (passwordActual === passwordNueva) {
      setError("La nueva contraseña debe ser diferente a la actual");
      return;
    }

    setError(null);
    setExito(false);
    setEnviando(true);

    try {
      const res = await fetch("/api/users/me/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passwordActual, passwordNueva }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al cambiar contraseña");

      setExito(true);
      setPasswordActual("");
      setPasswordNueva("");
      setPasswordConfirmar("");
    } catch (err) {
      const mensaje =
        err instanceof Error ? err.message : "Error desconocido";
      setError(mensaje);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="rounded-3xl bg-white p-6 ring-1 ring-neutral-200 md:p-8">
      <h2 className="text-lg font-bold text-neutral-900">
        Cambiar contraseña
      </h2>
      <p className="mt-1 text-sm text-neutral-600">
        Para tu seguridad, necesitamos tu contraseña actual.
      </p>

      <div className="mt-6 space-y-5">
        {/* Mensajes */}
        {error && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}
        {exito && (
          <div
            role="status"
            className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            ✓ Contraseña cambiada exitosamente
          </div>
        )}

        {/* Contraseña actual */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-neutral-700">
            Contraseña actual
          </label>
          <input
            type={mostrar ? "text" : "password"}
            value={passwordActual}
            onChange={(e) => setPasswordActual(e.target.value)}
            placeholder="Tu contraseña actual"
            className="w-full rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
          />
        </div>

        {/* Nueva contraseña */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-neutral-700">
            Nueva contraseña
          </label>
          <input
            type={mostrar ? "text" : "password"}
            value={passwordNueva}
            onChange={(e) => setPasswordNueva(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            className="w-full rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
          />
        </div>

        {/* Confirmar nueva */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-neutral-700">
            Confirmar nueva contraseña
          </label>
          <input
            type={mostrar ? "text" : "password"}
            value={passwordConfirmar}
            onChange={(e) => setPasswordConfirmar(e.target.value)}
            placeholder="Repite la nueva contraseña"
            className="w-full rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
          />
        </div>

        {/* Toggle ver contraseña */}
        <label className="flex cursor-pointer items-center gap-2 text-xs text-neutral-600">
          <input
            type="checkbox"
            checked={mostrar}
            onChange={(e) => setMostrar(e.target.checked)}
            className="h-4 w-4 rounded border-neutral-300 text-brand-green focus:ring-brand-green/30"
          />
          Mostrar contraseñas
        </label>

        {/* Botón */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleGuardar}
            disabled={enviando}
            className="inline-flex items-center gap-2 rounded-full bg-brand-green px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-greenDark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {enviando ? "Cambiando..." : "Cambiar contraseña"}
          </button>
        </div>
      </div>
    </div>
  );
}