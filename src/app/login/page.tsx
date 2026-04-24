import type { Metadata } from "next";
import {
  LoginDecorativa,
  LoginFondoAnimado,
} from "@/components/login/LoginDecorativa";
import { LoginForm } from "@/components/login/LoginForm";

export const metadata: Metadata = {
  title: "Iniciar Sesión | Masa Madre",
  description:
    "Accede a la Red Masa Madre Colombia. Portal de panaderías aliadas del SENA y CampeSENA.",
};

/**
 * Página de Login
 *
 * Layout adaptativo:
 * - Desktop (≥1024px): split-screen con columna decorativa (55%) + formulario (45%)
 * - Móvil/tablet: fondo animado full-screen con formulario flotando como card blanca encima
 */
export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen flex-col lg:flex-row">
      {/* Fondo animado full-screen (solo visible en móvil/tablet) */}
      <div className="lg:hidden">
        <LoginFondoAnimado />
      </div>

      {/* Columna decorativa (solo visible en desktop) */}
      <div className="lg:w-[55%]">
        <LoginDecorativa />
      </div>

      {/* Columna del formulario (siempre visible) */}
      <LoginForm />
    </main>
  );
}