import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href?: string; // si no tiene href, es el item actual (no clickeable)
};

type Props = {
  items: BreadcrumbItem[];
};

/**
 * Breadcrumbs del admin.
 * El primer item es siempre la casa (icono home).
 * El último item se muestra en verde (activo, sin link).
 */
export function Breadcrumbs({ items }: Props) {
  return (
    <nav aria-label="Ruta de navegación" className="flex items-center text-sm">
      <ol className="flex flex-wrap items-center gap-2">
        {/* Icono casa (siempre va a /admin) */}
        <li>
          <Link
            href="/admin"
            aria-label="Inicio del panel"
            className="flex items-center text-neutral-500 transition hover:text-brand-green"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M3 11l9-8 9 8v9a2 2 0 0 1-2 2h-4v-6h-6v6H5a2 2 0 0 1-2-2v-9z" />
            </svg>
          </Link>
        </li>

        {items.map((item, idx) => {
          const esUltimo = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-2">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-neutral-400"
                aria-hidden="true"
              >
                <path d="M9 6l6 6-6 6" />
              </svg>
              {esUltimo || !item.href ? (
                <span
                  className={
                    esUltimo
                      ? "font-bold text-brand-green"
                      : "text-neutral-600"
                  }
                  aria-current={esUltimo ? "page" : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-neutral-600 transition hover:text-brand-green"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}