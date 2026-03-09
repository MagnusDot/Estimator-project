import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const base = process.env.VITE_BASE_PATH || '/'

export default defineConfig({
  base,
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
