import Image from "next/image";

/**
 * Barra institucional gov.co
 * Azul oficial del gobierno colombiano con el logo/sello de gov.co.
 *
 * - Desktop: altura compacta (py-1.5) con logo alineado a la izquierda
 * - Móvil: altura igual al Header (h-[68px]) con logo centrado y más grande
 */
export function GovBar() {
  return (
    <div className="w-full bg-[#0943b5] py-1.5 md:py-1.5">
      <div className="container-site flex h-[50px] items-center justify-center md:h-auto md:justify-start">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://betowa.sena.edu.co/assets/logos/gov-logo-new.svg"
          alt="GOV.CO"
          className="h-8 w-auto object-contain md:h-5"
        />
      </div>
    </div>
  );
}