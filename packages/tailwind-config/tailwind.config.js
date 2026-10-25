/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["../../apps/**/*.{ts,tsx}", "../../packages/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        louve: {
          navy: "#0C1B33",
          "navy-light": "#1F3A75",
          blue: "#4377F9",
          "blue-hover": "#2D53A9",
          "blue-soft": "#ECF1FE",
          "blue-border": "#D9E4FE",
          "blue-muted": "#A5BCFD",
          cyan: "#C2EFF6",
          slate: "#506079",
          "slate-light": "#A7B1C9",
          "slate-muted": "#94A3B8",
          "slate-mid": "#64748B",
          bg: "#F8FAFC",
          surface: "#FFFFFF",
          border: "#E2E8F0",
          "border-strong": "#CBD5E1",
          "border-light": "#F1F5F9",
        },
        success: {
          50: "#ECFDF5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          900: "#064E3B",
        },
        warning: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          600: "#D97706",
          700: "#B45309",
        },
        danger: {
          50: "#FFF1F2",
          400: "#FB7185",
          500: "#F43F5E",
          600: "#E11D48",
        },
        error: {
          50: "#FEF2F2",
          200: "#FECACA",
          600: "#DC2626",
          900: "#7F1D1D",
        },
      },
      boxShadow: {
        card: "0 2px 10px -3px rgba(12, 27, 51, 0.05)",
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
      minHeight: {
        container: "calc(100vh - 64px)",
      },
    },
  },
};
