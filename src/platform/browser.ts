/**
 * Browser-specific implementations for aqua-js-sdk
 * 
 * This module provides browser and React environment compatible implementations
 * to avoid Node.js module resolution issues.
 */

import * as forge from 'node-forge';
import { CryptoSigner, CryptoVerifier, BufferType } from './crypto';

// Handle Buffer in a way that works in both Node.js and browser environments
let BufferPolyfill: typeof global.Buffer;

try {
  // In Node.js, use the built-in Buffer
  if (typeof global !== 'undefined' && global.Buffer) {
    BufferPolyfill = global.Buffer;
  } else if (typeof window !== 'undefined' && (window as any).Buffer) {
    // In browser, use window.Buffer if available
    BufferPolyfill = (window as any).Buffer;
  } else {
    // As a last resort, try to import the buffer package
    const bufferModule = require('buffer');
    BufferPolyfill = bufferModule.Buffer;
  }
} catch (e) {
  console.warn('Buffer not available, using fallback implementation');
  // Provide a minimal Buffer-like implementation as fallback
  BufferPolyfill = class MinimalBuffer {
    static from(data: any): any {
      return data;
    }
    static isBuffer(): boolean {
      return false;
    }
  } as any;
}

// Export our Buffer implementation
export const Buffer = BufferPolyfill;

/**
 * Browser-compatible crypto implementation using node-forge
 */
export const browserCrypto = {
  // Minimal implementation of crypto.verify
  verify: (_algorithm: string, data: Buffer, publicKey: any, signature: Buffer) => {
    try {
      const publicKeyObj = forge.pki.publicKeyFromPem(publicKey);
      const md = forge.md.sha256.create();
      md.update(data.toString('binary'));
      return publicKeyObj.verify(md.digest().bytes(), signature.toString('binary'));
    } catch (e) {
      console.error('Verification error:', e);
      return false;
    }
  },

  // Minimal implementation of crypto.createSign
  createSign: (_algorithm: string): CryptoSigner => {
    let data = Buffer.from('');
    
    const signer: CryptoSigner = {
      update: function(chunk: string | BufferType): CryptoSigner {
        const chunkBuffer = typeof chunk === 'string' ? Buffer.from(chunk) : 
          (chunk instanceof Buffer ? chunk : Buffer.from(chunk.toString(), 'binary'));
        data = Buffer.concat([data, chunkBuffer]);
        return signer;
      },
      sign: function(key: any): BufferType {
        try {
          const privateKey = forge.pki.privateKeyFromPem(key);
          const md = forge.md.sha256.create();
          md.update(data.toString('binary'));
          const signature = privateKey.sign(md);
          return Buffer.from(signature, 'binary');
        } catch (e) {
          console.error('Signing error:', e);
          throw new Error('Failed to sign data');
        }
      }
    };
    return signer;
  },

  // Minimal implementation of crypto.createVerify
  createVerify: (_algorithm: string): CryptoVerifier => {
    let data = Buffer.from('');
    
    const verifier: CryptoVerifier = {
      update: function(chunk: string | BufferType): CryptoVerifier {
        const chunkBuffer = typeof chunk === 'string' ? Buffer.from(chunk) : 
          (chunk instanceof Buffer ? chunk : Buffer.from(chunk.toString(), 'binary'));
        data = Buffer.concat([data, chunkBuffer]);
        return verifier;
      },
      verify: function(key: any, signature: BufferType | string): boolean {
        try {
          const publicKey = forge.pki.publicKeyFromPem(key);
          const md = forge.md.sha256.create();
          md.update(data.toString('binary'));
          const sig = typeof signature === 'string' ? Buffer.from(signature, 'base64') : 
            (signature instanceof Buffer ? signature : Buffer.from(signature.toString(), 'binary'));
          return publicKey.verify(md.digest().bytes(), sig.toString('binary'));
        } catch (e) {
          console.error('Verification error:', e);
          return false;
        }
      }
    };
    return verifier;
  }
};

/**
 * Empty implementation for Node.js modules that might be imported in browser environments
 * This helps prevent bundlers from trying to resolve these modules
 */
export const emptyNodeModules = {
  fs: {},
  path: {},
  http: {},
  https: {},
  crypto: browserCrypto,
  stream: {},
  util: {},
  zlib: {},
  // Add more as needed
};
