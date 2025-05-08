import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  server: { 
    host: true,     // equivalently "0.0.0.0"
    port: 3000,
    hmr: false,
    proxy: {
      // proxy any /api request to your FastAPI server
      '/api': { target: 'http://localhost:8000', changeOrigin: true },
    },
  }
});