import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { cpSync } from 'node:fs'
import { resolve } from 'node:path'

function copyThirdParty() {
  return {
    name: 'copy-third-party',
    closeBundle() {
      cpSync(
        resolve(__dirname, 'static/third_party'),
        resolve(__dirname, '../third_party'),
        { recursive: true }
      )
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  publicDir: false,
  build: {
    outDir: '../',
    emptyOutDir: false,
  },
  plugins: [vue(), copyThirdParty()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
