# Getting Started with Aqua Protocol SDK

## Installation

```bash
npm install aqua-js-sdk
```

## Basic Concepts

The Aqua Protocol SDK provides a system for file notarization and verification using three main operations:

1. **Notarization**: Creating a genesis revision for your file
2. **Signing**: Adding cryptographic signatures using various methods
3. **Witnessing**: Recording the file state on different platforms
4. **Verification**: Validating the authenticity of files

## Quick Start

### Using the Chainable API (Recommended)

```typescript
import { AquafierChainable } from 'aqua-js-sdk';

// Prepare your file object
const fileObject = {
  name: "document.pdf",
  hash: "0x...", // File hash
  content: "..." // Optional file content
};

// Create credentials (example for MetaMask)
const credentials = {
  mnemonic: "",      // For CLI signing
  nostr_sk: "",      // For Nostr witnessing
  did_key: "",       // For DID signing
  alchemy_key: "",   // For Ethereum operations
  witness_eth_network: "sepolia",
  witness_method: "metamask"
};

// Create and process your file
const aqua = new AquafierChainable(null);
const result = await aqua
  .notarize(fileObject)
  .sign("metamask", credentials)
  .witness("eth", "sepolia", "metamask", credentials)
  .verify();

// Get results
const tree = result.getValue();
const logs = result.getLogs();
```

### Using the Standard API

```typescript
import { Aquafier } from 'aqua-js-sdk';

const aqua = new Aquafier();

// Create genesis revision
const genesis = await aqua.createGenesisRevision(fileObject);

// Sign the tree
const signed = await aqua.signAquaTree(genesis.data.aquaTree, "metamask", credentials);

// Witness the tree
const witnessed = await aqua.witnessAquaTree(
  signed.data.aquaTree,
  "eth",
  "sepolia",
  "metamask",
  credentials
);

// Verify the tree
const verified = await aqua.verifyAquaTree(witnessed.data.aquaTree, [fileObject]);
```

## Next Steps

- Read about [Core Concepts](./core-concepts.md) to understand the system better
- Check out [Common Use Cases](./use-cases.md) for practical examples
- Review the [API Reference](./api/aquafier.md) for detailed documentation
