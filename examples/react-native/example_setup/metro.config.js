const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration for React Native
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    // Add additional Node.js modules to be provided by the React Native environment
    extraNodeModules: {
      // Provide polyfills for Node.js modules
      'stream': require.resolve('stream-browserify'),
      'crypto': require.resolve('crypto-browserify'),
      'http': require.resolve('stream-http'),
      'https': require.resolve('https-browserify'),
      'path': require.resolve('path-browserify'),
      'zlib': require.resolve('browserify-zlib'),
      'fs': require.resolve('react-native-fs'),
      'net': path.join(__dirname, 'polyfills/net-polyfill.js'),
      'tls': path.join(__dirname, 'polyfills/tls-polyfill.js'),
      'ws': path.join(__dirname, 'polyfills/ws-polyfill.js'),
      // Handle buffer globally
      'buffer': require.resolve('buffer'),
    },
    // Ensure these file extensions are resolved
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json'],
  },
  // Add global polyfills
  serializer: {
    getPolyfills: () => [
      require.resolve('./polyfills/global-polyfills.js'),
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
