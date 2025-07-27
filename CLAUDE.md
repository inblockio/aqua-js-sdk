# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Build and prepare:**
- `npm run build` - Build TypeScript to ESM/CJS using tsup
- `npm run prepare` - Runs build (pre-publish step)
- `npm run dev` - Compile TypeScript with tsc

**Testing:**
- `npm test` - Run Jest tests with ESM support
- `npm test -- ./tests/aquafier.test.ts` - Run specific test file
- `npm test -- ./tests/p12.test.ts` - Run P12 certificate tests

**Code quality:**
- `npm run lint` - ESLint for TypeScript files in src/
- `npm run format` - Format code with Prettier

## Architecture Overview

This is the **Aqua Protocol TypeScript SDK** for data accounting and notarization. The library provides:

### Core Concepts
- **AquaTree**: Main data structure for tracking file revisions and metadata
- **Revisions**: Immutable snapshots of data with cryptographic integrity
- **Witnesses**: Blockchain/timestamping services (Ethereum, Nostr, TSA)
- **Signatures**: Multiple signing methods (MetaMask, CLI wallet, DID)

### Multi-Platform Support
The SDK builds three entry points:
- `src/index.ts` → Node.js (default)
- `src/web.ts` → Browser/web apps
- `src/react-native.ts` → React Native with platform-specific polyfills

### API Options

**AquaV2 (Recommended - New Concise API):**
- **AquaV2**: Configuration-first approach with built-in file I/O
- **createAqua()**: Factory function for quick setup
- **Ultra-concise workflows**: Complete operations in 2-3 lines
- **File-path based**: No manual FileObject creation needed
- **Rust-compatible**: Designed for cross-language consistency

**Legacy APIs (Backward Compatible):**
- **Aquafier**: Original SDK class with all operations
- **AquafierChainable**: Fluent API for operation chaining

### Core Operations
Located in `src/core/`:
- `revision.ts` - Genesis/content revision creation
- `signature.ts` - Multi-method signing (MetaMask, CLI, DID)
- `witness.ts` - Blockchain witnessing
- `verify.ts` - Cryptographic verification
- `forms.ts` - Form-specific operations
- `link.ts` - Tree linking operations

### Testing Requirements
Tests require a `src/credentials.json` file with:
```json
{
    "mnemonic": "",
    "nostr_sk": "",
    "did_key": "",
    "alchemy_key": "",
    "witness_eth_network": "",
    "witness_method": ""
}
```

## API Usage Examples

### AquaV2 (Recommended New API)

**Ultra-Concise Workflow (2 lines):**
```typescript
const aqua = createAqua(creds, WitnessConfigs.ethereumSepolia, SignConfigs.cli);
await aqua.processFile("./document.txt", { sign: true, witness: true, save: "./document.aqua.json" });
```

**Step-by-Step Workflow:**
```typescript
import { createAqua, WitnessConfigs, SignConfigs } from "aquafier-js-sdk/aqua-v2";

const aqua = createAqua(credentials, WitnessConfigs.ethereumSepolia, SignConfigs.cli);
await aqua.notarizeFile("./document.txt");
await aqua.sign();
await aqua.witness();
await aqua.verify();
aqua.saveAquaFile("./document.aqua.json");
```

**Working with Existing Aqua Files:**
```typescript
const aqua = createAqua(credentials);
aqua.loadAquaFile("./existing.aqua.json");
await aqua.sign(SignConfigs.did);
await aqua.witness(WitnessConfigs.tsa);
aqua.saveAquaFile("./updated.aqua.json");
```

### Legacy API (Backward Compatible)

**Original Verbose Pattern:**
```typescript
import Aquafier, { AquafierChainable } from "aquafier-js-sdk";

const aqt = await new AquafierChainable(null).notarize(fileObject);
await aqt.sign("cli", credentials);
await aqt.witness("eth", "sepolia", "metamask", credentials);
const result = aqt.getValue();
```

## Build System
- Uses tsup for dual ESM/CJS output
- TypeScript with strict settings
- Jest with ESM support and 30s timeout
- Supports Node.js v20.9.0+