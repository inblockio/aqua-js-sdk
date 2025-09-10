import { z } from 'zod';

// Basic enum and union types
export const RevisionTypeSchema = z.enum(["file", "witness", "signature", "form", "link"]);
export const WitnessTypeSchema = z.enum(["tsa", "eth", "nostr"]);
export const WitnessPlatformTypeSchema = z.enum(["cli", "metamask"]);
export const WitnessNetworkSchema = z.enum(["sepolia", "mainnet", "holesky"]);
export const SignTypeSchema = z.enum(["metamask", "cli", "did", "p12"]);
export const WitnessEnvironmentSchema = z.enum(["node", "browser"]);

export const LogTypeSchema = z.enum([
  "success",
  "info", 
  "error",
  "final_error",
  "warning",
  "hint",
  "debug_data",
  "arrow",
  "file",
  "link",
  "signature", 
  "witness",
  "form",
  "scalar",
  "empty",
  "tree"
]);

// Credentials Data
export const CredentialsDataSchema = z.object({
  mnemonic: z.string(),
  nostr_sk: z.string(),
  did_key: z.string(),
  alchemy_key: z.string(),
  witness_eth_network: z.string(),
  witness_method: z.string(),
  p12_password: z.string().optional(),
  p12_content: z.string().optional(),
});

// React Native MetaMask Options
export const ReactNativeMetaMaskOptionsSchema = z.object({
  deepLinkUrl: z.string().optional(),
  callbackUrl: z.string().optional(),
  onDeepLinkReady: z.function().args(z.string()).returns(z.void()).optional(),
});

// Log Data
export const LogDataSchema = z.object({
  logType: LogTypeSchema,
  log: z.string(),
  ident: z.string().nullable().optional(),
});

// File Object
export const FileObjectSchema = z.object({
  fileName: z.string(),
  fileContent: z.union([
    z.string(),
    z.instanceof(Uint8Array),
    z.record(z.string(), z.string()),
    z.record(z.string(), z.unknown()),
    z.lazy(() => AquaTreeSchema) // For circular reference
  ]),
  path: z.string(),
  fileSize: z.number().optional(),
});

// Revision Tree (recursive structure)
export const RevisionTreeSchema: z.ZodType<any> = z.lazy(() => z.object({
  hash: z.string(),
  children: z.array(RevisionTreeSchema),
}));

// Tree Mapping
export const TreeMappingSchema = z.object({
  paths: z.record(z.string(), z.array(z.string())),
  latestHash: z.string(),
});

// Signature Item
export const SignatureItemSchema = z.object({
  protected: z.string(),
  signature: z.string(),
});

// Signature Data
export const SignatureDataSchema = z.object({
  payload: z.string(),
  signatures: z.array(SignatureItemSchema),
});

// Revision
export const RevisionSchema = z.object({
  previous_verification_hash: z.string(),
  local_timestamp: z.string(),
  revision_type: RevisionTypeSchema,
  version: z.string(),
  file_hash: z.string().optional(),
  file_nonce: z.string().optional(),
  content: z.string().optional(),
  witness_merkle_root: z.string().optional(),
  witness_timestamp: z.number().optional(),
  witness_network: z.string().optional(),
  witness_smart_contract_address: z.string().optional(),
  witness_transaction_hash: z.string().optional(),
  witness_sender_account_address: z.string().optional(),
  witness_merkle_proof: z.array(z.string()).optional(),
  signature: z.union([z.string(), SignatureDataSchema, z.any()]).optional(),
  signature_public_key: z.string().optional(),
  signature_wallet_address: z.string().optional(),
  signature_type: z.string().optional(),
  link_type: z.string().optional(),
  link_verification_hashes: z.array(z.string()).optional(),
  link_file_hashes: z.array(z.string()).optional(),
  leaves: z.array(z.string()).optional(),
}).catchall(z.any()); // Allow additional string keys with any values

// Revisions and File Index
export const RevisionsSchema = z.record(z.string(), RevisionSchema);
export const FileIndexSchema = z.record(z.string(), z.string());
export const FormDataSchema = z.record(z.string(), z.string());

// Aqua Tree
export const AquaTreeSchema = z.object({
  revisions: RevisionsSchema,
  file_index: FileIndexSchema,
  tree: RevisionTreeSchema.optional(),
  treeMapping: TreeMappingSchema.optional(),
});

// Aqua Tree View
export const AquaTreeViewSchema = z.object({
  aquaTree: AquaTreeSchema,
  fileObject: FileObjectSchema.optional(),
  revision: z.string(),
});

// Aqua Operation Data
export const AquaOperationDataSchema = z.object({
  aquaTrees: z.array(AquaTreeSchema),
  aquaTree: AquaTreeSchema.nullable(),
  logData: z.array(LogDataSchema),
});

// Verification Graph Data Types
export const FileVerificationGraphDataSchema = z.object({
  isValidationSucessful: z.boolean(),
});

export const FormKeyGraphDataSchema = z.object({
  formKey: z.string(),
  content: z.string(),
  isValidationSucessful: z.boolean(),
});

export const FormVerificationGraphDataSchema = z.object({
  formKeys: z.array(FormKeyGraphDataSchema),
});

export const SignatureVerificationGraphDataSchema = z.object({
  walletAddress: z.string(),
  chainHashIsValid: z.boolean(),
  signature: z.string(),
  signatureType: z.string(),
  isValidationSucessful: z.boolean(),
});

