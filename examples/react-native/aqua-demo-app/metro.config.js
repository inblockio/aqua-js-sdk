// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add Node.js polyfills
config.resolver.extraNodeModules = {
  // Use the installed packages for these
  'stream': require.resolve('stream-browserify'),
  'crypto': require.resolve('crypto-browserify'),
  'buffer': require.resolve('buffer'),
  'https': require.resolve('https-browserify'),
  'path': require.resolve('path-browserify'),
  'http': require.resolve('stream-http'),
  'zlib': require.resolve('browserify-zlib'),
  'events': require.resolve('events'),
  // Use our custom polyfills for these
  'net': require.resolve('./polyfills/net-polyfill'),
  'tls': require.resolve('./polyfills/tls-polyfill'),
  'ws': require.resolve('./polyfills/ws-polyfill'),
  'stream': require.resolve('./polyfills/stream-polyfill'),
};

// Handle the @noble/hashes package specifically
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Fix for @noble/hashes/crypto.js issue
  if (moduleName === '@noble/hashes/crypto.js' || moduleName.includes('@noble/hashes/crypto')) {
    return {
      filePath: require.resolve('@noble/hashes/crypto'),
      type: 'sourceFile',
    };
  }
  
  // Let Metro handle other modules normally
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
