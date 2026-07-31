import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  // Rutas relativas: el sitio se sirve bajo /<repo>/ en GitHub Pages, con
  // base absoluta ('/') los assets/datos no cargarían.
  base: './',
  // customElement: true compila los *.ce.vue con defineCustomElement (Shadow
  // DOM, estilos inyectados inline). Los .vue normales no se ven afectados.
  // Se usará a partir de la Fase 5 (empaquetado como Web Component).
  plugins: [vue({ customElement: true })],
})
