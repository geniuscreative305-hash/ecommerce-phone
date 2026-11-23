import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#0066FF",
          600: "#0052cc",
          700: "#004099",
          DEFAULT: "#0066FF",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F8FAFC",
          card: "#FFFFFF",
          border: "#E2E8F0",
        },
        navy: {
          900: "#0F172A",
          800: "#1E293B",
          700: "#334155",
        },
        discount: {
          DEFAULT: "#EF4444",
        }
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

