/**
 * Platform-specific file system implementations
 * 
 * This module provides file system functionality that works across different platforms
 * including Node.js and React Native.
 */

import { isReactNative, isNode } from './index';

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
      // Use Node.js fs module
      const fs = await import('fs/promises');
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
      throw new Error('File system functionality not available');
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
  } else {
    // Browser environment - very limited functionality
    return {
      readFile: async (_path: string, _options?: { encoding?: string }) => {
        throw new Error('File system operations are not supported in browser environment');
      },
      writeFile: async (_path: string, _data: string | Buffer, _options?: { encoding?: string }) => {
        throw new Error('File system operations are not supported in browser environment');
      },
      exists: async (_path: string) => {
        return false;
      }
    };
  }
}
