declare module 'stream-browserify';

declare global {
    interface Window {
      Buffer: typeof Buffer;
      process: any;
      global: any;
    }
  }
  
  export {}