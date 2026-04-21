/**
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║              PALETA DE COLORES - PORTAL MASA MADRE                ║
 * ║                                                                   ║
 * ║  Este es el ÚNICO archivo que debes modificar para cambiar        ║
 * ║  colores en toda la aplicación.                                   ║
 * ║                                                                   ║
 * ║  Los colores se exponen automáticamente a:                        ║
 * ║   • Tailwind CSS (via tailwind.config.ts)                         ║
 * ║   • Variables CSS (via globals.css)                               ║
 * ║                                                                   ║
 * ║  Uso en Tailwind:  bg-brand-purple, text-brand-green              ║
 * ║  Uso en CSS:       var(--color-brand-purple)                      ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 */

export const colors = {
  // ─── Marca SENA / MasaMadre ─────────────────────────────────────────
  brand: {
    purple: "#802581",       // Morado principal SENA (hero, botones CTA)
    purpleDark: "#681970",   // Morado oscuro (rectángulos, footer acentos)
    purpleMid: "#712679",    // Morado medio (logo play, sello)
    purpleAlt: "#71277A",    // Morado alternativo (sello circular)
    green: "#39A900",        // Verde SENA principal (botones, titulares)
    greenLight: "#53B535",   // Verde claro (detalles)
    greenBright: "#63C545",  // Verde brillante (sombras del hero)
    greenDark: "#009E00",    // Verde oscuro (ícono historia)
    greenSoft: "#E6F5E6",    // Verde suave (fondo tarjetas testimonios)
  },

  // ─── Gobierno de Colombia (gov.co) ──────────────────────────────────
  gov: {
    blue: "#164194",         // Azul gov.co barra superior
    blueDark: "#0943B5",
    blueLight: "#0081C9",    // Azul TIC / ICONTEC
    blueSoft: "#5DB0D2",
    red: "#C54549",          // Rojo bandera / alertas
    yellow: "#F4D970",       // Amarillo bandera
    yellowSoft: "#FCF18E",
    yellowPale: "#FFFBDF",
    cream: "#FAEDC9",
  },

  // ─── Neutros ────────────────────────────────────────────────────────
  neutral: {
    900: "#303030",
    800: "#3F3F3F",
    700: "#4B4B4B",
    600: "#525252",
    500: "#727272",
    400: "#365B71",          // Texto secundario (ícono ubicación)
    200: "#DADADA",
    100: "#D9D9D9",
    50:  "#FAFAFA",
    white: "#FFFFFF",
  },

  // ─── Apoyo (azules oscuros para textos destacados) ──────────────────
  support: {
    navy: "#042E46",
    navyAlt: "#04324D",
  },
} as const;

/**
 * Genera un objeto plano { 'brand-purple': '#802581', ... }
 * para uso en Tailwind config.
 */
export function flattenColors(
  obj: Record<string, unknown>,
  prefix = ""
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}-${key}` : key;
    if (typeof value === "string") {
      result[newKey] = value;
    } else if (typeof value === "object" && value !== null) {
      Object.assign(result, flattenColors(value as Record<string, unknown>, newKey));
    }
  }
  return result;
}

export const flatColors = flattenColors(colors);
