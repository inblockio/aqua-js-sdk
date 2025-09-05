import { defineConfig } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  build: {
    target: 'node20',
    lib: {
      entry: {
        index: resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/index.ts'),
        web: resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/web.ts'),
        'react-native': resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/react-native.ts')
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        const ext = format === 'es' ? 'js' : 'cjs'
        return `${entryName}.${ext}`
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: [
        // Node.js built-ins
        'fs', 'path', 'crypto', 'util', 'os', 'buffer', 'stream', 'events',
        'url', 'querystring', 'http', 'https', 'zlib', 'net', 'tls', 'module',
        // Optional dependencies that should remain external
        'node-forge', 'pkijs', 'asn1js', 'did-resolver', 'dids', 
        'key-did-provider-ed25519', 'key-did-resolver', 'nostr-tools',
        'openid-client', 'ws',
        // Peer dependencies
        'ethers'
      ],
      output: {
        exports: 'named',
        interop: 'compat'
      }
    },
    minify: false,
    sourcemap: true
  },
  esbuild: {
    target: 'node20'
  }
})