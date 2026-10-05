import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // the 3D contact lanyard (three.js + Rapier wasm) is one lazy chunk, loaded
  // during boot or on first open; it never blocks the main bundle
  build: { chunkSizeWarningLimit: 3500 },
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
})
