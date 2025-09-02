/**
 * React Native entry point for aqua-js-sdk
 * 
 * This file provides a React Native compatible version of the aqua-js-sdk library.
 * It automatically sets up all necessary polyfills and platform-specific implementations.
 * 
 * Zero configuration required - just import and use!
 */

// Import crypto polyfill directly to bundle it
import 'crypto-browserify';

// Essential polyfills - wrapped in try/catch for graceful fallbacks
try {
  require('react-native-get-random-values');
} catch (e) {
  console.warn('react-native-get-random-values not available, using fallback');
}

// Set up global Buffer with proper error handling
if (typeof global !== 'undefined' && typeof global.Buffer === 'undefined') {
  try {
    const { Buffer } = require('buffer');
    global.Buffer = Buffer;
  } catch (e) {
    console.warn('Buffer polyfill failed, providing minimal implementation');
    global.Buffer = class MinimalBuffer {
      static from(data: any): any { return data; }
      static isBuffer(_obj: any): boolean { return false; }
      static alloc(size: number): any { return new Uint8Array(size); }
    } as any;
  }
}

// Set up global process with comprehensive implementation
if (typeof global !== 'undefined' && typeof global.process === 'undefined') {
  global.process = {
    env: { NODE_ENV: process?.env?.NODE_ENV || 'production' },
    version: '16.0.0',
    versions: { node: '16.0.0' },
    nextTick: (callback: Function, ...args: any[]) => {
      setTimeout(() => {
        try {
          callback(...args);
        } catch (error) {
          console.error('Process.nextTick callback error:', error);
        }
      }, 0);
    },
    stdout: { 
      write: (data: any) => console.log(data),
      on: () => {},
      once: () => {},
      emit: () => {}
    },
    stderr: { 
      write: (data: any) => console.error(data),
      on: () => {},
      once: () => {},
      emit: () => {}
    },
    argv: [],
    platform: 'react-native',
    browser: true,
    cwd: () => '/',
    chdir: () => {},
    exit: () => {},
    kill: () => {},
    pid: 1,
    ppid: 0,
    title: 'react-native',
    arch: 'arm64',
    uptime: () => Date.now() / 1000,
    hrtime: () => [Math.floor(Date.now() / 1000), (Date.now() % 1000) * 1000000],
    memoryUsage: () => ({ rss: 0, heapTotal: 0, heapUsed: 0, external: 0 })
  } as any;
}

// Set up crypto polyfill with comprehensive fallbacks
if (typeof global !== 'undefined' && typeof global.crypto === 'undefined') {
  let cryptoImpl: any = {};
  
  try {
    // Try expo-crypto first
    const expoCrypto = require('expo-crypto');
    cryptoImpl = {
      getRandomValues: (array: any) => {
        try {
          const randomBytes = expoCrypto.getRandomBytes(array.length);
          for (let i = 0; i < array.length; i++) {
            array[i] = randomBytes[i];
          }
          return array;
        } catch (e) {
          // Fallback to Math.random
          for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
          }
          return array;
        }
      },
      randomUUID: () => {
        try {
          return expoCrypto.randomUUID();
        } catch (e) {
          // Simple UUID v4 fallback
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
        }
      },
      subtle: {
        digest: async (_algorithm: string, data: any) => {
          try {
            return await expoCrypto.digest(expoCrypto.CryptoDigestAlgorithm.SHA256, data);
          } catch (e) {
            throw new Error('Crypto.subtle.digest not available');
          }
        }
      }
    };
  } catch (e) {
    // Fallback crypto implementation
    cryptoImpl = {
      getRandomValues: (array: any) => {
        for (let i = 0; i < array.length; i++) {
          array[i] = Math.floor(Math.random() * 256);
        }
        return array;
      },
      randomUUID: () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      },
      subtle: {
        digest: async () => {
          throw new Error('Crypto.subtle.digest not available in fallback mode');
        }
      }
    };
  }
  
  global.crypto = cryptoImpl;
}

// Import and register Node.js module shims
try {
  const { registerNodeModuleShims } = require('./platform/node-modules');
  registerNodeModuleShims();
} catch (e) {
  console.warn('Failed to register Node.js module shims:', e);
}

// Re-export everything from the main entry point
export * from './index';

// Default export
export { default } from './index';
