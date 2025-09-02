/**
 * Web-specific entry point for aqua-js-sdk
 * 
 * This file provides a web-compatible version of the aqua-js-sdk library.
 * It's specifically designed for web applications (React, Vue, Angular, etc.).
 */

// IMPORTANT: Register Node.js module shims immediately before any other imports
// to prevent bundlers from trying to resolve Node.js modules
import { registerNodeModuleShims } from './platform/node-modules';
registerNodeModuleShims();

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

if (!isBrowser) {
  console.warn(
    'You are importing from "aqua-js-sdk/web" but this does not appear to be a browser environment. ' +
    'This may cause unexpected behavior. Consider importing from "aqua-js-sdk" instead.'
  );
}

// Set up global polyfills for browser environments
if (typeof window !== 'undefined') {
  // Polyfill for Buffer if not already available
  if (!(window as any).Buffer) {
    try {
      // Try to load Buffer from the standard buffer package
      const bufferModule = require('buffer');
      (window as any).Buffer = bufferModule.Buffer;
    } catch (e) {
      try {
        // Fallback to buffer/ if the standard import fails
        const bufferModule = require('buffer/');
        (window as any).Buffer = bufferModule.Buffer;
      } catch (e2) {
        console.warn('Failed to load Buffer polyfill:', e2);
        // Provide a minimal Buffer-like implementation
        (window as any).Buffer = class MinimalBuffer {
          static from(data: any): any { return data; }
          static isBuffer(): boolean { return false; }
        };
      }
    }
  }
}

// Re-export everything from the main entry point
export * from './index';

// Import and re-export Aquafier as both named and default export
import Aquafier from './index';
export { Aquafier };
export default Aquafier;
