import path from 'path';
import webpack from 'webpack';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'production',
  entry: {
    'aqua-js-sdk-react-native': './src/react-native.ts',
    'aqua-js-sdk-react-native.min': './src/react-native.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: {
      name: 'AquaSDK',
      type: 'umd'
    },
    globalObject: 'this',
    clean: false
  },
  resolve: {
    extensions: ['.ts', '.js', '.native.ts', '.native.js'],
    alias: {
      'node:crypto': 'crypto-browserify',
      'crypto': 'crypto-browserify'
    },
    fallback: {
      // Node.js polyfills for React Native
      "crypto": "crypto-browserify",
      "stream": "stream-browserify",
      "buffer": "buffer", 
      "process": "process/browser",
      "util": "util",
      "path": "path-browserify",
      "vm": "vm-browserify",
      "http": "stream-http",
      "https": "https-browserify",
      "url": "url",
      "zlib": "browserify-zlib",
      "events": "events",
      // React Native doesn't need these
      "fs": false,
      "os": false,
      "net": false,
      "tls": false,
      "child_process": false,
      // Keep React Native modules as externals
      "react-native-fs": false,
      "@react-native-async-storage/async-storage": false
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.react-native.json'
          }
        },
        exclude: /node_modules/
      },
    ]
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(
      /^crypto$/,
      'crypto-browserify'
    ),
    new webpack.NormalModuleReplacementPlugin(
      /^node:crypto$/,
      'crypto-browserify'
    ),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      '__DEV__': false,
      'global': 'globalThis'
    }),
  ],
  optimization: {
    minimize: true,
    sideEffects: false
  },
  target: ['web', 'es5'], // React Native compatibility
  // Remove externals to bundle crypto directly like web webpack
  // Bundle everything except React Native specific modules
  externals: {
    'react-native': 'react-native',
    'expo-crypto': 'expo-crypto',
    'react-native-fs': 'react-native-fs',
    '@react-native-async-storage/async-storage': '@react-native-async-storage/async-storage',
    'react-native-get-random-values': 'react-native-get-random-values',
    'react-native-url-polyfill': 'react-native-url-polyfill'
  }
};
