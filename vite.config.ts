import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  server: {
    host: true, // 允许内网 IP 访问
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined

          // React 核心和所有依赖 React 的 UI 库放在一起
          if (id.includes('react') || id.includes('react-dom') || id.includes('@radix-ui') || id.includes('lucide-react')) {
            return 'react'
          }
          if (id.includes('react-hook-form') || id.includes('@hookform/resolvers') || id.includes('zod')) {
            return 'forms'
          }
          if (id.includes('date-fns') || id.includes('react-day-picker')) {
            return 'dates'
          }

          return 'vendor'
        },
      },
    },
  },
})
