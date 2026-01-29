import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      // Proxy VnExpress RSS feeds to bypass CORS
      '/api/vnexpress': {
        target: 'https://vnexpress.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/vnexpress/, ''),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      },
      '/api/chemistryworld': {
        target: 'https://www.chemistryworld.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/chemistryworld/, ''),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      },
      '/api/sciencedaily': {
        target: 'https://www.sciencedaily.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/sciencedaily/, ''),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      },
      '/api/physorg': {
        target: 'https://phys.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/physorg/, ''),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      },
    },
  },
})
