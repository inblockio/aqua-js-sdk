 // Environment detection

import { WitnessEnvironment } from "aqua-js-sdk";

  /**
 * Detects the current runtime environment
 * 
 * @returns WitnessEnvironment indicating 'browser' or 'node'
 * 
 * Checks for presence of window.ethereum to determine if running
 * in a browser environment with MetaMask available
 */
export const  detectEnvironment = (): WitnessEnvironment => {
    //@ts-ignore
    return typeof window !== 'undefined' && window.ethereum
      ? "browser"
      : 'node'
  };


  /**
 * Split a file path into directory path and filename components
 * @param filePath Full path to the file
 * @returns Object containing path and name
 */
export function splitFilePath(filePath: string): { path: string; name: string } {
  // Handle both forward and backslashes for cross-platform compatibility
  const normalizedPath = filePath.replace(/\\/g, '/');
  const lastSlashIndex = normalizedPath.lastIndexOf('/');
  
  if (lastSlashIndex === -1) {
    // No directory part, just a filename
    return {
      path: './',
      name: normalizedPath
    };
  }
  
  return {
    path: normalizedPath.substring(0, lastSlashIndex + 1), // Include trailing slash
    name: normalizedPath.substring(lastSlashIndex + 1)
  };
}