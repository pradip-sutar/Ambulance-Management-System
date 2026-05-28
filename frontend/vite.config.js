import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  base: "/",

  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true
  },

  server: {
    port: 4179,
    http2: false,
    host: true
  },

  preview: {
    host: "0.0.0.0",
    port: 4179,
    allowedHosts: ["moambulanceseba.com"],
  },
});