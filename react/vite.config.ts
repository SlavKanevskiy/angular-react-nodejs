import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': '{}'
  },
  build: {
    lib: {
      entry: 'src/main.tsx',
      name: 'ReactLocationsApp',
      fileName: 'react-app',
      formats: ['es']
    },
    rollupOptions: {
      input: 'src/main.tsx',
      output: {
        inlineDynamicImports: true
      }
    }
  },
  resolve: {
    alias: {
      '@shared': '../shared'
    }
  }
})
