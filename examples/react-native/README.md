# Aqua JS SDK - React Native Example

This is a complete React Native example project demonstrating how to use the aqua-js-sdk library in a React Native application.

## Quick Start

### Prerequisites

- Node.js >= 16
- React Native development environment set up
- Android Studio (for Android development)


### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up iOS (macOS only):**
   ```bash
   npm run pod-install
   ```

3. **Complete setup (recommended):**
   ```bash
   npm run setup
   ```

### Running the App

**Start Metro bundler:**
```bash
npm start
```

**Run on Android:**
```bash
npm run android
```

**Run on iOS (macOS only):**
```bash
npm run ios
```

**Reset cache if needed:**
```bash
npm run start:reset
```

## Project Structure

```
react-native/
├── package.json              # Dependencies and run scripts
├── metro.config.js           # Metro bundler configuration
├── ReactNativeExample.tsx    # Main example component
├── polyfills/               # Node.js polyfills for React Native
│   ├── net-polyfill.js
│   ├── tls-polyfill.js
│   └── ws-polyfill.js
└── README.md               # This file
```

## Dependencies

### Core Dependencies
- `aqua-js-sdk` - The main Aqua Protocol SDK
- `@react-native-async-storage/async-storage` - Storage for React Native
- `react-native-fs` - File system access
- `expo-document-picker` - File picker component

### Polyfills (for Node.js compatibility)
- `buffer` - Buffer polyfill
- `crypto-browserify` - Crypto polyfill
- `stream-browserify` - Stream polyfill
- `stream-http` - HTTP polyfill
- `https-browserify` - HTTPS polyfill
- `path-browserify` - Path polyfill
- `browserify-zlib` - Zlib polyfill

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start Metro bundler |
| `npm run start:reset` | Start Metro with cache reset |
| `npm run android` | Run on Android device/emulator |
| `npm run ios` | Run on iOS device/simulator |
| `npm run test` | Run tests |
| `npm run lint` | Run ESLint |
| `npm run build:android` | Build Android APK |
| `npm run build:ios` | Build iOS archive |
| `npm run clean` | Clean project |
| `npm run pod-install` | Install iOS CocoaPods |
| `npm run setup` | Complete project setup |

## Usage

The example demonstrates:

1. **File Selection** - Using expo-document-picker to select files
2. **Aqua Tree Creation** - Creating genesis revisions with selected files
3. **Error Handling** - Proper error handling for React Native environment
4. **UI Integration** - React Native UI components with Aqua SDK

```typescript
import Aquafier, { FileObject } from 'aqua-js-sdk/react-native';

const aquafier = new Aquafier();
const result = await aquafier.createGenesisRevision(fileObject);
```

## Troubleshooting

### Common Issues

**Metro bundler errors:**
```bash
npm run start:reset
```

**iOS build issues:**
```bash
npm run pod-install
cd ios && xcodebuild clean
```

**Android build issues:**
```bash
cd android && ./gradlew clean
```

**Node.js module errors:**
- Ensure metro.config.js is properly configured
- Check that all polyfill files exist
- Verify you're importing from 'aqua-js-sdk/react-native'

### Environment Setup

For detailed React Native environment setup, see:
- [React Native CLI Quickstart](https://reactnative.dev/docs/environment-setup)
- [REACT_NATIVE_SETUP.md](./REACT_NATIVE_SETUP.md) for aqua-js-sdk specific setup

## Development

To modify this example:

1. Edit `ReactNativeExample.tsx` for UI changes
2. Update `metro.config.js` for bundler configuration
3. Add new polyfills in `polyfills/` directory as needed
4. Update dependencies in `package.json`

## Support

For issues specific to:
- **Aqua JS SDK**: Check the main repository issues
- **React Native**: Check React Native documentation
- **This example**: Create an issue in the aqua-js-sdk repository
