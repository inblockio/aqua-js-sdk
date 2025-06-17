/**
 * React Native entry point for aqua-js-sdk
 * 
 * This file provides a React Native compatible version of the aqua-js-sdk library.
 * It exports all the same functionality as the main library but uses platform-specific
 * implementations that are compatible with React Native.
 */

// Re-export everything from the main library except for Node.js specific modules
export * from './index';

// Set a flag to indicate we're in React Native mode
import { isReactNative } from './platform';

// Explicitly inform users if they try to use Node.js specific features
if (!isReactNative) {
  console.warn(
    'You are importing from react-native.ts but not running in a React Native environment. ' +
    'This may cause unexpected behavior.'
  );
}
