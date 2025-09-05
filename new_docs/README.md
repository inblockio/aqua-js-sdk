# Aqua Protocol SDK Documentation

The Aqua Protocol SDK provides a powerful interface for file notarization, signing, and verification using blockchain and distributed technologies. This documentation will help you understand and use the SDK effectively.

## Table of Contents

- [Getting Started](./getting-started.md)
- [Core Concepts](./core-concepts.md)
- API Reference
  - [Aquafier API](./api/aquafier.md)
  - [Chainable API](./api/chainable.md)
  - [Signing](./api/signing.md)
  - [Witnessing](./api/witnessing.md)
  - [Verification](./api/verification.md)

## Quick Example

```typescript
import { AquafierChainable } from 'aqua-js-sdk';

// Create a new notarization
const aqua = new AquafierChainable(null)
  .notarize(fileObject)
  .sign("metamask", credentials)
  .witness("eth", "sepolia")
  .verify();

// Get results
const tree = aqua.getValue();
const logs = aqua.getLogs();
```

## Need Help?

- Check our [Troubleshooting Guide](./troubleshooting.md)
- Review [Common Use Cases](./use-cases.md)
- See [API Examples](./examples.md)
