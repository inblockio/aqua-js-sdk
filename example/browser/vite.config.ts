import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      stream: 'stream-browserify',
      buffer: 'buffer',
      util: 'util',
      process: 'process/browser',
      events: 'events',
      assert: 'assert',
      http: 'stream-http',
      https: 'https-browserify',
      url: 'url',
      vm: 'vm-browserify',
      crypto: 'crypto-browserify',
      'node:crypto': 'crypto-browserify'
    }
  },
  define: {
    'process.env': {},
    global: 'globalThis'
  },
  optimizeDeps: {
    include: [
      'buffer',
      'process',
      'crypto-browserify',
      'stream-browserify',
      'events',
      'assert'
    ],
    exclude: ['fsevents'],
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      external: ['fsevents'],
      output: {
        manualChunks: undefined
      }
    }
  }
})

// three
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// // import { resolve } from 'path'

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       stream: 'stream-browserify',
//       buffer: 'buffer',
//       util: 'util',
//       process: 'process/browser',
//       events: 'events',
//       assert: 'assert',
//       http: 'stream-http',
//       https: 'https-browserify',
//       url: 'url',
//       vm: 'vm-browserify',
//       crypto: 'crypto-browserify'
//     }
//   },
//   define: {
//     'process.env': {},
//     global: 'globalThis'
//   },
//   optimizeDeps: {
//     include: [
//       'buffer',
//       'process',
//       'util',
//       'stream-browserify',
//       'events',
//       'assert',
//       'crypto-browserify'
//     ],
//     esbuildOptions: {
//       define: {
//         global: 'globalThis'
//       }
//     }
//   },
//   build: {
//     commonjsOptions: {
//       transformMixedEsModules: true
//     },
//     rollupOptions: {
//       external: ['fsevents']
//     }
//   }
// })

//two
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import { resolve } from 'path'

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       stream: 'stream-browserify',
//       buffer: 'buffer',
//       util: 'util',
//       process: 'process/browser',
//       events: 'events',
//       assert: 'assert',
//     }
//   },
//   define: {
//     'process.env': {},
//     global: {}
//   },
//   optimizeDeps: {
//     esbuildOptions: {
//       define: {
//         global: 'globalThis'
//       }
//     }
//   }
// })

//one
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   resolve: {
//     alias: {
//       process: 'process/browser',
//       stream: 'stream-browserify',
//       buffer: 'buffer'
//     }
//   },
//   define: {
//     global: {},
//     'process.env': {},
//   },
//   plugins: [react()],
// })