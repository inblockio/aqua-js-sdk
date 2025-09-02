// Crypto shim for React Native
import 'react-native-get-random-values';
import { Buffer } from 'buffer';

// Make Buffer available globally
if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}

// Crypto polyfill
if (typeof global.crypto === 'undefined') {
  global.crypto = {
    getRandomValues: require('react-native-get-random-values')
  };
}

// Shim for node:crypto
if (typeof global.process === 'undefined') {
  global.process = require('process');
}
