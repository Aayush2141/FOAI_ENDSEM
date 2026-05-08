import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      proxy: {
        // ── ISS proxy ──────────────────────────────────────────────────────
        // Dev: /api/iss?endpoint=position   → open-notify iss-now.json
        //      /api/iss?endpoint=astronauts → open-notify astros.json
        // Prod: handled by api/iss.js Vercel serverless function
        '/api/iss': {
          target: 'http://api.open-notify.org',
          changeOrigin: true,
          rewrite: (path) => {
            if (path.includes('endpoint=astronauts')) return '/astros.json';
            return '/iss-now.json'; // default: position
          },
        },
        // ── News proxy ─────────────────────────────────────────────────────
        // Dev: /api/news?category=… → gnews.io/api/v4/top-headlines
        //      /api/news?q=…        → gnews.io/api/v4/search
        // Prod: handled by api/news.js Vercel serverless function
        '/api/news': {
          target: 'https://gnews.io',
          changeOrigin: true,
          rewrite: (path) => {
            const url = new URL(path, 'https://gnews.io')
            const params = url.searchParams
            params.set('apikey', env.VITE_NEWS_API_KEY || '')
            params.set('lang', 'en')

            if (params.has('q')) {
              params.delete('category')
              return `/api/v4/search?${params.toString()}`
            }
            params.delete('q')
            return `/api/v4/top-headlines?${params.toString()}`
          },
        },
      },
    },
  }
})
