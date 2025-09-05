/**
 * Platform-specific crypto implementations
 * 
 * This module provides crypto functionality that works across different platforms
 * including Node.js and React Native.
 */

import { isReactNative, isNode, isBrowser } from './index';
import { browserCrypto } from './browser';

// Type definition for a more flexible Buffer type that works across environments
export type BufferType = Buffer | Uint8Array | { toString(encoding?: string): string };

// Interface for crypto verification
export interface CryptoVerifier {
  update(data: string | BufferType): CryptoVerifier;
  verify(key: string | BufferType | object, signature: BufferType | string): boolean;
}

// Interface for crypto signing
export interface CryptoSigner {
  update(data: string | BufferType): CryptoSigner;
  sign(key: string | BufferType | any): BufferType;
}

/**
 * Get the appropriate crypto implementation based on the platform
 * @returns A promise resolving to the crypto implementation
 */
export async function getCrypto(): Promise<{
  verify: any;
  createSign: (algorithm: string) => CryptoSigner;
  createVerify: (algorithm: string) => CryptoVerifier;
}> {
  if (isNode) {
    try {
      // Use Node.js crypto module - use dynamic import with explicit path to avoid bundler issues
      // This prevents bundlers from trying to resolve 'node:crypto' in browser environments
      const nodeCrypto = await (async () => {
        try {
          // Use regular crypto import to avoid webpack issues with node: protocol
          return await import('crypto');
        } catch (e) {
          // If crypto import fails, we're likely in a browser environment
          throw new Error('Node.js crypto module not available');
        }
      })();
      
      return {
        verify: nodeCrypto.verify,
        createSign: nodeCrypto.createSign,
        createVerify: nodeCrypto.createVerify
      };
    } catch (error) {
      console.error('Failed to import Node.js crypto module:', error);
      // Fallback to browser implementation if Node.js crypto fails
      return await getBrowserCrypto();
    }
  } else if (isReactNative) {
    // Use React Native compatible crypto implementation
    try {
      // Import node-forge for crypto operations (already a dependency)
      // Import node-forge for other crypto operations (already a dependency)
      const forge = await import('node-forge');
      
      // Create a minimal implementation using js-sha3 and node-forge
      // which are more compatible with React Native
      return {
        verify: (_algorithm: string, data: Buffer, publicKey: any, signature: Buffer) => {
          try {
            // Use forge for verification
            const publicKeyObj = forge.pki.publicKeyFromPem(publicKey);
            const md = forge.md.sha256.create();
            md.update(data.toString('binary'));
            return publicKeyObj.verify(md.digest().bytes(), signature.toString('binary'));
          } catch (e) {
            console.error('Verification error:', e);
            return false;
          }
        },
        createSign: (_algorithm: string) => {
          // Data to be signed
          let data = Buffer.from('');
          
          return {
            update: (chunk: string | Buffer) => {
              const chunkBuffer = typeof chunk === 'string' ? Buffer.from(chunk) : chunk;
              data = Buffer.concat([data, chunkBuffer]);
              return this;
            },
            sign: (key: any) => {
              try {
                // Use forge for signing
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
        },
        createVerify: (_algorithm: string) => {
          // Data to be verified
          let data = Buffer.from('');
          
          return {
            update: (chunk: string | Buffer) => {
              const chunkBuffer = typeof chunk === 'string' ? Buffer.from(chunk) : chunk;
              data = Buffer.concat([data, chunkBuffer]);
              return this;
            },
            verify: (key: any, signature: Buffer | string) => {
              try {
                // Use forge for verification
                const publicKey = forge.pki.publicKeyFromPem(key);
                const md = forge.md.sha256.create();
                md.update(data.toString('binary'));
                const sig = typeof signature === 'string' ? Buffer.from(signature, 'base64') : signature;
                return publicKey.verify(md.digest().bytes(), sig.toString('binary'));
              } catch (e) {
                console.error('Verification error:', e);
                return false;
              }
            }
          };
        }
      };
    } catch (error) {
      console.error('Failed to create React Native compatible crypto implementation:', error);
      throw new Error('Crypto functionality not available in this React Native environment');
    }
  } else if (isBrowser) {
    return await getBrowserCrypto();
  } else {
    // Fallback for unknown environments
    console.warn('Unknown environment detected, using browser crypto implementation');
    return await getBrowserCrypto();
  }
}

/**
 * Get browser-compatible crypto implementation
 * @returns A promise resolving to the browser crypto implementation
 */
async function getBrowserCrypto() {
  try {
    // Use the pre-configured browser crypto implementation
    // This avoids dynamic imports which can cause issues with some bundlers
    return browserCrypto;
  } catch (error) {
    console.error('Failed to create browser compatible crypto implementation:', error);
    throw new Error('Crypto functionality not available in this browser environment');
  }
}

/**
 * Get the appropriate forge implementation based on the platform
 * @returns A promise resolving to the forge implementation
 */
export async function getForge() {
  try {
    // Use dynamic import for better compatibility with bundlers
    return await import('node-forge');
  } catch (error) {
    console.error('Failed to import node-forge:', error);
    throw new Error('Forge functionality not available');
  }
}
