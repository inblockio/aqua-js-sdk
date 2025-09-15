import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'node24',
    lib: {
      entry: './index.ts',
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['fs', 'path', 'crypto', 'util', 'os', 'buffer'],
      output: {
        format: 'es',
        banner: `
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const __dirname = import.meta.dirname || import.meta.url.replace(/\\/[^\\/]*$/, '');
        `
      }
    },
    ssr: true
  },
  define: {
    global: 'globalThis',
    'process.env.NODE_ENV': '"production"'
  },
  optimizeDeps: {
    exclude: ['aqua-js-sdk']
  }
});