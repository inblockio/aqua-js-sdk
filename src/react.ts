/**
 * React-specific entry point for aqua-js-sdk
 * 
 * This file provides a React-compatible version of the aqua-js-sdk library.
 * It's specifically designed for React web applications (not React Native).
 */

// Import Node.js module shims
import { registerNodeModuleShims } from './platform/node-modules';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

if (!isBrowser) {
  console.warn(
    'You are importing from "aqua-js-sdk/react" but this does not appear to be a browser environment. ' +
    'This may cause unexpected behavior. Consider importing from "aqua-js-sdk" instead.'
  );
}

// Register Node.js module shims for browser environments
if (isBrowser) {
  registerNodeModuleShims();
  
  // Set up global polyfills for browser environments
  if (typeof window !== 'undefined') {
    // Polyfill for Buffer if not already available
    if (!(window as any).Buffer) {
      try {
        const bufferModule = require('buffer/');
        (window as any).Buffer = bufferModule.Buffer;
      } catch (e) {
        console.warn('Failed to load Buffer polyfill:', e);
      }
    }
  }
}

// Re-export everything from the main entry point
export * from './index';

// Default export
import Aquafier from './index';
export default Aquafier;
