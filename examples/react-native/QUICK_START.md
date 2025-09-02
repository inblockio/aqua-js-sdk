# React Native Quick Start Guide

## Before vs After

### ❌ Old Way (Complex Setup)
```javascript
// app-entry.js - Required manual polyfills
import EventEmitter from './polyfills/events-polyfill';
import './polyfills/stream-polyfill';
import './polyfills/net-polyfill';
import './polyfills/tls-polyfill';
import './polyfills/ws-polyfill';
import { Buffer } from 'buffer';
global.Buffer = Buffer;
global.EventEmitter = EventEmitter;
// ... 20+ lines of manual setup

// metro.config.js - Complex configuration
config.resolver.extraNodeModules = {
  'stream': require.resolve('stream-browserify'),
  'crypto': require.resolve('crypto-browserify'),
  'buffer': require.resolve('buffer'),
  'https': require.resolve('https-browserify'),
  'path': require.resolve('path-browserify'),
  'http': require.resolve('stream-http'),
  'zlib': require.resolve('browserify-zlib'),
  'events': require.resolve('events'),
  'net': require.resolve('./polyfills/net-polyfill'),
  'tls': require.resolve('./polyfills/tls-polyfill'),
  'ws': require.resolve('./polyfills/ws-polyfill'),
  'stream': require.resolve('./polyfills/stream-polyfill'),
};

// package.json - Many manual polyfill dependencies
"browserify-zlib": "^0.2.0",
"buffer": "^6.0.3",
"crypto-browserify": "^3.12.1",
"events": "^3.3.0",
"https-browserify": "^1.0.0",
"path-browserify": "^1.0.1",
"process": "^0.11.10",
"stream-browserify": "^3.0.0",
"stream-http": "^3.2.0"
```

### ✅ New Way (Simple Setup)
```javascript
// app-entry.js - Minimal setup
import 'react-native-gesture-handler';
import 'expo-router/entry';

// metro.config.js - Default configuration
const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
module.exports = config;

// package.json - Only essential dependencies
"buffer": "^6.0.3",
"expo-crypto": "^14.1.5",
"react-native-fs": "^2.20.0",
"react-native-get-random-values": "^1.11.0",
"react-native-url-polyfill": "^2.0.0"

// Your app code - Just import and use!
import Aquafier from 'aqua-js-sdk/react-native';
const aquafier = new Aquafier();
```

## Installation

1. **Install the SDK:**
```bash
npm install aqua-js-sdk
```

2. **Install essential dependencies:**
```bash
npm install buffer react-native-get-random-values react-native-url-polyfill
```

3. **Install optional dependencies (recommended):**
```bash
npm install expo-crypto react-native-fs @react-native-async-storage/async-storage
```

## Usage

```typescript
import Aquafier from 'aqua-js-sdk/react-native';

// All polyfills are set up automatically!
const aquafier = new Aquafier();

// Use all SDK features normally
const fileObject = {
  fileContent: "Hello, Aqua!",
  fileName: "test.txt",
  path: "/test.txt",
  fileSize: 12
};

const result = await aquafier.createGenesisRevision(fileObject);
```

## What Changed

- 🚀 **90% less configuration** - No more manual polyfill setup
- 🛡️ **Automatic fallbacks** - Works even without optional dependencies  
- 🔧 **Simplified Metro config** - Use default Expo configuration
- 📦 **Fewer dependencies** - Only install what you need
- ⚡ **Better performance** - Optimized React Native bundle
- 🐛 **Better error handling** - Graceful degradation

## Migration Guide

1. **Remove old polyfills:**
   - Delete `polyfills/` directory
   - Remove manual polyfill imports from `app-entry.js`

2. **Simplify Metro config:**
   - Replace complex `extraNodeModules` with default config

3. **Update imports:**
   ```typescript
   // Old
   import Aquafier from 'aqua-js-sdk';
   
   // New  
   import Aquafier from 'aqua-js-sdk/react-native';
   ```

4. **Remove unnecessary dependencies:**
   - Remove browserify polyfills from package.json
   - Keep only essential React Native dependencies

That's it! Your app now uses the streamlined Aqua SDK setup.
