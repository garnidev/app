import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Masa Madre | SENA",
    template: "%s | Masa Madre SENA",
  },
  description:
    "Portal de panaderías aliadas con masa madre. Iniciativa del SENA, CampeSENA y Full Popular para promover la tradición ancestral del pan artesanal en Colombia.",
  keywords: [
    "masa madre",
    "SENA",
    "CampeSENA",
    "panadería",
    "pan artesanal",
    "Colombia",
    "fermentación natural",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={workSans.variable}>
      <body className="font-sans" suppressHydrationWarning>{children}</body>
    </html>
  );
}
