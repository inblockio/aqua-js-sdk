# React Native Setup Guide

The Aqua Protocol SDK now provides seamless React Native integration with automatic polyfill setup. No more manual polyfill configuration!

## Quick Start

### 1. Install the SDK

```bash
npm install aqua-js-sdk
```

### 2. Install Required React Native Dependencies

```bash
npm install react-native-get-random-values react-native-url-polyfill buffer
```

### 3. Install Optional Dependencies (Recommended)

```bash
# For enhanced crypto support
npm install expo-crypto

# For file system operations
npm install react-native-fs

# For storage operations
npm install @react-native-async-storage/async-storage
```

### 4. Import and Use

```typescript
// Import the React Native optimized version
import Aquafier from 'aqua-js-sdk/react-native';

// Use the SDK normally
const aquafier = new Aquafier();
```

## What's Included

The React Native build automatically includes:

- ✅ **Automatic polyfill setup** - No manual configuration needed
- ✅ **Crypto polyfills** - Uses expo-crypto when available, with fallbacks
- ✅ **Buffer polyfills** - Global Buffer support
- ✅ **Process polyfills** - Node.js process compatibility
- ✅ **Stream polyfills** - Node.js stream compatibility
- ✅ **URL polyfills** - Complete URL support
- ✅ **Random values** - Secure random number generation

## Migration from Manual Setup

If you're currently using manual polyfills, you can simplify your setup:

### Before (Manual Setup)
```javascript
// app-entry.js - OLD WAY
import EventEmitter from './polyfills/events-polyfill';
import './polyfills/stream-polyfill';
import './polyfills/net-polyfill';
import './polyfills/tls-polyfill';
import './polyfills/ws-polyfill';
import { Buffer } from 'buffer';
global.Buffer = Buffer;
// ... more manual setup

import 'expo-router/entry';
```

### After (Automatic Setup)
```javascript
// app-entry.js - NEW WAY
import 'react-native-gesture-handler';
import 'expo-router/entry';
```

```typescript
// In your app
import Aquafier from 'aqua-js-sdk/react-native';
const aquafier = new Aquafier();
```

## Metro Configuration

The SDK works with standard Metro configuration. If you need custom polyfills, you can still use them:

```javascript
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);

// Optional: Add custom polyfills if needed
config.resolver.extraNodeModules = {
  // Your custom polyfills here
};

module.exports = config;
```

## Webpack Integration

For advanced use cases, you can use the React Native webpack configuration:

```bash
npm run build:react-native
```

This creates optimized bundles specifically for React Native environments.

## Features Supported

All Aqua Protocol SDK features are supported in React Native:

- ✅ **Content Operations** - Create, verify, and manage content
- ✅ **Signature Methods** - CLI, DID, and MetaMask signing
- ✅ **Witness Methods** - Ethereum, Nostr, and TSA witnessing
- ✅ **Batch Operations** - Efficient bulk processing
- ✅ **File System** - Using react-native-fs when available
- ✅ **Storage** - Using AsyncStorage when available

## Troubleshooting

### Common Issues

1. **Buffer not defined**: Make sure you have `buffer` installed and imported
2. **Crypto errors**: Install `expo-crypto` for better crypto support
3. **Network errors**: Ensure `react-native-url-polyfill` is installed

### Debug Mode

Enable debug logging:

```typescript
import Aquafier from 'aqua-js-sdk/react-native';

// Enable debug mode
process.env.NODE_ENV = 'development';
const aquafier = new Aquafier();
```

## Examples

Check out the complete React Native demo app in `examples/react-native/aqua-demo-app/` for a full implementation example.
