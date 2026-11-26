import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'

// GitHub Pages serves the app from /itmatic/ (decision 19).
export default defineConfig({
  base: '/itmatic/',
  plugins: [
    vue(),
    ui({
      colorMode: false,
      ui: {
        colors: {
          primary: 'inkteal',
          neutral: 'slate',
        },
        // Onest is loaded at 400 and 600 only; controls and labels use 600 (DESIGN.md, label).
        button: { slots: { base: 'font-semibold' } },
        formField: { slots: { label: 'font-semibold' } },
        // One look for every table: header on mist, compact rows (DESIGN.md, Tables).
        table: { slots: { thead: 'bg-mist', th: 'py-2', td: 'py-2' } },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
