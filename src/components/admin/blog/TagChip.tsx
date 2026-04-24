type TagColor = "green" | "purple" | "blue" | "amber";

type Props = {
  label: string;
  color?: TagColor;
};

const COLORS: Record<TagColor, string> = {
  green: "bg-brand-greenSoft text-brand-green",
  purple: "bg-brand-purple/10 text-brand-purpleDark",
  blue: "bg-blue-50 text-blue-700",
  amber: "bg-amber-50 text-amber-700",
};

/**
 * Chip pequeño para mostrar tags en las filas del listado.
 * Acepta distintos colores para diferenciarlos visualmente.
 */
export function TagChip({ label, color = "green" }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${COLORS[color]}`}
    >
      {label}
    </span>
  );
}

/**
 * Helper para asignar color automáticamente a un tag basado en su label.
 * Así evitamos tener que configurar manualmente cada uno.
 */
export function colorParaTag(label: string): TagColor {
  const normalizado = label.toLowerCase();
  if (normalizado.includes("fermentación") || normalizado.includes("fermentacion")) return "green";
  if (normalizado.includes("técnica") || normalizado.includes("tecnica")) return "purple";
  if (normalizado.includes("salud")) return "blue";
  if (normalizado.includes("colombia") || normalizado.includes("territorio")) return "amber";
  return "green"; // default
}