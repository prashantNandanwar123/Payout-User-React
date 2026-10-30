import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({

  plugins: [react(), tailwindcss()],

  server: {
    proxy: {
      "/api": {
        target: "http://192.168.29.144:8095",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})