/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0f0b0d',        // Fondo carbón cálido Speakeasy
          surface: '#161214',   // Superficie de tarjetas y modales
          elevated: '#211a1e',  // Elementos activos/hover
          card: '#1c1518',      // Tarjetas internas
          border: '#38262f',    // Borde caoba sutil
          gold: '#f59e0b',      // Acento ámbar dorado principal
          goldLight: '#fbbf24', // Acento dorado claro
          goldDark: '#d97706',  // Acento dorado oscuro / bronce
        },
        category: {
          trivia: '#1d4ed8',    // Azul Zafiro Casino
          minijuego: '#d97706', // Ámbar / Bronce
          jugo: '#9333ea',      // Ciruela / Terciopelo
          reto: '#b91c1c',      // Vino Tinto / Burdeos
        }
      }
    },
  },
  plugins: [],
}
