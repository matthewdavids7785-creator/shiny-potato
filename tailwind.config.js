/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: { 900: '#050505', 800: '#0f1115', 700: '#1a1d26' },
        accent: { 500: '#FF4F18', 400: '#ff784e' },
        green: { 500: '#10b981' }
      },
      fontFamily: { sans: ['Plus Jakarta Sans', 'sans-serif'] },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
            '0%': { opacity: '0', transform: 'translateY(10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}