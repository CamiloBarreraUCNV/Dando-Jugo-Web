/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jugo: {
          dark: '#0f172a',
          card: '#1e293b',
          accent: '#f59e0b',
          pink: '#ec4899',
          purple: '#8b5cf6',
          green: '#10b981',
          cyan: '#06b6d4',
        }
      }
    },
  },
  plugins: [],
}
