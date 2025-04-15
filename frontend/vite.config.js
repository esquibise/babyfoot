/// <reference types="vitest" />
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // Configuration Vitest
  test: {
    globals: true, // Utiliser les API globales (describe, test, expect)
    environment: 'happy-dom', // Environnement de test type navigateur rapide
    deps: {
        inline: ["@vue"], // Nécessaire pour certains cas avec Vue 3
    },
    // Optionnel: Inclure les fichiers .vue pour le coverage
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,vue}'],
      exclude: ['src/main.js', 'src/router/index.js', '**/__tests__/**']
    }
  },
})
