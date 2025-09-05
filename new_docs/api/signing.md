# Signing API Reference

The Aqua Protocol SDK provides three distinct signing methods to accommodate different use cases and environments.

## Signature Types

### 1. CLI Signing

Uses ethers.js HDNodeWallet for secure command-line signing.

```typescript
// Using Chainable API
await aqua.sign(
  "cli",           // signType
  credentials      // credentials object
);

// Using Standard API
await aquafier.signAquaTree(
  tree,
  "cli",
  credentials
);
```

**Features:**
- Direct signing process
- Suitable for automation
- Server-side signing
- HDNodeWallet integration

**Configuration:**
```typescript
const credentials = {
  mnemonic: "your-mnemonic-phrase"
};
```

### 2. DID Signing (Decentralized Identifier)

Uses key-did-provider-ed25519 for DID-based signing.

```typescript
// Using Chainable API
await aqua.sign(
  "did",           // signType
  credentials      // credentials object
);

// Using Standard API
await aquafier.signAquaTree(
  tree,
  "did",
  credentials
);
```

**Features:**
- Ed25519 signatures
- DID verification
- JWS handling
- key-did-resolver support

**Configuration:**
```typescript
const credentials = {
  did_key: "your-did-key"
};
```

### 3. MetaMask Signing

Provides browser and Node.js MetaMask integration.

```typescript
// Using Chainable API
await aqua.sign(
  "metamask",      // signType
  credentials      // credentials object
);

// Using Standard API
await aquafier.signAquaTree(
  tree,
  "metamask",
  credentials
);
```

**Features:**
- Browser integration
- Node.js support via local server
- Environment detection
- Public key recovery
- Signature verification

## Batch Signing

For signing multiple trees at once:

```typescript
// Using Chainable API
const trees = [tree1, tree2, tree3].map(tree => 
  new AquafierChainable(tree)
    .sign("metamask", credentials)
);

// Using Standard API
const result = await aquafier.signMultipleAquaTrees(
  trees,
  "metamask",
  credentials
);
```

## Message Format

All signing methods use a standardized message format:
```typescript
const message = `I sign this revision: ${hash}`;
```

## Signature Verification

You can verify signatures after signing:

```typescript
// Using Chainable API
const result = await aqua
  .sign("metamask", credentials)
  .verify();

// Using Standard API
const verified = await aquafier.verifyAquaTree(
  signedTree,
  [fileObject]
);

// Recover signer's address (MetaMask only)
const address = await recoverWalletAddress(signature, message);
```

## Best Practices

1. **Choose the Right Method:**
   - Use CLI for automation and scripts
   - Use MetaMask for interactive applications
   - Use DID for decentralized identity integration

2. **Error Handling:**
```typescript
try {
  await aqua.sign("metamask", credentials);
} catch (error) {
  console.error("Signing failed:", error);
  const logs = aqua.getLogs();
  // Handle failure
}
```

3. **MetaMask Environment:**
```typescript
// Browser
await aqua.sign("metamask", credentials);

// Node.js (starts local server)
await aqua.sign("metamask", {
  ...credentials,
  port: 8545,  // Optional server port
  host: "localhost"  // Optional server host
});
```

4. **Verify After Signing:**
```typescript
const result = await aqua
  .sign("metamask", credentials)
  .verify();

if (result.getVerificationValue().isOk()) {
  console.log("Signature verified successfully");
}
```

## Common Issues

1. **MetaMask Connection:**
   - Check wallet connection
   - Verify account access
   - Handle user rejections
   - Monitor connection state

2. **DID Signing:**
   - Validate DID format
   - Check key permissions
   - Handle resolver errors
   - Verify JWS format

3. **CLI Signing:**
   - Verify mnemonic format
   - Check wallet derivation
   - Handle key generation errors
   - Monitor signing process

## Security Considerations

1. **Private Key Management:**
   - Never expose private keys in code
   - Use secure key storage
   - Implement key rotation
   - Monitor for unauthorized use

2. **Signature Verification:**
   - Always verify signatures
   - Check signer addresses
   - Validate message format
   - Monitor for replay attacks

3. **Environment Security:**
   - Secure MetaMask connections
   - Protect mnemonic phrases
   - Secure DID keys
   - Monitor signing requests
