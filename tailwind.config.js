/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        white: "#FFFFFF",
        accent: "#5947fb",
        accentDark: "#5246E0",
        warn: "#FFCA1B",
        gray900: "#1A1A1A",
        gray500: "#8C94A3",
        surface: {
          light: "#F5F5F7"
        }
      },
      borderRadius: {
        xlTop: "48px 48px 0 0",
        xlBottom: "0 0 48px 48px",
        xlFull: "48px"
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"]
      },
      fontSize: {
        'hero-desktop': 'clamp(2.375rem, 6vw, 6rem)',
        'hero-mobile': 'clamp(2.375rem, 8vw, 3rem)',
      },
      height: {
        '18': '4.5rem', // 72px
      }
    },
  },
  plugins: [],
} 