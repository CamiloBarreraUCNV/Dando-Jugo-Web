import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Rutas relativas para que funcione directamente en GitHub Pages sin problemas de subcarpeta
  base: './',
});
