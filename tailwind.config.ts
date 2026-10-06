import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        foreground: "#111111",
        primary: "#111111",
        secondary: "#4B5563",
        accent: "#F5F5F5",
      },
      fontFamily: {
        'kompas-sans': ['var(--font-roboto)', 'sans-serif'],
        'kompas-serif': ['var(--font-pt-serif)', 'serif'],
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography")
  ],
};
export default config;
