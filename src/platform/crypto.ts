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
    // Use React Native compatible crypto library (crypto-browserify)
    try {
      // We'll use the crypto-browserify package which is already a dependency
      const cryptoBrowserify = require('crypto-browserify');
      return {
        verify: cryptoBrowserify.verify,
        createSign: cryptoBrowserify.createSign,
        createVerify: cryptoBrowserify.createVerify
      };
    } catch (error) {
      console.error('Failed to import React Native compatible crypto module:', error);
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
