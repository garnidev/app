import Image from "next/image";

/**
 * Barra institucional gov.co
 * Azul oficial del gobierno colombiano con el logo/sello de gov.co
 */
export function GovBar() {
  return (
    <div className="w-full bg-[#0943b5] py-1.5 px-4 flex items-center justify-center">
      <div className="max-w-7xl w-full flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://betowa.sena.edu.co/assets/logos/gov-logo-new.svg"
          alt="GOV.CO"
          className="h-5 w-auto object-contain"
        />
      </div>
    </div>
)
}