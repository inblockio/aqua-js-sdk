/**
 * Platform-specific crypto implementations
 * 
 * This module provides crypto functionality that works across different platforms
 * including Node.js and React Native.
 */

import { isReactNative, isNode } from './index';

// Interface for crypto verification
export interface CryptoVerifier {
  update(data: string | Buffer): CryptoVerifier;
  verify(key: string | Buffer | object, signature: Buffer | string): boolean;
}

// Interface for crypto signing
export interface CryptoSigner {
  update(data: string | Buffer): CryptoSigner;
  sign(key: string | Buffer | any): Buffer;
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
      // Use Node.js crypto module
      const nodeCrypto = await import('crypto');
      return {
        verify: nodeCrypto.verify,
        createSign: nodeCrypto.createSign,
        createVerify: nodeCrypto.createVerify
      };
    } catch (error) {
      console.error('Failed to import Node.js crypto module:', error);
      throw new Error('Crypto functionality not available');
    }
  } else if (isReactNative) {
    // Use React Native compatible crypto implementation
    try {
      // Import node-forge for crypto operations (already a dependency)
      // Import node-forge for other crypto operations (already a dependency)
      const forge = require('node-forge');
      
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
  } else {
    // Browser environment
    try {
      // Use crypto-browserify for browser environments too
      const cryptoBrowserify = require('crypto-browserify');
      return {
        verify: cryptoBrowserify.verify,
        createSign: cryptoBrowserify.createSign,
        createVerify: cryptoBrowserify.createVerify
      };
    } catch (error) {
      console.error('Failed to import browser compatible crypto module:', error);
      throw new Error('Crypto functionality not available in this browser environment');
    }
  }
}

/**
 * Get the appropriate forge implementation based on the platform
 * @returns A promise resolving to the forge implementation
 */
export async function getForge() {
  try {
    // node-forge works in both Node.js and browser/React Native environments
    return require('node-forge');
  } catch (error) {
    console.error('Failed to import node-forge:', error);
    throw new Error('Forge functionality not available');
  }
}
