/**
 * Crypto Polyfill for React Native
 * 
 * This file provides the necessary crypto functionality that's required by WalletConnect
 * but is not available by default in React Native.
 */

// Import the required modules
import { getRandomBytes } from 'expo-crypto';
import 'react-native-get-random-values';
import React from 'react';

// Make sure global.crypto exists
if (typeof global.crypto === 'undefined') {
  global.crypto = {} as Crypto;
}

// Implement getRandomValues if it doesn't exist
if (typeof global.crypto.getRandomValues === 'undefined') {
  // Define the function with the correct signature
  const getRandomValuesFunc = function<T extends ArrayBufferView | null>(array: T): T {
    if (!array) {
      throw new Error('TypedArray is required');
    }
    
    const length = array.byteLength;
    const bytes = getRandomBytes(length);
    
    // Copy random bytes into the array
    const uint8Array = new Uint8Array(array.buffer, array.byteOffset, length);
    for (let i = 0; i < length; i++) {
      uint8Array[i] = bytes[i];
    }
    
    return array;
  };
  
  // Assign the function to global.crypto.getRandomValues
  Object.defineProperty(global.crypto, 'getRandomValues', {
    value: getRandomValuesFunc,
    configurable: true,
    enumerable: true,
    writable: true
  });
}

// Create a minimal crypto.subtle if it doesn't exist
if (typeof global.crypto.subtle === 'undefined') {
  // Create an empty object for subtle crypto
  const subtleCrypto = {} as SubtleCrypto;
  
  // Use Object.defineProperty to avoid read-only property error
  Object.defineProperty(global.crypto, 'subtle', {
    value: subtleCrypto,
    configurable: true,
    enumerable: true,
    writable: true
  });
}

// Export a function to check if our polyfill is working
export function checkCryptoPolyfill(): boolean {
  try {
    const array = new Uint8Array(10);
    global.crypto.getRandomValues(array);
    
    // Check if the array was filled with non-zero values
    return array.some(value => value !== 0);
  } catch (error) {
    console.error('Crypto polyfill check failed:', error);
    return false;
  }
}

// Create a React component that initializes the crypto polyfill
const CryptoPolyfill: React.FC = () => {
  React.useEffect(() => {
    // This effect runs once when the component mounts
    // The polyfill is already applied when the file is imported
    const polyfillWorking = checkCryptoPolyfill();
    if (polyfillWorking) {
      console.log('Crypto polyfill is working correctly');
    } else {
      console.warn('Crypto polyfill may not be working correctly');
    }
  }, []);

  // This component doesn't render anything
  return null;
};

// Export the component as default
export default CryptoPolyfill;
