import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './test/setup.ts',
    css: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/src': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/styles': path.resolve(__dirname, './src/styles'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
    },
  },
});
