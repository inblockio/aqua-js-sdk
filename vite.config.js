import { defineConfig } from 'vite'
import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/web.ts'),
      name: 'AquaSDK',
      formats: ['umd'],
      fileName: () => 'aqua-js-sdk.min.js'
    },
    outDir: 'dist',
    emptyOutDir: false, // Don't clean dist since tsup also uses it
    rollupOptions: {
      external: ['ethers'],
      output: {
        globals: {
          'ethers': 'ethers'
        },
        exports: 'named'
      }
    },
    minify: true
  },
  resolve: {
    alias: {
      'node:crypto': 'crypto-browserify',
      'crypto': 'crypto-browserify',
      'stream': 'stream-browserify',
      'buffer': 'buffer',
      'process': 'process/browser',
      'util': 'util',
      'path': 'path-browserify',
      'vm': 'vm-browserify',
      'http': 'stream-http',
      'https': 'https-browserify',
      'url': 'url'
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    global: 'globalThis'
  },
  optimizeDeps: {
    include: [
      'buffer',
      'process/browser'
    ]
  }
})