# Witnessing API Reference

The Aqua Protocol SDK provides three distinct witnessing methods, each offering different trade-offs in terms of security, speed, and decentralization.

## Witness Types

### 1. Ethereum Witnessing

Uses Ethereum blockchain for secure, decentralized witnessing.

```typescript
// Using Chainable API
await aqua.witness(
  "eth",           // witnessType
  "sepolia",       // network
  "metamask",      // platform
  credentials      // credentials object
);

// Using Standard API
await aquafier.witnessAquaTree(
  tree,
  "eth",
  "sepolia",
  "metamask",
  credentials
);
```

**Features:**
- Browser and Node.js support
- MetaMask integration
- Automatic environment detection
- Chain ID validation
- Network switching
- Transaction monitoring

**Configuration:**
```typescript
const credentials = {
  alchemy_key: "your-alchemy-key",
  witness_eth_network: "sepolia",
  witness_method: "metamask"
};
```

### 2. Nostr Witnessing

Uses the Nostr protocol for lightweight, fast witnessing.

```typescript
// Using Chainable API
await aqua.witness(
  "nostr",         // witnessType
  "default",       // network (unused for Nostr)
  "api",           // platform
  credentials      // credentials object
);

// Using Standard API
await aquafier.witnessAquaTree(
  tree,
  "nostr",
  "default",
  "api",
  credentials
);
```

**Features:**
- Event creation and signing
- Relay communication (damus.io)
- Event verification
- Timestamp validation
- WebSocket handling

**Configuration:**
```typescript
const credentials = {
  nostr_sk: "your-nostr-secret-key"
};
```

### 3. Time Stamp Authority (TSA)

Uses RFC 3161 Time-Stamp Protocol for official timestamping.

```typescript
// Using Chainable API
await aqua.witness(
  "tsa",           // witnessType
  "default",       // network (unused for TSA)
  "api",           // platform
  credentials      // credentials object
);

// Using Standard API
await aquafier.witnessAquaTree(
  tree,
  "tsa",
  "default",
  "api",
  credentials
);
```

**Features:**
- RFC 3161 compliance
- ASN.1 encoding/decoding
- SHA-256 verification
- Timestamp extraction
- Base64 handling

## Batch Witnessing

For witnessing multiple trees at once:

```typescript
// Using Chainable API
const trees = [tree1, tree2, tree3].map(tree => 
  new AquafierChainable(tree)
    .witness("eth", "sepolia", "metamask", credentials)
);

// Using Standard API
const result = await aquafier.witnessMultipleAquaTrees(
  trees,
  "eth",
  "sepolia",
  "metamask",
  credentials
);
```

## Verification

After witnessing, you can verify the witness proofs:

```typescript
// Using Chainable API
const result = await aqua
  .witness("eth", "sepolia", "metamask", credentials)
  .verify();

// Using Standard API
const verified = await aquafier.verifyAquaTree(
  witnessedTree,
  [fileObject]
);
```

## Best Practices

1. **Choose the Right Method:**
   - Use Ethereum for highest security and decentralization
   - Use Nostr for fast, lightweight witnessing
   - Use TSA for official timestamp requirements

2. **Error Handling:**
```typescript
try {
  await aqua.witness("eth", "sepolia", "metamask", credentials);
} catch (error) {
  console.error("Witnessing failed:", error);
  const logs = aqua.getLogs();
  // Handle failure
}
```

3. **Monitor Transaction Status** (Ethereum):
```typescript
const result = await aqua
  .witness("eth", "sepolia", "metamask", credentials);

// Check logs for transaction status
const logs = result.getLogs();
const txStatus = logs.find(log => 
  log.type === "transaction_status"
);
```

4. **Verify After Witnessing:**
```typescript
const result = await aqua
  .witness("eth", "sepolia", "metamask", credentials)
  .verify();

if (result.getVerificationValue().isOk()) {
  console.log("Witness verified successfully");
}
```

5. **Network Selection** (Ethereum):
   - Use testnets (sepolia, goerli) for development
   - Use mainnet for production
   - Always check gas costs
   - Monitor network status

6. **Credential Security:**
   - Never expose private keys
   - Use environment variables
   - Rotate keys regularly
   - Monitor for unauthorized use

## Common Issues

1. **Ethereum Connection:**
   - Check MetaMask connection
   - Verify network selection
   - Ensure sufficient gas
   - Check Alchemy API key

2. **Nostr Relay:**
   - Check relay connection
   - Verify key format
   - Monitor event propagation
   - Handle timeout errors

3. **TSA Service:**
   - Verify service availability
   - Check response format
   - Validate timestamps
   - Handle encoding errors
