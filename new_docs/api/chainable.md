# Chainable API Reference

The `AquafierChainable` class provides a fluent interface for performing operations on Aqua Trees. It allows you to chain multiple operations while maintaining state and collecting logs.

## Quick Example

```typescript
const aqua = new AquafierChainable(tree)
  .notarize(file)
  .sign("metamask", credentials)
  .witness("eth", "sepolia")
  .verify();
```

## Constructor

### `new AquafierChainable(initialValue?: AquaTree | null)`

Creates a new chainable Aqua operation sequence.

```typescript
// Start with no tree
const aqua = new AquafierChainable(null);

// Start with existing tree
const aqua = new AquafierChainable(existingTree);
```

## Methods

### `notarize(fileObject: FileObject, options?: NotarizeOptions): Promise<this>`

Creates a genesis revision for file notarization.

```typescript
const fileObject = {
  name: "document.pdf",
  hash: "0x...",
  content: "..." // optional
};

const options = {
  isForm: false,
  enableContent: false,
  enableScalar: true
};

await aqua.notarize(fileObject, options);
```

### `sign(signType: SignType, credentials: CredentialsData, enableScalar?: boolean): Promise<this>`

Signs the current Aqua Tree state.

```typescript
const credentials = {
  mnemonic: "",      // For CLI signing
  nostr_sk: "",      // For Nostr
  did_key: "",       // For DID
  alchemy_key: "",   // For Ethereum
  witness_eth_network: "",
  witness_method: ""
};

await aqua.sign("metamask", credentials);
```

Supported sign types:
- `"cli"` - Command-line signing using HDNodeWallet
- `"metamask"` - Browser or Node.js MetaMask signing
- `"did"` - Decentralized Identifier signing

### `witness(witnessType: WitnessType, witnessNetwork: WitnessNetwork, witnessPlatform: WitnessPlatformType, credentials: CredentialsData, enableScalar?: boolean): Promise<this>`

Witnesses the current Aqua Tree state.

```typescript
await aqua.witness(
  "eth",           // witnessType
  "sepolia",       // witnessNetwork
  "metamask",      // witnessPlatform
  credentials,     // credentials object
  true            // enableScalar
);
```

Witness Types:
- `"eth"` - Ethereum blockchain witnessing
- `"nostr"` - Nostr protocol witnessing
- `"tsa"` - Time Stamp Authority witnessing

Networks (for Ethereum):
- `"mainnet"`
- `"sepolia"`
- `"goerli"`

Platforms:
- `"metamask"` - MetaMask wallet
- `"cli"` - Command-line interface
- `"api"` - Direct API calls

### `verify(linkedFileObject: Array<FileObject> = []): Promise<this>`

Verifies the current Aqua Tree state.

```typescript
await aqua.verify([fileObject]);
```

### Getters

#### `getValue(): AquaTree`
Gets the current Aqua Tree state.

#### `getVerificationValue(): Result<AquaOperationData, LogData[]>`
Gets the result of the last verification operation.

#### `getLogs(): LogData[]`
Gets all collected operation logs.

## Error Handling

The chainable API uses a Result type for error handling. You can check for errors in the logs:

```typescript
const aqua = new AquafierChainable(null);
await aqua.notarize(fileObject);

const logs = aqua.getLogs();
if (logs.length > 0) {
  console.log("Operation logs:", logs);
}

const verificationResult = aqua.getVerificationValue();
if (verificationResult.isErr()) {
  console.error("Verification failed:", verificationResult.data);
}
```

## Best Practices

1. Chain operations in logical order:
   ```typescript
   await aqua
     .notarize(file)     // First create genesis
     .sign(...)          // Then sign
     .witness(...)       // Then witness
     .verify();          // Finally verify
   ```

2. Handle errors appropriately:
   ```typescript
   try {
     await aqua
       .notarize(file)
       .sign(...);
   } catch (error) {
     console.error("Operation failed:", error);
     console.log("Logs:", aqua.getLogs());
   }
   ```

3. Use enableScalar when appropriate:
   ```typescript
   await aqua
     .notarize(file, { enableScalar: true })
     .sign("metamask", credentials, true)
     .witness("eth", "sepolia", "metamask", credentials, true);
   ```

4. Check verification results:
   ```typescript
   const result = await aqua
     .notarize(file)
     .verify();
   
   const verificationResult = result.getVerificationValue();
   if (verificationResult.isOk()) {
     console.log("Verification successful");
   }
   ```
