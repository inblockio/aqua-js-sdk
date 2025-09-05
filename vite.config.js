import { defineConfig } from 'vite'
import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'
import dts from 'vite-plugin-dts'

const isBrowserBuild = process.env.BUILD_TARGET === 'browser'

export default defineConfig(
  isBrowserBuild ? {
    // Browser build configuration (original working config)
    build: {
      lib: {
        entry: resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/web.ts'),
        name: 'AquaSDK',
        formats: ['umd'],
        fileName: () => 'aqua-js-sdk.min.js'
      },
      outDir: 'dist',
      emptyOutDir: false,
      rollupOptions: {
        external: [
          'ethers',
          // Make crypto external for browser builds (P12 signing not typically needed in browser)
          'crypto',
          'node:crypto',
          'crypto-browserify',
          // Make heavy optional dependencies external to reduce bundle size
          'node-forge',
          'pkijs', 
          'asn1js',
          'did-resolver',
          'dids',
          'key-did-provider-ed25519',
          'key-did-resolver',
          'nostr-tools',
          'openid-client',
          'ws'
        ],
        output: {
          globals: {
            'ethers': 'ethers',
            'node-forge': 'forge',
            'pkijs': 'pkijs',
            'asn1js': 'asn1js'
          },
          exports: 'named'
        }
      },
      minify: true
    },
    resolve: {
      alias: {
        // Crypto is external, no need for aliases
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
      global: 'globalThis',
      'process': 'process'
    },
    optimizeDeps: {
      include: [
        'buffer',
        'process/browser'
      ]
    }
  } : {
    // Node.js build configuration
    plugins: [
      dts({
        outDir: 'dist',
        include: ['src/**/*'],
        exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
        rollupTypes: true
      })
    ],
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
  }
)