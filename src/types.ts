
/**
 * @module types
 * @description This module contains all the types used in the Aqua SDK
 * @preferred @description This module contains all the types used in the Aqua SDK
 * @preferred @exports {CredentialsData, AquaOperationData, RevisionType, WitnessType, WitnessPlatformType, WitnessNetwork, SignType, WitnessEnvironment, FileObject, LogType, LogTypeEmojis, LogData, RevisionTree, Revision, Revisions, FileIndex, FormData, TreeMapping, AquaTreeWrapper, AquaTree, SignaturePayload, SignatureResult, SignatureData, SignatureItem, IWitnessConfig, AnObject, WitnessMerkleProof, WitnessResult, GasEstimateResult, WitnessConfig, TransactionResult, WitnessTransactionData, WitnessTSAResponse, WitnessEthResponse, WitnessNostrResponse, WitnessNostrVerifyResult}
 */

/**
 * @typedef {Object} CredentialsData
 * @property {string} mnemonic - The mnemonic of the user
 * @property {string} nostr_sk - The secret key of the Nostr account
 * @property {string} did_key - The DID key of the user
 * @property {string} alchemy_key - The Alchemy key of the user
 * @property {string} witness_eth_network - The Ethereum network of the witness
 * @property {string} witness_eth_platform - The Ethereum platform of the witness
 * @description The data required for the credentials of the user
 * @example
 * { mnemonic: "abandon, abandon, abandon, abandon, abandon, abandon, abandon, abandon, abandon, abandon, abandon, about",
 * nostr_sk: "0x
 * did_key: "did_key:z6Mkq
 * alchemy_key: "0x
 * witness_eth_network: "sepolia"
 * witness_eth_platform: "cli"
 * }
 */
export interface CredentialsData {
  mnemonic: string;
  nostr_sk: string;
  "did_key": string;
  alchemy_key: string,
  witness_eth_network: string;
  witness_method: string;
}

/**
 * @typedef {Object} AquaOperationData
 * @property {AquaTree[]} aquaTrees - The list of Aqua Trees
 * @property {AquaTree} aquaTree - The Aqua Tree
 * @property {Array<LogData>} logData - The log data
 * @description The data required for the Aqua operation
 */
/**
 * Data structure for Aqua operations
 * 
 * @property aquaTrees - List of Aqua Trees
 * @property aquaTree - Single Aqua Tree
 * @property logData - Operation logs
 */
export interface AquaOperationData {
  aquaTrees: AquaTree[]
  aquaTree: AquaTree | null
  logData: Array<LogData>
}


/**
 * Data structure for file verification results
 * 
 * @property isValidationSucessful - Whether file validation passed
 */
export interface FileVerificationGraphData {
  // revisionType: "file";
  isValidationSucessful: boolean;
}

/**
 * Data structure for form key verification
 * 
 * @property formKey - Key of the form
 * @property content - Content of the form
 * @property isValidationSucessful - Whether validation passed
 */
export interface FormKeyGraphData {
  formKey: string;
  content: string;
  isValidationSucessful: boolean;
}

/**
 * Data structure for form verification results
 * 
 * @property formKeys - List of verified form keys
 */
export interface FormVerificationGraphData {
  // revisionType: "form";
  formKeys: FormKeyGraphData[]
}

/**
 * Data structure for signature verification results
 * 
 * @property walletAddress - Address that signed
 * @property chainHashIsValid - Whether hash chain is valid
 * @property signature - Signature string
 * @property signatureType - Type of signature
 * @property isValidationSucessful - Whether validation passed
 */
export interface SignatureVerificationGraphData {
  // revisionType: "signature";
  walletAddress: string;
  chainHashIsValid: boolean;
  signature: string;
  signatureType: string
  isValidationSucessful: boolean;
}

/**
 * Data structure for witness verification results
 * 
 * @property txHash - Transaction hash
 * @property merkleRoot - Merkle root hash
 * @property isValidationSucessful - Whether validation passed
 */
export interface WitnessVerificationGraphData {
  // revisionType: "witness";
  txHash: string;
  merkleRoot: string;
  isValidationSucessful: boolean;
}

