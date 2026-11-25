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
        paper:'var(--paper)',card:'var(--card)',ink:'var(--ink)',muted:'var(--muted)',dim:'var(--dim)',line:'var(--line)',field:'var(--field)',accent:'var(--accent)',
        bg:{0:'var(--bg-0)',1:'var(--bg-1)',2:'var(--bg-2)',inv:'var(--bg-inv)'},
        tx:{0:'var(--tx-0)',1:'var(--tx-1)',2:'var(--tx-2)',3:'var(--tx-3)',inv:'var(--tx-inv)'},
        ac:{DEFAULT:'var(--ac)',dim:'var(--ac-dim)'},
        lu:'var(--lu)',quan:'var(--quan)',ke:'var(--ke)',ji:'var(--ji)'
      },
      fontFamily: {
        sans: ["var(--font)"],
        serif:["var(--font-serif)"],
        mono: ["var(--font-mono)"],
      },
      boxShadow:{xs:'none',sm:'none',md:'none',lg:'none'},
      borderRadius: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        pill: "999px",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        "spin-slow": "spin 20s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
