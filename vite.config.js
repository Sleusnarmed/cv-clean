import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
  },
  server: {
    port:  4173,  // Use the PORT provided by Render or default to 4173
    host: '0.0.0.0',                 // Make the server accessible externally
  },
});
