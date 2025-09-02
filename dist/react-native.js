/**
 * React Native entry point for aqua-js-sdk
 *
 * This file provides a React Native compatible version of the aqua-js-sdk library.
 * It exports all the same functionality as the main library but uses platform-specific
 * implementations that are compatible with React Native.
 */
// Import Node.js module shims
import { registerNodeModuleShims } from './platform/node-modules';
// Check if we're actually in React Native
const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';
// Check if we're in a browser or React environment
const isReactOrBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
if (!isReactNative && !isReactOrBrowser) {
    console.warn('You are importing from "aqua-js-sdk/react-native" but this does not appear to be a React Native or browser environment. ' +
        'This may cause unexpected behavior. Consider importing from "aqua-js-sdk" instead.');
}
// Register Node.js module shims for React Native and browser environments
if (isReactNative || isReactOrBrowser) {
    registerNodeModuleShims();
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
        global.process = {
            env: { NODE_ENV: 'production' },
            version: '',
            versions: { node: '16.0.0' },
            nextTick: (callback, ...args) => setTimeout(() => callback(...args), 0),
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
        try {
            // Try to load Buffer from the standard buffer package
            const bufferModule = require('buffer');
            global.Buffer = bufferModule.Buffer;
        }
        catch (e) {
            try {
                // Fallback to buffer/ if the standard import fails
                const bufferModule = require('buffer/');
                global.Buffer = bufferModule.Buffer;
            }
            catch (e2) {
                console.warn('Failed to load Buffer polyfill:', e2);
                // Provide a minimal Buffer-like implementation
                global.Buffer = class MinimalBuffer {
                    static from(data) { return data; }
                    static isBuffer() { return false; }
                };
            }
        }
    }
    // Polyfill for crypto
    if (!global.crypto) {
        // Don't use crypto-browserify directly as it's not compatible with Hermes
        // Instead, we'll use our platform-specific crypto implementation
        global.crypto = {};
    }
    // Polyfill for ws module
    global.WebSocket = global.WebSocket || {};
    // Node.js module shims are now handled by registerNodeModuleShims()
}
// Re-export everything from the main entry point
export * from './index';
// Default export
import Aquafier from './index';
export default Aquafier;
//# sourceMappingURL=react-native.js.map