/**
 * Data structure for link verification results
 * 
 * @property isValidationSucessful - Whether validation passed
 */
export interface LinkVerificationGraphData {
  // revisionType: "link";
  isValidationSucessful: boolean;
}

/**
 * Union type of all verification graph data types
 */
export type RevisionGraphInfo = FileVerificationGraphData
  | WitnessVerificationGraphData
  | SignatureVerificationGraphData
  | FormVerificationGraphData
  | LinkVerificationGraphData


// export interface VerificationGraphData {
//   hash: string;
//   isValidationSucessful: boolean;
//   revisionType: RevisionType;

//   info: RevisionGraphInfo;

//   verificationGraphData: VerificationGraphData[]
//   linkVerificationGraphData: VerificationGraphData[]
// }

// Map RevisionType to corresponding info type
type RevisionGraphInfoMap = {
  file: FileVerificationGraphData;
  witness: WitnessVerificationGraphData;
  signature: SignatureVerificationGraphData;
  form: FormVerificationGraphData;
  link: LinkVerificationGraphData;
};

// Ensure info type matches revisionType
/**
 * Generic verification graph data structure
 * 
 * @typeParam T - Type of revision
 * @property hash - Hash of the revision
 * @property previous_verification_hash - Hash of previous revision
 * @property timestamp - When revision was created
 * @property isValidationSucessful - Whether validation passed
 * @property revisionType - Type of revision
 * @property info - Type-specific verification info
 * @property verificationGraphData - Child verification data
 * @property linkVerificationGraphData - Linked verification data
 */
export interface VerificationGraphData<T extends RevisionType = RevisionType> {
  hash: string;
  previous_verification_hash: string;
  timestamp: string;
  isValidationSucessful: boolean;
  revisionType: T;
  info: RevisionGraphInfoMap[T]; // Ensures info type is correct
  verificationGraphData: VerificationGraphData[];
  linkVerificationGraphData: VerificationGraphData[];
}

/** Type of revision in Aqua Tree */
export type RevisionType = "file" | "witness" | "signature" | "form" | "link"
/** Type of witness service */
export type WitnessType = "tsa" | "eth" | "nostr"
/** Platform used for witnessing */
export type WitnessPlatformType = 'cli' | 'metamask';
/** Network used for witnessing */
export type WitnessNetwork = "sepolia" | "mainnet" | "holesky"
/** Type of signing method */
export type SignType = "cli" | "metamask" | "did"

/** Environment where witnessing occurs */
export type WitnessEnvironment = 'node' | 'browser'

/**
 * Response data from form verification
 * 
 * @property isOk - Whether verification succeeded
 * @property logs - Verification logs
 * @property formKeysGraphData - Verified form keys data
 */
export interface FormVerificationResponseData {
  isOk: boolean;
  logs: LogData[];
  formKeysGraphData: FormKeyGraphData[];
}


/**
 * File metadata and content
 * 
 * @property fileName - Name of file
 * @property fileContent - Content as string or AquaTree
 * @property path - Path to file
 * @property fileSize - Size in bytes
 */
export interface FileObject {
  fileName: string,
  fileContent: string | AquaTree | Uint8Array,
  path: string
  fileSize?: number
}

/**
 * Types of log messages
 * Used for categorizing and formatting logs
 */
export enum LogType {
  SUCCESS = "success",
  INFO = "info",
  ERROR = "error",
  FINAL_ERROR = "final_error",
  WARNING = "warning",
  HINT = "hint",
  DEBUGDATA = "debug_data",
  ARROW = "arrow",
  FILE = "file",
  LINK = "link",
  SIGNATURE = "signature",
  WITNESS = "witness",
  FORM = "form",
  SCALAR = "scalar",
  EMPTY = "empty",
  TREE = "tree",
}

