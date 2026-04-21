import { GovBar } from "@/components/GovBar";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Beneficios } from "@/components/Beneficios";
import { ColombiaHuele } from "@/components/ColombiaHuele";
import { PuntosAliados } from "@/components/PuntosAliados";
import { Embajadores } from "@/components/Embajadores";
import { Testimonios } from "@/components/Testimonios";
import { Footer } from "@/components/Footer";
import { SplashScreen } from "@/components/SplashScreen";

export default function HomePage() {
  return (
    <>
      <SplashScreen />
      <GovBar />
      <Header />
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