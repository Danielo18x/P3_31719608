import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxear llamadas a /auth y /api al backend en el puerto donde corre Express
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        // Si llamas /api/auth/register, esto lo reescribe a /auth/register en el backend
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
