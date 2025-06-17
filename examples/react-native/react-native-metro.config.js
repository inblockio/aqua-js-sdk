/**
 * Metro configuration for React Native
 * This file should be copied to your React Native project as metro.config.js
 */

const { getDefaultConfig } = require('metro-config');
const path = require('path');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();

  return {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      sourceExts,
      assetExts,
      // Add additional Node.js modules to be provided by the React Native environment
      extraNodeModules: {
        // Provide empty implementations or polyfills for Node.js modules
        'stream': require.resolve('stream-browserify'),
        'crypto': require.resolve('crypto-browserify'),
        'http': require.resolve('stream-http'),
        'https': require.resolve('https-browserify'),
        'fs': require.resolve('react-native-fs'),
        'path': require.resolve('path-browserify'),
        'zlib': require.resolve('browserify-zlib'),
        'net': path.join(__dirname, 'polyfills/net-polyfill.js'),
        'tls': path.join(__dirname, 'polyfills/tls-polyfill.js'),
        'ws': path.join(__dirname, 'polyfills/ws-polyfill.js'),
      },
    },
  };
})();
