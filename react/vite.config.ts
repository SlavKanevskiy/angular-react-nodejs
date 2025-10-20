import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': '{}'
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'src/main.tsx',
      output: {
        entryFileNames: 'react-app.js',
        chunkFileNames: 'react-app.js',
        assetFileNames: 'react-app.[ext]'
      }
    }
  },
  resolve: {
    alias: {
      '@shared': '../shared'
    }
  }
})
