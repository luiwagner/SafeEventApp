/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
        },
        main: 'var(--color-main)',
        muted: 'var(--color-muted)',
        card: 'var(--color-card)',
        bg: 'var(--color-bg)',
        border: 'var(--color-border)',
      },
      ringColor: {
        primary: 'var(--color-ring)',
      }
    },
  },
  plugins: [],
};