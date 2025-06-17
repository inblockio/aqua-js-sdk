/**
 * React Native entry point for aqua-js-sdk
 * 
 * This file provides a React Native compatible version of the aqua-js-sdk library.
 * It exports all the same functionality as the main library but uses platform-specific
 * implementations that are compatible with React Native.
 */

// Check if we're actually in React Native
const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';

if (!isReactNative) {
  console.warn(
    'You are importing from "aqua-js-sdk/react-native" but this does not appear to be a React Native environment. ' +
    'This may cause unexpected behavior. Consider importing from "aqua-js-sdk" instead.'
  );
}

// Set up global polyfills for Node.js modules that might be used by dependencies
if (typeof global !== 'undefined') {
  // Polyfill for stream
  if (!global.stream) {
    global.stream = {};
  }
  
  // Polyfill for process
  if (!global.process) {
    // Cast to any to avoid TypeScript errors with Process interface
    (global as any).process = {
      env: { NODE_ENV: 'production' },
      version: '',
      versions: { node: '16.0.0' },
      nextTick: (callback: Function, ...args: any[]) => setTimeout(() => callback(...args), 0),
      // Add minimal stdout/stderr implementations
      stdout: { write: console.log },
      stderr: { write: console.error },
      // Add empty argv array
      argv: [],
      // Add platform info
      platform: 'react-native'
    };
  }
  
  // Polyfill for Buffer if not already available
  if (typeof global.Buffer === 'undefined') {
    // Using buffer package which is already a dependency
    const { Buffer } = require('buffer/');
    global.Buffer = Buffer;
  }
  
  // Polyfill for crypto
  if (!global.crypto) {
    (global as any).crypto = require('crypto-browserify');
  }
  
  // Polyfill for ws module
  (global as any).WebSocket = global.WebSocket || {};
}

// Re-export everything from the main entry point
export * from './index';

// Default export
import Aquafier from './index';
export default Aquafier;
