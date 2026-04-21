import Image from "next/image";
import Link from "next/link";

const REDES = [
  { label: "@SENA", href: "https://www.facebook.com/SENA", icon: "facebook" },
  { label: "@SENACOMUNICA", href: "https://www.instagram.com/senacomunica/", icon: "instagram" },
  { label: "@SENATV", href: "https://www.youtube.com/user/SENATV", icon: "youtube" },
  { label: "@SENACOMUNICA", href: "https://twitter.com/SENAComunica", icon: "x" },
] as const;

const LINKS_INST = [
  { label: "Políticas", href: "#politicas" },
  { label: "Mapa del sitio", href: "#mapa-sitio" },
  { label: "Términos y Condiciones", href: "#terminos" },
  { label: "Accesibilidad", href: "#accesibilidad" },
];

/**
 * Footer institucional SENA
 * - Fondo exterior: morado arriba, verde abajo
 * - Tarjeta blanca flotante sobre ambos colores
 * - Barra azul "gov.co" pegada al fondo
 *
 * MÓVIL: título arriba, logos SENA + TIC en fila, info en bloque, redes verticales
 * DESKTOP: título arriba, grid de 2 columnas (info + logo TIC), redes en fila
 */
export function Footer() {
  return (
    <footer id="soporte" className="relative">
      {/* Fondo dividido: morado arriba, verde abajo */}
      <div className="absolute inset-0 flex flex-col" aria-hidden="true">
        <div className="flex-1 bg-brand-purpleDark" />
        <div className="flex-1 bg-brand-green" />
      </div>

      {/* Tarjeta blanca flotante */}
      <div className="relative px-4 py-8 md:px-8 md:py-12">
        <div className="container-site rounded-[2rem] bg-white px-6 py-10 shadow-lg md:px-12 md:py-14 lg:px-16">
          {/* Título principal */}
          <h3 className="text-sm font-bold uppercase tracking-wide text-neutral-900 md:text-base">
            Servicio Nacional de Aprendizaje SENA
          </h3>

          {/* Logos SENA + TIC — en fila (separados a los extremos en móvil y desktop) */}
          <div className="mt-6 flex items-start justify-between gap-6">
            <Image
              src="/assets/logo-sena-verde-footer.svg"
              alt="SENA"
              width={100}
              height={98}
              className="h-16 w-auto md:h-20"
            />
            <Image
              src="/assets/logo-tic-footer.svg"
              alt="Gobierno de Colombia - TIC"
              width={100}
              height={120}
              className="h-20 w-auto md:h-24"
            />
          </div>

          {/* Info institucional */}
          <div className="mt-8 lg:grid lg:grid-cols-[1fr_auto] lg:gap-10">
            <div>
              <p className="max-w-2xl text-sm leading-relaxed text-neutral-700 md:text-[15px]">
                El SENA brinda a la ciudadanía, atención presencial en las 33
                Regionales y 117 Centros de Formación.
              </p>

              <h4 className="mt-6 text-sm font-semibold text-neutral-900 md:text-base">
                Línea de atención y contacto
              </h4>
              <dl className="mt-3 space-y-1 text-sm text-neutral-700 md:text-[15px]">
                <ContactRow label="Dirección:" value="Calle 57 No. 8 - 69 Bogotá D.C. (Cundinamarca)" />
                <ContactRow label="Código postal:" value="110111" />
                <ContactRow label="Horario de atención:" value="Lunes a viernes xx:xx a.m. - xx:xx p.m." />
                <ContactRow label="Teléfono conmutador:" value="+57(xx) xxx xx xx" />
                <ContactRow label="Línea gratuita:" value="+57(xx) xxx xx xx" />
                <ContactRow label="Línea anticorrupción:" value="+57(xx) xxx xx xx" />
                <ContactRow label="Correo institucional:" value="ministerio@ministerio.gov.co" />
                <ContactRow label="Correo de notificaciones judiciales:" value="judiciales@gov.co" />
              </dl>

              {/* Redes sociales — verticales en móvil, en fila en desktop */}
              <ul className="mt-6 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-x-6 md:gap-y-3">
                {REDES.map((red, i) => (
                  <li key={i}>
                    <a
                      href={red.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 text-sm text-neutral-700 transition hover:text-brand-purple"
                    >
                      <SocialIcon type={red.icon} />
                      <span className="underline underline-offset-4">{red.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Certificaciones — centradas en móvil, derecha en desktop */}
          <div className="mt-8 flex justify-center lg:justify-end">
            <Image
              src="/assets/logo-iso-footer.svg"
              alt="Certificaciones ICONTEC / IQNet"
              width={241}
              height={78}
              className="h-16 w-auto md:h-20"
            />
          </div>

          {/* Información institucional */}
          <div className="mt-8">
            <h4 className="text-sm font-bold text-neutral-900 md:text-base">
              Información institucional
            </h4>
            <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 md:flex md:flex-wrap md:gap-x-8 md:gap-y-2">
              {LINKS_INST.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-neutral-600 underline underline-offset-4 transition hover:text-brand-purple md:text-[15px]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ContactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap gap-x-1.5">
      <dt className="font-medium text-neutral-900">{label}</dt>
      <dd className="text-neutral-700">{value}</dd>
    </div>
  );
}

function SocialIcon({ type }: { type: "facebook" | "instagram" | "youtube" | "x" }) {
  const props = {
    width: 28,
    height: 28,
    viewBox: "0 0 28 28",
    fill: "currentColor",
    className: "h-7 w-7 text-brand-green transition group-hover:text-brand-green-dark",
    "aria-hidden": true,
  };
  switch (type) {
    case "facebook":
      return (
        <svg {...props}>
          <rect width="28" height="28" rx="14" fill="currentColor" />
          <path
            d="M16 10h2V7h-2c-1.7 0-3 1.3-3 3v1h-2v3h2v7h3v-7h2l1-3h-3v-1c0-.6.4-1 1-1z"
            fill="#fff"
          />
        </svg>
      );
    case "instagram":
      return (
        <svg {...props}>
          <rect width="28" height="28" rx="6" fill="currentColor" />
          <rect x="7" y="7" width="14" height="14" rx="4" stroke="#fff" strokeWidth="1.5" fill="none" />
          <circle cx="14" cy="14" r="3" stroke="#fff" strokeWidth="1.5" fill="none" />
          <circle cx="18.5" cy="9.5" r="1" fill="#fff" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...props}>
          <rect width="28" height="28" rx="6" fill="currentColor" />
          <path d="M11 10v8l6-4-6-4z" fill="#fff" />
        </svg>
      );
    case "x":
      return (
        <svg {...props}>
          <rect width="28" height="28" rx="6" fill="currentColor" />
          <path
            d="M18 8h2l-4.5 5.2L21 20h-4.2l-3.3-4.3L9.5 20H7.5l4.8-5.5L7 8h4.3l3 4 3.7-4z"
            fill="#fff"
          />
        </svg>
      );
  }
}