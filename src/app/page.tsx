import { GovBar } from "@/components/GovBar";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Beneficios } from "@/components/Beneficios";
import { ColombiaHuele } from "@/components/ColombiaHuele";
import { PuntosAliados } from "@/components/PuntosAliados";
import { Embajadores } from "@/components/Embajadores";
import { Testimonios } from "@/components/Testimonios";
import { Footer } from "@/components/Footer";
// import { SplashScreen } from "@/components/SplashScreen";

export default function HomePage() {
  return (
    <>
      {/* <SplashScreen /> */}

      {/* Wrapper sticky solo en móvil — fija GovBar + Header arriba */}
      <div className="fixed left-0 right-0 top-0 z-50 md:static">
        <GovBar />
        <Header />
      </div>

      {/* Spacer para evitar que el contenido quede debajo del header fijo en móvil */}
      <div className="h-[120px] md:hidden" aria-hidden="true" />

      <main>
        <Hero />
        <PuntosAliados />
        <Beneficios />
        <ColombiaHuele />
        <Testimonios />
        <Embajadores />
      </main>
      <Footer />
      <GovBar />
    </>
  );
}
