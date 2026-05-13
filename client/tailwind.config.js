/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          light: '#1E293B',
          DEFAULT: '#0F172A',
          dark: '#020617',
        },
        orange: {
          warm: '#F59E0B',
          hover: '#D97706',
        },
        beige: {
          soft: '#FDF6E3',
          dark: '#F5E6D3',
        },
        gold: '#D4AF37',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
