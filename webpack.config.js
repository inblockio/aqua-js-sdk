import path from 'path';
import webpack from 'webpack';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'production',
  entry: {
    'aqua-js-sdk': './src/web.ts',
    'aqua-js-sdk.min': './src/web.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: {
      name: 'AquaSDK',
      type: 'umd'
    },
    globalObject: 'this',
    clean: false // Don't clean dist since tsup also uses it
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      'node:crypto': 'crypto-browserify'
    },
    fallback: {
      // Node.js polyfills for browser
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
      "fs": false,
      "os": false,
      "net": false,
      "tls": false,
      "child_process": false,
      "react-native-fs": false,
      "@react-native-async-storage/async-storage": false
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],
  optimization: {
    minimize: true
  },
  // Remove externals to bundle ethers directly
  externals: {
    // Keep ethers as external since it's a peer dependency
    'ethers': {
      commonjs: 'ethers',
      commonjs2: 'ethers',
      amd: 'ethers',
      root: 'ethers'
    }
  }
};
