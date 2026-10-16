import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Bind to the IPv4 loopback explicitly: Node resolves `localhost` to ::1 first,
  // and connections to the IPv6 loopback are refused on this machine, so the
  // default `localhost` bind produced a dev server no browser could open.
  server: {
    host: '127.0.0.1',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/@xyflow')) return 'vendor-xyflow'
          if (id.includes('node_modules/gsap')) return 'vendor-gsap'
          if (id.includes('node_modules/react') || id.includes('node_modules/zustand')) return 'vendor-react'
        },
      },
    },
  },
})
