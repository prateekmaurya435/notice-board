/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1A1B2E",
        paper: "#F7F6F3",
        brand: {
          50: "#F1F0FB",
          100: "#E3E0F6",
          200: "#C4BEEC",
          300: "#A29AE0",
          400: "#8478D4",
          500: "#6657C7",
          600: "#5443B0",
          700: "#433590",
          800: "#332870",
          900: "#241D52",
        },
        urgent: "#C7372F",
      },
      fontFamily: {
        display: ["Sora", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(26, 27, 46, 0.06), 0 8px 24px -8px rgba(26, 27, 46, 0.10)",
      },
    },
  },
  plugins: [],
};
