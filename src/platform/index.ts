/**
 * Platform compatibility layer for aqua-js-sdk
 * 
 * This module provides platform-specific implementations for Node.js and React Native
 * to handle functionality that requires different implementations across platforms.
 */

// Detect the current platform
export const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';
export const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;
export const isBrowser = typeof window !== 'undefined' && !isReactNative;

// HTTP Server interface
export interface HttpServer {
  listen(port: number, host: string, callback?: () => void): void;
  close(): void;
}

// HTTP Request Listener type
export type RequestListener = (req: any, res: any) => void;

// HTTP implementation
export async function createHttpServer(requestListener: RequestListener): Promise<HttpServer | null> {
  if (isNode) {
    try {
      // Dynamic import for Node.js
      const { createServer } = await import('http');
      return createServer(requestListener);
    } catch (error) {
      console.error('Failed to create HTTP server:', error);
      return null;
    }
  } else if (isReactNative) {
    console.warn('HTTP server is not supported in React Native. Consider using a different approach.');
    // Return a mock implementation that does nothing but doesn't crash
    return {
      listen: (port: number, host: string, callback?: () => void) => {
        console.warn(`[Mock] HTTP server would listen on ${host}:${port}`);
        if (callback) callback();
      },
      close: () => {
        console.warn('[Mock] HTTP server would close');
      }
    };
  } else {
    console.warn('HTTP server is only supported in Node.js environment');
    return null;
  }
}

// Internet connection check
export async function checkInternetConnectivity(): Promise<boolean> {
  if (isBrowser || isReactNative) {
    // Browser/React Native implementation
    return new Promise<boolean>((resolve) => {
      // Navigator.onLine is a quick check but not always reliable
      const isOnline = typeof navigator !== 'undefined' && navigator.onLine;

      if (!isOnline) {
        // If navigator.onLine reports offline, we can be confident there's no connection
        resolve(false);
        return;
      }

      // If navigator.onLine reports online, perform a fetch to confirm
      fetch("https://www.google.com/favicon.ico", {
        mode: "no-cors",
        cache: "no-store",
      })
        .then(() => resolve(true))
        .catch(() => resolve(false));

      // Set a timeout in case the fetch hangs
      setTimeout(() => resolve(false), 5000);
    });
  } else if (isNode) {
    // Node.js implementation
    try {
      const { request } = await import('https');

      return new Promise<boolean>((resolve) => {
        const req = request(
          "https://www.google.com",
          { method: "HEAD", timeout: 5000 },
          (res: any) => {
            resolve(res.statusCode >= 200 && res.statusCode < 300);
            res.resume();
          },
        );

        req.on("error", () => resolve(false));
        req.on("timeout", () => {
          req.destroy();
          resolve(false);
        });

        req.end();
      });
    } catch (error) {
      return false;
    }
  }
  
  return false;
}

// Export file system and crypto compatibility layers
export { getFileSystem } from './fs';
export { getCrypto, getForge } from './crypto';
