/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/soundsexpensive/', // This should match your GitHub repo name
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      }
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        mixanalyzer: resolve(__dirname, 'mix-analyzer.html'),
      },
      output: {
        // Split heavy vendor libraries into dedicated chunks to reduce main bundle size
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('recharts')) return 'vendor-recharts';
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('@supabase')) return 'vendor-supabase';
            if (id.includes('@clerk')) return 'vendor-clerk';
            return 'vendor';
          }
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  }
});