export const WitnessVerificationGraphDataSchema = z.object({
  txHash: z.string(),
  merkleRoot: z.string(),
  isValidationSucessful: z.boolean(),
});

export const LinkVerificationGraphDataSchema = z.object({
  isValidationSucessful: z.boolean(),
});

export const RevisionGraphInfoSchema = z.union([
  FileVerificationGraphDataSchema,
  FormVerificationGraphDataSchema,
  SignatureVerificationGraphDataSchema,
  WitnessVerificationGraphDataSchema,
  LinkVerificationGraphDataSchema,
]);

// Verification Graph Data (recursive)
export const VerificationGraphDataSchema: z.ZodType<any> = z.lazy(() => z.object({
  hash: z.string(),
  previous_verification_hash: z.string(),
  timestamp: z.string(),
  isValidationSucessful: z.boolean(),
  revisionType: RevisionTypeSchema,
  info: RevisionGraphInfoSchema,
  verificationGraphData: z.array(VerificationGraphDataSchema),
  linkVerificationGraphData: z.array(VerificationGraphDataSchema),
}));

// Form Verification Response Data
export const FormVerificationResponseDataSchema = z.object({
  isOk: z.boolean(),
  logs: z.array(LogDataSchema),
  formKeysGraphData: z.array(FormKeyGraphDataSchema),
});

// Signature related schemas
export const SignaturePayloadSchema = z.object({
  message: z.string(),
});

export const SignatureResultSchema = z.object({
  jws: SignatureDataSchema,
  key: z.string(),
});

// Witness related schemas
export const IWitnessConfigSchema = z.object({
  witnessNetwork: z.string(),
  smartContractAddress: z.string(),
  witnessEventVerificationHash: z.string(),
  port: z.number(),
  host: z.string(),
});

export const WitnessMerkleProofSchema = z.object({
  depth: z.string().optional(),
  left_leaf: z.string().optional(),
  right_leaf: z.string().nullable().optional(),
  successor: z.string().optional(),
});

export const WitnessResultSchema = z.object({
  witness_merkle_root: z.string(),
  witness_timestamp: z.number(),
  witness_network: z.string(),
  witness_smart_contract_address: z.string(),
  witness_transaction_hash: z.string(),
  witness_sender_account_address: z.string(),
  witness_merkle_proof: z.union([
    z.array(z.string()),
    z.array(WitnessMerkleProofSchema)
  ]),
});

export const GasEstimateResultSchema = z.object({
  error: z.string().nullable(),
  hasEnoughBalance: z.boolean(),
  gasEstimate: z.string().optional(),
  gasFee: z.string().optional(),
  balance: z.string().optional(),
});

export const WitnessConfigSchema = z.object({
  witnessEventVerificationHash: z.string(),
  witnessNetwork: WitnessNetworkSchema,
  smartContractAddress: z.string(),
});

export const TransactionResultSchema = z.object({
  error: z.string().nullable(),
  transactionHash: z.string().optional(),
});

export const WitnessTransactionDataSchema = z.object({
  transaction_hash: z.string(),
  wallet_address: z.string(),
});

// Witness Response schemas
export const WitnessTSAResponseSchema = z.object({
  base64Response: z.string(),
  provider: z.string(),
  timestamp: z.number(),
});

export const WitnessEthResponseSchema = z.object({
  transactionHash: z.string(),
  walletAddress: z.string(),
});

export const WitnessNostrResponseSchema = z.object({
  nevent: z.string(),
  npub: z.string(),
  timestamp: z.number(),
});

export const WitnessNostrVerifyResultSchema = z.object({
  type: z.string(),
  data: z.object({
    id: z.string(),
    relays: z.array(z.string()).optional(),
    author: z.string().optional(),
  }),
});

// Additional schemas
export const AnObjectSchema = z.record(z.string(), z.unknown());

export const AquaTreeAndFileObjectSchema = z.object({
  fileObject: z.array(FileObjectSchema),
  aquaTree: AquaTreeSchema.nullable(),
});

// Export type inference helpers
export type CredentialsData = z.infer<typeof CredentialsDataSchema>;
export type AquaOperationData = z.infer<typeof AquaOperationDataSchema>;
export type FileObject = z.infer<typeof FileObjectSchema>;
export type LogData = z.infer<typeof LogDataSchema>;
export type RevisionTree = z.infer<typeof RevisionTreeSchema>;
export type Revision = z.infer<typeof RevisionSchema>;
export type AquaTree = z.infer<typeof AquaTreeSchema>;
export type VerificationGraphData = z.infer<typeof VerificationGraphDataSchema>;
export type WitnessResult = z.infer<typeof WitnessResultSchema>;
export type SignatureData = z.infer<typeof SignatureDataSchema>;

// Usage examples:

// Parse and validate data
export function parseCredentials(data: unknown): CredentialsData {
  return CredentialsDataSchema.parse(data);
}

export function parseAquaTree(data: unknown): AquaTree {
  return AquaTreeSchema.parse(data);
}

export function validateLogData(data: unknown): boolean {
  return LogDataSchema.safeParse(data).success;
}

// Safe parsing with error handling
export function safeParseAquaOperationData(data: unknown) {
  const result = AquaOperationDataSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, errors: result.error.issues };
  }
}