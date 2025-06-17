# React Native Setup Guide for aqua-js-sdk

This guide will help you set up your React Native project to work with the aqua-js-sdk library.

## Installation

1. Install the aqua-js-sdk package:

```bash
npm install aqua-js-sdk
```

2. Install required React Native dependencies:

```bash
npm install react-native-fs @react-native-async-storage/async-storage
```

3. Install polyfills for Node.js modules:

```bash
npm install buffer crypto-browserify stream-browserify stream-http https-browserify path-browserify browserify-zlib
```

## Metro Configuration

Create or modify your `metro.config.js` file in your React Native project root:

```javascript
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
```

## Create Polyfill Files

Create a `polyfills` directory in your project root and add the following files:

### `polyfills/ws-polyfill.js`

```javascript
/**
 * WebSocket polyfill for React Native
 */
const WebSocket = global.WebSocket;

class WebSocketServer {
  constructor() {
    console.warn('WebSocketServer is not supported in React Native');
  }
  
  on() { return this; }
  close() { return this; }
}

module.exports = {
  WebSocket,
  WebSocketServer
};
```

### `polyfills/net-polyfill.js`

```javascript
/**
 * Net module polyfill for React Native
 */
class Socket {
  constructor() {
    console.warn('Socket operations are not supported in React Native');
    this.destroyed = true;
  }
  
  on() { return this; }
  connect() { return this; }
  end() { return this; }
  destroy() { return this; }
}

class Server {
  constructor() {
    console.warn('Server operations are not supported in React Native');
  }
  
  listen() { return this; }
  on() { return this; }
  close() { return this; }
}

function createServer() {
  console.warn('Creating servers is not supported in React Native');
  return new Server();
}

function connect() {
  console.warn('Socket connections are not supported in React Native');
  return new Socket();
}

module.exports = {
  Socket,
  Server,
  createServer,
  connect,
  createConnection: connect
};
```

### `polyfills/tls-polyfill.js`

```javascript
/**
 * TLS module polyfill for React Native
 */
class TLSSocket {
  constructor() {
    console.warn('TLS operations are not supported in React Native');
    this.authorized = false;
    this.encrypted = false;
  }
  
  on() { return this; }
  connect() { return this; }
  end() { return this; }
  destroy() { return this; }
}

function connect() {
  console.warn('TLS connections are not supported in React Native');
  return new TLSSocket();
}

module.exports = {
  TLSSocket,
  connect,
  createServer: () => {
    console.warn('TLS servers are not supported in React Native');
    return {
      listen: () => {},
      on: () => {},
      close: () => {}
    };
  }
};
```

## Usage in React Native

In your React Native components, import the SDK from the React Native entry point:

```javascript
// Import from the React Native entry point
import Aquafier from 'aqua-js-sdk/react-native';
```

## Example Usage with File Picker

Here's how to use the aqua-js-sdk with a file picker in React Native:

```javascript
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import Aquafier from 'aqua-js-sdk/react-native';
import * as FileSystem from 'react-native-fs';

const FilePickerExample = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [aquaData, setAquaData] = useState(null);

  const openFilePicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: false,
        type: '*/*',
      });

      if (!result.canceled) {
        const file = result.assets && result.assets[0];
        if (file) {
          setSelectedFile(file);
          
          // Read file content
          let fileContent = '';
          try {
            fileContent = await FileSystem.readFile(file.uri.replace('file://', ''), 'utf8');
          } catch (error) {
            console.warn('Error reading file:', error);
            fileContent = `Binary file (${file.size} bytes)`;
          }
          
          // Create file object for Aquafier
          let fileObject = {
            fileContent: fileContent,
            fileName: file.name,
            path: file.uri,
            fileSize: file.size
          };
          
          // Process with Aquafier
          let aquafier = new Aquafier();
          let res = await aquafier.createGenesisRevision(fileObject);
          
          if (res.isErr()) {
            Alert.alert('Error', `Failed to generate Aqua JSON: ${JSON.stringify(res.data)}`);
          } else {
            setAquaData(JSON.stringify(res.data.aquaTree, null, 2));
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', `An error occurred: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={openFilePicker}>
        <Text style={styles.buttonText}>Select File</Text>
      </TouchableOpacity>
      
      {/* Display selected file info and Aqua data */}
    </View>
  );
};
```

## Troubleshooting

### Error: The package at "node_modules\ws\lib\stream.js" attempted to import the Node standard library module "stream"

This error occurs because React Native doesn't include Node.js standard library modules. To fix it:

1. Make sure you've set up the metro.config.js file correctly
2. Create all the polyfill files as shown above
3. Import from 'aqua-js-sdk/react-native' instead of 'aqua-js-sdk'
4. Restart your bundler with `--reset-cache` option:

```bash
npx react-native start --reset-cache
# or if using Expo
npx expo start --clear
```

### Error with @noble/hashes/crypto.js

These warnings are related to dependencies trying to access Node.js modules. They should be handled by the polyfills, but if you still encounter issues:

1. Add a resolver for @noble/hashes in your metro.config.js:

```javascript
resolver: {
  extraNodeModules: {
    // ... other modules
    '@noble/hashes/crypto': require.resolve('./polyfills/noble-hashes-crypto.js'),
  }
}
```

2. Create a polyfill file for noble-hashes:

```javascript
// polyfills/noble-hashes-crypto.js
module.exports = require('crypto-browserify');
```

## Known Limitations

- HTTP server functionality is not available in React Native
- Some cryptographic operations may be slower in React Native compared to Node.js
- File system operations have different behavior in React Native
- WebSocket server functionality is not supported
