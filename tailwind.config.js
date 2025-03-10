/** @type {import('tailwindcss').Config} */
const shadcnPreset = require("tailwindcss-animate");

module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/[locale]/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@shadcn/ui/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      fontFamily: {
        firaGo: ["var(--font-firaGo)", "sans-serif"],
        bpgNino: ["var(--font-bpgNino)", "sans-serif"],
        arial: ["var(--font-arial)", "sans-serif"],
      },
    },
  },
  plugins: [shadcnPreset],
};
