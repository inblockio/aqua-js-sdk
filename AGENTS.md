# aqua-js-sdk

TypeScript SDK for the Aqua Protocol, a data accounting system that creates verifiable revision chains (called "Aqua Trees") for files and forms.

## Quick Start

```typescript
import Aquafier from "aqua-js-sdk";

const aquafier = new Aquafier();

// 1. Create a genesis revision (notarize a file)
const file: FileObject = { fileName: "doc.txt", fileContent: "hello", path: "/path/doc.txt" };
const result = await aquafier.createGenesisRevision(file);

// 2. Sign the tree
const signed = await aquafier.signAquaTree(treeWrapper, "cli", credentials);

// 3. Witness on-chain
const witnessed = await aquafier.witnessAquaTree(treeWrapper, "eth", "sepolia", "cli", credentials);

// 4. Verify integrity
const verified = await aquafier.verifyAquaTree(aquaTree, [file]);
```

## Architecture

```
src/
  index.ts          - Aquafier class (main API) + AquafierChainable (fluent API)
  types.ts          - All type definitions
  type_guards.ts    - Result<T,E> monad (Ok/Err)
  utils.ts          - Hashing, Merkle trees, timestamps, nonce
  aquavhtree.ts     - Tree rendering/logging
  core/
    content.ts      - Content revision creation
    forms.ts        - Form revision creation + selective disclosure (hide/unhide)
    revision.ts     - Genesis revision, revision queries, file index
    signature.ts    - Sign revisions (MetaMask, CLI/ethers, DID, PKCS12, inline)
    verify.ts       - Verification of trees and individual revisions
    witness.ts      - Witness revisions (Ethereum, TSA, Nostr)
    link.ts         - Link trees together (cross-references)
    formatter.ts    - Output formatting
  signature/        - Signing backend implementations
  witness/          - Witness backend implementations
  platform/         - Platform abstraction (Node, browser, React Native)
```

## Core Concepts

**AquaTree** - The main data structure: an ordered map of revision hashes to Revision objects, plus a file index. Each revision references the previous one, forming a hash chain.

**Revision** - A single entry in the chain. Types: `file`, `form`, `signature`, `witness`, `link`. Contains a verification hash computed from its content via Merkle tree or scalar hashing.

**AquaTreeWrapper** - Bundles an AquaTree with context needed for operations: the current `fileObject` and target `revision` hash.

**FileObject** - `{ fileName, fileContent, path }` representing a file to notarize or verify.

**Result<T, E>** - All operations return `Result<AquaOperationData, LogData[]>`. Use `.isOk()` / `.isErr()` to check, then access `.data`.

## API Surface (Aquafier class)

| Method | Purpose |
|--------|---------|
| `createGenesisRevision(file, isForm?, enableContent?, enableScalar?)` | Start a new Aqua Tree |
| `createContentRevision(wrapper, file, enableScalar?)` | Add content revision to existing tree |
| `createFormRevision(wrapper, file, enableScalar?)` | Add form revision (JSON structured data) |
| `signAquaTree(wrapper, signType, credentials, enableScalar?)` | Sign latest revision |
| `witnessAquaTree(wrapper, type, network, platform, credentials, enableScalar?)` | Anchor to external system |
| `verifyAquaTree(tree, files, credentials?)` | Verify full chain integrity |
| `verifyAquaTreeRevision(tree, revision, hash, files, credentials?)` | Verify single revision |
| `linkAquaTree(wrapper, linkWrapper, enableScalar?)` | Link one tree to another |
| `hideFormElements(wrapper, key)` | Selective disclosure: redact a form field |
| `unHideFormElements(wrapper, key, content)` | Reveal a previously hidden field |
| `getLastRevision(tree)` | Get the latest revision |
| `getRevisionByHash(tree, hash)` | Lookup revision by hash |
| `getFileByHash(tree, hash)` | Retrieve file content by hash |
| `removeLastRevision(tree)` | Remove the last revision |

## Key Types

```typescript
type SignType = "metamask" | "cli" | "did" | "p12" | "inline"
type WitnessType = "tsa" | "eth" | "nostr"
type WitnessNetwork = "sepolia" | "mainnet" | "holesky"
type WitnessPlatformType = "cli" | "metamask" | "inline"
type RevisionType = "file" | "witness" | "signature" | "form" | "link"

interface CredentialsData {
  mnemonic: string;       // For CLI signing/witnessing
  nostr_sk: string;       // For Nostr witnessing
  did_key: string;        // For DID signing
  alchemy_key: string;    // For Ethereum RPC
  witness_eth_network: string;
  witness_method: string;
}
```

## Platform Support

Three build targets via `tsup`:
- **Node.js** (default): `import Aquafier from "aqua-js-sdk"`
- **Browser**: `import Aquafier from "aqua-js-sdk/web"`
- **React Native**: `import Aquafier from "aqua-js-sdk/react-native"`

Platform differences are abstracted in `src/platform/`.

## Building and Testing

```bash
npm run build    # tsup: ESM + CJS + type declarations
npm test         # Jest with experimental VM modules
npm run lint     # ESLint
npm run docs     # TypeDoc generation
```

## enableScalar Parameter

Most operations accept `enableScalar` (default: `true`). When true, revision hashes are computed as a flat scalar hash. When false, a Merkle tree is constructed from the revision fields, enabling selective disclosure and partial verification.
