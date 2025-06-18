/**
 * Platform-specific file system implementations
 * 
 * This module provides file system functionality that works across different platforms
 * including Node.js and React Native.
 */

import { isReactNative, isNode, isBrowser } from './index';
import { fs as fsShim } from './node-modules';

/**
 * Interface for file system operations
 */
export interface FileSystem {
  readFile: (path: string, options?: { encoding?: string }) => Promise<string | Buffer>;
  writeFile: (path: string, data: string | Buffer, options?: { encoding?: string }) => Promise<void>;
  exists: (path: string) => Promise<boolean>;
}

/**
 * Get the appropriate file system implementation based on the platform
 * @returns A promise resolving to the file system implementation
 */
export async function getFileSystem(): Promise<FileSystem> {
  if (isNode) {
    try {
      // In Node.js environments, we can safely use require
      // This avoids issues with bundlers trying to resolve dynamic imports
      let fs: any;
      
      // Use a try-catch block to handle different Node.js versions and environments
      try {
        // For CommonJS environments
        fs = require('fs').promises;
      } catch (e) {
        console.warn('Failed to load fs module via require, trying alternative methods');
        // If require fails, we're likely in an ESM context
        // We'll use a Function constructor to avoid bundlers parsing the import
        // This is a bit of a hack, but it works well to avoid bundler issues
        try {
          const dynamicImport = new Function('modulePath', 'return import(modulePath)');
          fs = await dynamicImport('node:fs/promises');
        } catch (e2) {
          // Final fallback
          console.error('All attempts to load Node.js fs module failed:', e2);
          return getBrowserFileSystem();
        }
      }
      
      return {
        readFile: async (path: string, options?: { encoding?: string }) => {
          // Convert options to proper type for Node.js fs
          const fsOptions = options?.encoding ? { encoding: options.encoding as BufferEncoding } : undefined;
          return await fs.readFile(path, fsOptions);
        },
        writeFile: async (path: string, data: string | Buffer, options?: { encoding?: string }) => {
          // Convert options to proper type for Node.js fs
          const fsOptions = options?.encoding ? { encoding: options.encoding as BufferEncoding } : undefined;
          await fs.writeFile(path, data, fsOptions);
        },
        exists: async (path: string) => {
          try {
            await fs.access(path);
            return true;
          } catch {
            return false;
          }
        }
      };
    } catch (error) {
      console.error('Failed to import Node.js fs module:', error);
      // Fallback to browser implementation
      return getBrowserFileSystem();
    }
  } else if (isReactNative) {
    try {
      // Use React Native file system (react-native-fs)
      // Note: This requires the react-native-fs package to be installed
      // You would need to add this as a dependency for React Native projects
      try {
        const RNFS = require('react-native-fs');
        return {
          readFile: async (path: string, options?: { encoding?: string }) => {
            const encoding = options?.encoding || 'utf8';
            return await RNFS.readFile(path, encoding);
          },
          writeFile: async (path: string, data: string | Buffer, options?: { encoding?: string }) => {
            const encoding = options?.encoding || 'utf8';
            const stringData = typeof data === 'string' ? data : data.toString(encoding as BufferEncoding);
            await RNFS.writeFile(path, stringData, encoding);
          },
          exists: async (path: string) => {
            return await RNFS.exists(path);
          }
        };
      } catch (rnfsError) {
        // Fallback to AsyncStorage for simple key-value storage
        console.warn('react-native-fs not available, falling back to AsyncStorage for limited storage');
        const AsyncStorage = require('@react-native-async-storage/async-storage');
        return {
          readFile: async (path: string, _options?: { encoding?: string }) => {
            const data = await AsyncStorage.getItem(path);
            if (data === null) throw new Error(`File not found: ${path}`);
            return data;
          },
          writeFile: async (path: string, data: string | Buffer, _options?: { encoding?: string }) => {
            const stringData = typeof data === 'string' ? data : data.toString('utf8');
            await AsyncStorage.setItem(path, stringData);
          },
          exists: async (path: string) => {
            const data = await AsyncStorage.getItem(path);
            return data !== null;
          }
        };
      }
    } catch (error) {
      console.error('Failed to import React Native file system modules:', error);
      throw new Error('File system functionality not available in this React Native environment');
    }
  } else if (isBrowser) {
    return getBrowserFileSystem();
  } else {
    // Unknown environment - fallback to browser implementation
    console.warn('Unknown environment detected, using browser file system implementation');
    return getBrowserFileSystem();
  }
}

/**
 * Get a browser-compatible file system implementation
 * @returns A file system implementation for browser environments
 */
function getBrowserFileSystem(): FileSystem {
  // Use our shim implementation to avoid bundler issues
  return {
    readFile: async (path: string, _options?: { encoding?: string }) => {
      console.warn(`Browser environment: Cannot read file from ${path}`);
      if (typeof localStorage !== 'undefined') {
        // Try to use localStorage as a simple storage mechanism
        const data = localStorage.getItem(`fs:${path}`);
        if (data !== null) return data;
      }
      // Use our fs shim to avoid bundler errors
      return fsShim.promises.readFile();
    },
    writeFile: async (path: string, data: string | Buffer, _options?: { encoding?: string }) => {
      console.warn(`Browser environment: Cannot write file to ${path}`);
      if (typeof localStorage !== 'undefined') {
        // Try to use localStorage as a simple storage mechanism
        const stringData = typeof data === 'string' ? data : data.toString('utf8');
        try {
          localStorage.setItem(`fs:${path}`, stringData);
        } catch (e) {
          console.error('Failed to write to localStorage:', e);
        }
      }
      // Use our fs shim to avoid bundler errors
      return fsShim.promises.writeFile();
    },
    exists: async (path: string) => {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(`fs:${path}`) !== null;
      }
      return false;
    }
  };
}
