import { Buffer } from 'buffer'
import process from 'process'
import util from 'util'
import stream from 'stream-browserify'

declare global {
    interface Global {
        stream: typeof stream;
    }
}

// Set up Buffer global
globalThis.Buffer = Buffer
window.Buffer = Buffer

// Set up process global
globalThis.process = process
window.process = process

// Set up other globals that might be needed
globalThis.util = util
globalThis.stream = stream

// Ensure global is defined
window.global = window

// import { Buffer } from 'buffer'
// import process from 'process'

// window.global = window
// window.Buffer = Buffer
// window.process = process


// Wrap SDK initialization
const initializeSDK = () => {
    // Make sure Buffer is available
    if (typeof window.Buffer === 'undefined') {
        window.Buffer = require('buffer').Buffer
    }

    // Your SDK initialization code here
    // ...
}

// Call initialization after a small delay to ensure polyfills are loaded
setTimeout(initializeSDK, 1)