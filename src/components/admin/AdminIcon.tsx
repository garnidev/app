import path from "path/win32";
import type { NavIcon } from "./navigation";

/**
 * Iconos SVG del admin — centralizados para fácil reemplazo.
 * Todos heredan color con currentColor y respetan el className recibido.
 */
export function AdminIcon({
  name,
  className = "h-5 w-5",
}: {
  name: NavIcon;
  className?: string;
}) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };

  switch (name) {
    case "home":
      return (
        <svg {...common}>
          <path d="M7.84483 22.5H20.1552C21.4502 22.5 22.5 21.4502 22.5 20.1552V11.3621L14 5.5L5.5 11.3621V20.1552C5.5 21.4502 6.54983 22.5 7.84483 22.5Z" />
          <path d="M11.3614 18.3954C11.3614 17.1003 12.4113 16.0505 13.7062 16.0505H14.2924C15.5874 16.0505 16.6372 17.1003 16.6372 18.3954V22.4988H11.3614V18.3954Z" />
        </svg>
      );

    case "panaderias":
      // Pan / hogaza con pin de ubicación
      return (
        <svg {...common}>
        <path d="M10.6206 3.57434L6.29963 6.14601" />
        <path d="M10.6206 7.17443L6.29963 9.74611" />
        <path d="M15.3174 9.59976L14.9735 7.75867C14.9382 7.44615 15.0686 7.13787 15.3174 6.94547C16.1128 6.46307 16.6273 5.62734 16.7 4.69995C16.7 2.4908 13.1183 0.699951 8.70001 0.699951C4.28172 0.699951 0.700012 2.4908 0.700012 4.69995C0.772687 5.62734 1.28727 6.46307 2.08264 6.94547C2.33143 7.13787 2.4618 7.44615 2.42652 7.75867L1.86206 13.7846C1.79206 14.5318 2.04017 15.2739 2.5455 15.8288C3.05082 16.3837 3.76657 16.7 4.51706 16.7H7.19967"/>
        <path d="M8.69965 13.1998V13.1998C8.69965 11.7086 9.90848 10.4998 11.3996 10.4998V10.4998C12.8908 10.4998 14.0996 11.7086 14.0996 13.1998V13.1998C14.0996 14.4637 12.7203 15.814 11.9335 16.4817C11.6227 16.7343 11.1773 16.7343 10.8666 16.4817C10.079 15.814 8.69965 14.4637 8.69965 13.1998Z" />
        </svg>
      );

    case "blog":
      // Documento con líneas
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M8 9h8M8 13h8M8 17h5" />
        </svg>
      );

    case "usuarios":
      return (
        <svg {...common}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );

    case "reportes":
      return (
        <svg {...common}>
          <path d="M3 3v18h18" />
          <path d="M7 14l4-4 4 4 5-6" />
        </svg>
      );

    case "config":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );

    default:
      return null;
  }
}