export const LogTypeEmojis: Record<LogType, string> = {
  [LogType.SUCCESS]: "✅",
  [LogType.INFO]: "✨",
  [LogType.ERROR]: "❌",
  [LogType.FINAL_ERROR]: "❌",
  [LogType.WARNING]: "🚨",
  [LogType.HINT]: "💡",
  [LogType.DEBUGDATA]: "🐞",
  [LogType.ARROW]: "➡️",
  [LogType.FILE]: "📄",
  [LogType.LINK]: "🔗",
  [LogType.SIGNATURE]: "🔏",
  [LogType.WITNESS]: "👀",
  [LogType.FORM]: "📝",
  [LogType.SCALAR]: "⏺️ ",
  [LogType.TREE]: "🌿",
  [LogType.EMPTY]: "",
};

/**
 * Log message structure
 * 
 * @property logType - Type of log message
 * @property log - Log message content
 * @property ident - Optional identifier
 */
export interface LogData {
  logType: LogType,
  log: string,
  ident?: string | null | undefined
}



/**
 * Tree structure for revisions
 * 
 * @property hash - Hash of revision
 * @property children - Child revisions
 */
export interface RevisionTree {
  hash: string
  children: RevisionTree[]
}


/**
 * Single revision in Aqua Tree
 * 
 * @property previous_verification_hash - Hash of previous revision
 * @property timestamp - When revision was created
 * @property revision_type - Type of revision
 * @property file_hash - Hash of file content
 * @property file_name - Name of file
 * @property form_name - Name of form if form revision
 * @property link_verification_hash - Hash of linked revision
 * @property link_file_name - Name of linked file
 */
export interface Revision {
  previous_verification_hash: string;
  local_timestamp: string;
  revision_type: "file" | "witness" | "signature" | "form" | "link";
  file_hash?: string;
  file_nonce?: string;
  content?: string;
  witness_merkle_root?: string;
  witness_timestamp?: number;
  witness_network?: string;
  witness_smart_contract_address?: string;
  witness_transaction_hash?: string;
  witness_sender_account_address?: string;
  witness_merkle_proof?: string[];
  signature?: string | SignatureData | any;
  signature_public_key?: string;
  signature_wallet_address?: string;
  signature_type?: string;
  link_type?:string,
  link_verification_hashes?:string[],
  link_file_hashes?: string[],
  leaves?: string[],
  [key: string]: any;

}

/**
 * Collection of revisions indexed by hash
 * 
 * @property [hash: string] - Maps revision hash to revision
 */
export interface Revisions {
  [key: string]: Revision;
}

/**
 * Index mapping file hashes to content
 * 
 * @property [hash: string] - Maps file hash to content
 */
export interface FileIndex {
  [key: string]: string;
}

/**
 * Form data structure
 * 
 * @property [key: string] - Maps form keys to values
 */
export interface FormData {
  [key: string]: string;
}

/**
 * Maps paths in Aqua Tree
 * 
 * @property paths - Maps keys to array of paths
 * @property latestHash - Most recent hash in tree
 */
export interface TreeMapping {
  paths: {
    [key: string]: string[];
  };
  latestHash: string;
}


/**
 * Wrapper for Aqua Tree with additional metadata
 * 
 * @property aquaTree - The Aqua Tree
 * @property fileObject - Optional file metadata
 * @property revision - Revision identifier
 */
export interface AquaTreeWrapper {
  aquaTree: AquaTree;
  fileObject?: FileObject;
  revision: string;
}

/**
 * Core Aqua Tree data structure
 * 
 * @property revisions - Collection of all revisions
 * @property file_index - Index of file contents
 * @property tree - Optional revision tree structure
 * @property treeMapping - Optional path mappings
 */
export interface AquaTree {
  revisions: Revisions;
  file_index: FileIndex;
  tree?: RevisionTree;
  treeMapping?: TreeMapping;
}



/**
 * Payload for signature operations
 * 
 * @property message - Message to sign
 */
export interface SignaturePayload {
  message: string;
}

/**
 * Result of signature operation
 * 
 * @property jws - JSON Web Signature data
 * @property key - Key used for signing
 */
export interface SignatureResult {
  jws: SignatureData; // Using 'any' here as the JWS type isn't exported from dids
  key: string;
}



/**
 * JSON Web Signature data
 * 
 * @property payload - Signed payload
 * @property signatures - Array of signatures
 */
export interface SignatureData {
  payload: string;
  signatures: SignatureItem[];
}

/**
 * Individual signature in JWS
 * 
 * @property protected - Protected header
 * @property signature - Signature value
 */
