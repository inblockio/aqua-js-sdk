# Core Concepts

## Aqua Tree Structure

The Aqua Protocol uses a specialized tree structure (AquaTree) to maintain the history and verification state of files. Each tree contains:
- File metadata
- Revision history
- Signatures
- Witness records
- Verification proofs

## Signature System

The SDK supports three distinct signing methods:

### 1. CLI Signing
- Uses ethers.js HDNodeWallet for secure message signing
- Ideal for automated or server-side operations
- Simple and direct signing process

### 2. DID Signing (Decentralized Identifier)
- Implements DID-based signing using key-did-provider-ed25519
- Supports Ed25519 signatures
- Verifiable through key-did-resolver
- Handles JSON Web Signatures (JWS)

### 3. MetaMask Signing
- Supports both browser and Node.js environments
- Browser: Direct MetaMask integration
- Node.js: Local server for MetaMask interaction
- Features automatic environment detection
- Includes public key recovery from signatures

## Witness System

The SDK implements three distinct witnessing methods:

### 1. Ethereum Witnessing
- Supports both browser and Node.js environments
- Uses MetaMask for transaction signing
- Features:
  - Automatic environment detection
  - Local server for Node.js MetaMask interaction
  - Chain ID validation
  - Network switching support
  - Transaction status monitoring

### 2. Nostr Witnessing
- Implements Nostr protocol-based witnessing
- Uses nostr-tools for protocol operations
- Features:
  - Event creation and signing
  - Relay communication (damus.io)
  - Event verification
  - Timestamp validation
  - Cross-platform WebSocket handling

### 3. Time Stamp Authority (TSA)
- Implements RFC 3161 Time-Stamp Protocol
- Uses DigiCert TSA service
- Features:
  - ASN.1 encoding/decoding
  - SHA-256 hash verification
  - Timestamp extraction and validation
  - Base64 response handling

## Common Features Across Systems

### Signing Features
- Standardized message format: "I sign this revision: [hash]"
- Comprehensive signature verification
- Return signatures with wallet/DID information
- Error handling and validation

### Witnessing Features
- Support for both witnessing and verification
- Consistent timestamp handling
- Environment-aware implementations
- Comprehensive error handling
- Synchronous and asynchronous operations

## Operation Flow

1. **File Preparation**
   - Hash calculation
   - Metadata collection
   - Content processing (optional)

2. **Tree Creation**
   - Genesis revision creation
   - File index management
   - Tree structure validation

3. **Signing Process**
   - Method selection (CLI/DID/MetaMask)
   - Signature generation
   - Public key recovery
   - Signature verification

4. **Witnessing Process**
   - Platform selection (Ethereum/Nostr/TSA)
   - Transaction/event creation
   - Proof generation
   - Status monitoring

5. **Verification**
   - Signature validation
   - Witness proof verification
   - Tree structure integrity check
   - Timestamp validation

## Best Practices

1. **Choose the Right Tools**
   - Use CLI signing for automation
   - Use MetaMask for interactive browser applications
   - Use DID for decentralized identity integration
   - Choose witnessing method based on security and speed requirements

2. **Error Handling**
   - Always check Result types for errors
   - Monitor witness transaction status
   - Validate signatures before witnessing
   - Keep track of operation logs

3. **Performance Optimization**
   - Enable scalar values when appropriate
   - Batch operations when possible
   - Use chainable API for cleaner code
   - Monitor gas costs for Ethereum operations

4. **Security Considerations**
   - Secure credential management
   - Validate file hashes
   - Verify signatures independently
   - Monitor witness network status
