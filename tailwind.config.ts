import type { Config } from "tailwindcss";
import { colors } from "./src/styles/colors";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Expone la paleta completa bajo: bg-brand-purple, text-gov-blue, etc.
        brand: colors.brand,
        gov: colors.gov,
        neutral: colors.neutral,
        support: colors.support,
      },
      fontFamily: {
        sans: ["var(--font-work-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-work-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        card: "0 10px 30px -10px rgba(104, 25, 112, 0.25)",
        soft: "0 4px 20px rgba(0, 0, 0, 0.08)",
        intense: "0 20px 50px -12px rgba(0, 0, 0, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
