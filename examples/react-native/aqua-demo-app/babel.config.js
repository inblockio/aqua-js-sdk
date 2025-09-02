module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Enable React Native Reanimated plugin
      'react-native-reanimated/plugin',
      // Add support for module resolver
      [
        'module-resolver',
        {
          alias: {
            // Polyfills for Node.js core modules
            'stream': './polyfills/stream-polyfill',
            'net': './polyfills/net-polyfill',
            'tls': './polyfills/tls-polyfill',
            'ws': './polyfills/ws-polyfill',
            'events': './polyfills/events-polyfill',
          },
        },
      ],
    ],
  };
};