export interface SignatureItem {
  protected: string;
  signature: string;
}


/**
 * Configuration for witness operations
 * 
 * @property witnessNetwork - Network to use
 * @property smartContractAddress - Contract address
 * @property witnessEventVerificationHash - Hash to witness
 * @property port - Server port
 * @property host - Server host
 */
export interface IWitnessConfig {
  witnessNetwork: string,
  smartContractAddress: string,
  witnessEventVerificationHash: string,
  port: number,
  host: string
}

/**
 * Generic object type
 * 
 * @property [key: string] - Maps string keys to any value
 */
export interface AnObject {
  [key: string]: string | number | boolean | any;
}


/**
 * Proof of inclusion in witness Merkle tree
 * 
 * @property depth - Depth in tree
 * @property left_leaf - Left sibling hash
 * @property right_leaf - Right sibling hash
 * @property successor - Next hash in path
 */
export interface WitnessMerkleProof {
  depth?: string;
  left_leaf?: string;
  right_leaf?: string | null;
  successor?: string;
}

/**
 * Result of witness operation
 * 
 * @property witness_merkle_root - Root of witness tree
 * @property witness_timestamp - When witnessed
 * @property witness_network - Network used
 * @property witness_smart_contract_address - Contract address
 * @property witness_transaction_hash - Transaction hash
 * @property witness_sender_account_address - Witness account
 * @property witness_merkle_proof - Inclusion proof
 */
export interface WitnessResult {
  witness_merkle_root: string;
  witness_timestamp: number;
  witness_network: string;
  witness_smart_contract_address: string;
  witness_transaction_hash: string;
  witness_sender_account_address: string;
  witness_merkle_proof: string[] | WitnessMerkleProof[];
}


/**
 * Result of gas estimation
 * 
 * @property error - Error if estimation failed
 * @property hasEnoughBalance - Whether account has funds
 * @property gasEstimate - Estimated gas amount
 * @property gasFee - Estimated gas fee
 * @property balance - Account balance
 */
export interface GasEstimateResult {
  error: string | null;
  hasEnoughBalance: boolean;
  gasEstimate?: string;
  gasFee?: string;
  balance?: string
}

/**
 * Witness configuration
 * 
 * @property witnessEventVerificationHash - Hash to witness
 * @property witnessNetwork - Network to use
 * @property smartContractAddress - Contract address
 */
export interface WitnessConfig {
  witnessEventVerificationHash: string;
  witnessNetwork: WitnessNetwork;
  smartContractAddress: string;
}

/**
 * Result of transaction
 * 
 * @property error - Error if transaction failed
 * @property transactionHash - Hash if successful
 */
export interface TransactionResult {
  error: string | null;
  transactionHash?: string;
}

/**
 * Transaction data for witness
 * 
 * @property transaction_hash - Hash of transaction
 * @property wallet_address - Address that witnessed
 */
export interface WitnessTransactionData {
  transaction_hash: string;
  wallet_address: string;
}


/**
 * Response from TSA witness
 * 
 * @property base64Response - Encoded TSA response
 * @property provider - TSA provider name
 * @property timestamp - When witnessed
 */
export interface WitnessTSAResponse {
  base64Response: string;
  provider: string;
  timestamp: number;
}

/**
 * Response from Ethereum witness
 * 
 * @property transactionHash - Hash of transaction
 * @property walletAddress - Address that witnessed
 */
export interface WitnessEthResponse {
  transactionHash: string,
  walletAddress: string

}

/**
 * Response from Nostr witness
 * 
 * @property nevent - Nostr event identifier
 * @property npub - Nostr public key
 * @property timestamp - When witnessed
 */
export interface WitnessNostrResponse {
  nevent: string;
  npub: string;
  timestamp: number;
}

/**
 * Result of Nostr witness verification
 * 
 * @property type - Type of verification
 * @property data - Verification data
 * @property id - Event ID
 * @property relays - Optional relay URLs
 * @property author - Optional author key
 */
export interface WitnessNostrVerifyResult {
  type: string;
  data: {
    id: string;
    relays?: string[];
    author?: string;
  };
}
