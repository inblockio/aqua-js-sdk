declare module 'stream-browserify';

declare global {
    interface Window {
        Buffer: typeof Buffer;
        process: any;
        global: any;
        util: any;
    }

    var util: any;
    var stream: any;

    // Extend the globalThis interface
    interface GlobalThis {
        Buffer: typeof Buffer;
        process: any;
        util: any;
        stream: any;
    }
}

// declare global {
//     interface Window {
//       Buffer: typeof Buffer;
//       process: any;
//       global: any;
//     }
//   }

export { }