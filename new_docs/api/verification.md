# Verification API Reference

The Aqua Protocol SDK provides comprehensive verification capabilities for validating file authenticity, signatures, and witness proofs.

## Basic Verification

### Using Chainable API

```typescript
// Verify after any operation
const result = await aqua
  .notarize(file)
  .sign("metamask", credentials)
  .witness("eth", "sepolia", "metamask", credentials)
  .verify();

// Check verification result
if (result.getVerificationValue().isOk()) {
  console.log("Verification successful");
} else {
  console.error("Verification failed:", result.getLogs());
}
```

### Using Standard API

```typescript
const verified = await aquafier.verifyAquaTree(
  tree,
  [fileObject]
);

if (verified.isOk()) {
  console.log("Tree verified successfully");
} else {
  console.error("Verification failed:", verified.data);
}
```

## Verification Types

### 1. Tree Structure Verification

Verifies the integrity of the Aqua Tree structure:
- File index validation
- Hash chain verification
- Revision order checking

```typescript
const result = await aquafier.verifyAquaTree(tree, [fileObject]);
```

### 2. Revision Verification

Verifies specific revisions within the tree:

```typescript
const result = await aquafier.verifyAquaTreeRevision(
  tree,
  revision,
  revisionItemHash,
  [fileObject]
);
```

### 3. Graph Data Verification

Generates and verifies graph data for visualization:

```typescript
// Full tree verification with graph data
const graphData = await aquafier.verifyAndGetGraphData(
  tree,
  [fileObject]
);

// Single revision verification with graph data
const revisionGraph = await aquafier.verifyAndGetGraphDataRevision(
  tree,
  revision,
  revisionItemHash,
  [fileObject]
);
```

## Verification Components

The verification process checks multiple aspects:

1. **File Verification**
   - Hash validation
   - Content integrity
   - Metadata matching

2. **Signature Verification**
   - Signer authentication
   - Message format validation
   - Public key recovery

3. **Witness Verification**
   - Proof validation
   - Timestamp verification
   - Platform-specific checks:
     - Ethereum: Transaction verification
     - Nostr: Event verification
     - TSA: Timestamp validation

## Error Handling

```typescript
try {
  const result = await aqua.verify();
  
  if (result.getVerificationValue().isOk()) {
    const tree = result.getValue();
    console.log("Verification successful:", tree);
  } else {
    const logs = result.getLogs();
    console.error("Verification failed:", logs);
  }
} catch (error) {
  console.error("Verification error:", error);
}
```

## Graph Data Structure

The verification graph data provides a visual representation of the verification state:

```typescript
interface VerificationGraphData {
  nodes: {
    id: string;
    label: string;
    type: string;
    status: "verified" | "failed" | "pending";
  }[];
  edges: {
    from: string;
    to: string;
    label: string;
  }[];
}
```

## Best Practices

1. **Regular Verification**
```typescript
// Verify after each major operation
await aqua
  .notarize(file)
  .verify()  // After notarization
  .sign(...)
  .verify()  // After signing
  .witness(...)
  .verify(); // After witnessing
```

2. **Comprehensive Verification**
```typescript
// Include all relevant file objects
const allFiles = [mainFile, ...linkedFiles];
await aqua.verify(allFiles);
```

3. **Error Analysis**
```typescript
const result = await aqua.verify();
const logs = result.getLogs();

// Analyze verification failures
const failures = logs.filter(log => 
  log.type === "verification_failure"
);

// Check specific components
const signatureIssues = logs.filter(log => 
  log.component === "signature"
);
```

4. **Graph Data Usage**
```typescript
const graphData = await aquafier.verifyAndGetGraphData(
  tree,
  [fileObject]
);

// Analyze verification path
const failedNodes = graphData.nodes.filter(node => 
  node.status === "failed"
);
```

## Common Issues

1. **File Hash Mismatch**
   - Verify file content hasn't changed
   - Check hash calculation method
   - Validate file encoding

2. **Signature Verification Failure**
   - Check signer address
   - Verify message format
   - Validate signature data

3. **Witness Proof Issues**
   - Verify blockchain transaction
   - Check Nostr event existence
   - Validate TSA timestamp

4. **Tree Structure Issues**
   - Check revision order
   - Verify hash chain
   - Validate file indices

## Performance Considerations

1. **Batch Verification**
   - Group related verifications
   - Cache verification results
   - Reuse file objects

2. **Graph Data Optimization**
   - Request graph data only when needed
   - Cache graph representations
   - Limit verification depth

3. **Error Recovery**
   - Implement retry logic
   - Cache intermediate results
   - Log verification steps
