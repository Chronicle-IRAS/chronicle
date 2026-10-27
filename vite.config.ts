import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  // Relative asset URLs keep the build valid under a GitHub Pages project subpath
  // (https://<owner>.github.io/<repository>/) without hardcoding the repository name.
  base: './',
  plugins: [react(), tailwindcss()],
  server: { host: '127.0.0.1' },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'vendor-three'
          if (id.includes('node_modules/gsap')) return 'vendor-gsap'
          if (id.includes('node_modules/react') || id.includes('node_modules/zustand')) return 'vendor-react'
        },
      },
    },
  },
})
