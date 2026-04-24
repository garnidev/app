"use client";

/**
 * Buscador del dashboard admin
 * Por ahora solo visual — sin lógica de búsqueda real.
 * Cuando se integre backend, conectar el onSubmit a la búsqueda global.
 */
export function DashboardSearch() {
  return (
    <form
      role="search"
      aria-label="Buscar en el panel"
      className="relative mt-8 w-full max-w-xl"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="search"
        placeholder="Buscar"
        aria-label="Buscar"
        className="w-full rounded-full border border-neutral-200 bg-white py-3.5 pl-6 pr-14 text-sm text-neutral-800 shadow-sm transition placeholder:text-neutral-400 focus:border-brand-green focus:outline-none focus:ring-4 focus:ring-brand-green/15 md:text-base"
      />
      <button
        type="submit"
        aria-label="Buscar"
        className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-neutral-500 transition hover:text-brand-green"
      >
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
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </button>
    </form>
  );
}