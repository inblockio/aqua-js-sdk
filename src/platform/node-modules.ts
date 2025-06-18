/**
 * Node.js modules compatibility layer for React environments
 * 
 * This module provides empty implementations of Node.js built-in modules
 * to prevent bundlers from trying to resolve them in browser/React environments.
 */

// Empty implementation for fs module
export const fs = {
  promises: {
    readFile: async () => '',
    writeFile: async () => {},
    mkdir: async () => {},
    readdir: async () => [],
    stat: async () => ({
      isFile: () => false,
      isDirectory: () => false
    }),
    access: async () => {}
  },
  readFileSync: () => '',
  writeFileSync: () => {},
  existsSync: () => false,
  mkdirSync: () => {},
  readdirSync: () => [],
  statSync: () => ({
    isFile: () => false,
    isDirectory: () => false
  })
};

// Empty implementation for path module
export const path = {
  join: (...args: string[]) => args.join('/'),
  resolve: (...args: string[]) => args.join('/'),
  dirname: (p: string) => p.split('/').slice(0, -1).join('/'),
  basename: (p: string) => p.split('/').pop() || '',
  extname: (p: string) => {
    const base = p.split('/').pop() || '';
    return base.includes('.') ? '.' + base.split('.').pop() : '';
  }
};

// Empty implementation for http module
export const http = {
  createServer: () => ({
    listen: () => {},
    close: () => {}
  })
};

// Empty implementation for https module
export const https = {
  request: () => ({
    on: () => {},
    end: () => {}
  })
};

// Empty implementation for crypto module
// Note: Real crypto functionality is provided by our platform-specific implementation
export const crypto = {
  createHash: () => ({
    update: () => ({
      digest: () => ''
    })
  }),
  randomBytes: () => Buffer.from([])
};

// Empty implementation for stream module
export const stream = {
  Readable: class {},
  Writable: class {},
  Duplex: class {},
  Transform: class {}
};

// Empty implementation for util module
export const util = {
  promisify: (fn: any) => fn,
  inspect: (obj: any) => JSON.stringify(obj)
};

// Empty implementation for zlib module
export const zlib = {
  gzip: (_: any, cb: (err: null, result: Buffer) => void) => cb(null, Buffer.from([])),
  gunzip: (_: any, cb: (err: null, result: Buffer) => void) => cb(null, Buffer.from([]))
};

// Export all modules as a single object for easy access
export const nodeModules = {
  fs,
  path,
  http,
  https,
  crypto,
  stream,
  util,
  zlib
};

// Helper function to register all Node.js module shims in the global scope
export function registerNodeModuleShims() {
  if (typeof global !== 'undefined') {
    Object.entries(nodeModules).forEach(([name, implementation]) => {
      try {
        if (!(global as any)[name]) {
          (global as any)[name] = implementation;
        }
      } catch (e) {
        // Ignore errors when trying to set properties
        console.error(`Failed to register Node.js module shim for ${name}:`, e);
      }
    });
  }
}
