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
import { Buffer } from 'buffer';
import process from 'process';

if (typeof window !== 'undefined') {
  // Make Buffer available globally
  (window as any).Buffer = Buffer;
  (globalThis as any).Buffer = Buffer;

  // Make process available globally
  (window as any).process = process;
  (globalThis as any).process = process;
}

// Import everything from the main entry point
import * as AquaSDK from './index';
import Aquafier from './index';

// Export everything as named exports
// export * from './index';

// For UMD compatibility, export the Aquafier class as the main export
// but also include all named exports as properties
Object.assign(AquaSDK, {
  // ...AquaSDKModule,
  Aquafier,
  // default: Aquafier
});

export default AquaSDK 

// Export everything as default export for UMD compatibility
// export default Aquafier;
