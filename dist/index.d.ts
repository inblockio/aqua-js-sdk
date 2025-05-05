import { HDNodeWallet } from 'ethers';

/**
 * Result type for handling success/error cases
 *
 * @typeParam T - Type of success value
 * @typeParam E - Type of error value
 */
type Result<T, E> = OkResult<T, E> | ErrResult<T, E>;
/**
 * Represents a successful Result containing a value
 *
 * @typeParam T - Type of success value
 * @typeParam E - Type of error value (unused in Ok case)
 */
declare class OkResult<T, E> {
    readonly data: T;
    readonly tag: 'ok';
    constructor(data: T);
    isOk(): this is OkResult<T, E>;
    isErr(): this is ErrResult<T, E>;
    map<U>(fn: (value: T) => U): Result<U, E>;
    unwrap(): T;
    unwrapOr(_default: T): T;
}
/**
 * Represents a failed Result containing an error
 *
 * @typeParam T - Type of success value (unused in Err case)
 * @typeParam E - Type of error value
 */
declare class ErrResult<T, E> {
    readonly data: E;
    readonly tag: 'err';
    constructor(data: E);
    isOk(): this is OkResult<T, E>;
    isErr(): this is ErrResult<T, E>;
    map<U>(_fn: (value: T) => U): Result<U, E>;
    unwrap(): never;
    unwrapOr(defaultValue: T): T;
}
/**
 * Creates a successful Result
 *
 * @param value - Value to wrap in Ok
 * @returns Result containing success value
 */
declare function Ok<T, E>(value: T): Result<T, E>;
/**
 * Creates a failed Result
 *
 * @param error - Error to wrap in Err
 * @returns Result containing error value
 */
declare function Err<T, E>(error: E): Result<T, E>;
/**
 * Type guard for checking if Result is Ok
 *
 * @param result - Result to check
 * @returns True if Result is Ok, false otherwise
 */
declare function isOk<T, E>(result: Result<T, E>): result is OkResult<T, E>;
/**
 * Type guard for checking if Result is Err
 *
 * @param result - Result to check
 * @returns True if Result is Err, false otherwise
 */
declare function isErr<T, E>(result: Result<T, E>): result is ErrResult<T, E>;
/**
 * Option type for handling optional values
 *
 * @typeParam T - Type of contained value
 */
type Option<T> = SomeOption<T> | NoneOption<T>;
/**
 * Represents an Option containing a value
 *
 * @typeParam T - Type of contained value
 */
declare class SomeOption<T> {
    readonly value: T;
    readonly tag: 'some';
    constructor(value: T);
    isSome(): this is SomeOption<T>;
    isNone(): this is NoneOption<T>;
    map<U>(fn: (value: T) => U): Option<U>;
    unwrap(): T;
    unwrapOr(_default: T): T;
}
/**
 * Represents an empty Option
 *
 * @typeParam T - Type of value (unused in None case)
 */
declare class NoneOption<T> {
    readonly tag: 'none';
    isSome(): this is SomeOption<T>;
    isNone(): this is NoneOption<T>;
    map<U>(_fn: (value: T) => U): Option<U>;
    unwrap(): never;
    unwrapOr(defaultValue: T): T;
}
/**
 * Creates an Option containing a value
 *
 * @param value - Value to wrap in Some
 * @returns Option containing value
 */
declare function Some<T>(value: T): Option<T>;
/**
 * Creates an empty Option
 *
 * @returns Empty Option
 */
declare function None<T>(): Option<T>;
/**
 * Type guard for checking if Option contains value
 *
 * @param option - Option to check
 * @returns True if Option is Some, false otherwise
 */
declare function isSome<T>(option: Option<T>): option is SomeOption<T>;
/**
 * Type guard for checking if Option is empty
 *
 * @param option - Option to check
 * @returns True if Option is None, false otherwise
 */
declare function isNone<T>(option: Option<T>): option is NoneOption<T>;

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
interface CredentialsData {
    mnemonic: string;
    nostr_sk: string;
    did_key: string;
    alchemy_key: string;
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
interface AquaOperationData {
    aquaTrees: AquaTree[];
    aquaTree: AquaTree | null;
    logData: Array<LogData>;
}
/**
 * Data structure for file verification results
 *
 * @property isValidationSucessful - Whether file validation passed
 */
interface FileVerificationGraphData {
    isValidationSucessful: boolean;
}
/**
 * Data structure for form key verification
 *
 * @property formKey - Key of the form
 * @property content - Content of the form
 * @property isValidationSucessful - Whether validation passed
 */
interface FormKeyGraphData {
    formKey: string;
    content: string;
    isValidationSucessful: boolean;
}
/**
 * Data structure for form verification results
 *
 * @property formKeys - List of verified form keys
 */
interface FormVerificationGraphData {
    formKeys: FormKeyGraphData[];
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
interface SignatureVerificationGraphData {
    walletAddress: string;
    chainHashIsValid: boolean;
    signature: string;
    signatureType: string;
    isValidationSucessful: boolean;
}
/**
 * Data structure for witness verification results
 *
 * @property txHash - Transaction hash
 * @property merkleRoot - Merkle root hash
 * @property isValidationSucessful - Whether validation passed
 */
interface WitnessVerificationGraphData {
    txHash: string;
    merkleRoot: string;
    isValidationSucessful: boolean;
}
/**
 * Data structure for link verification results
 *
 * @property isValidationSucessful - Whether validation passed
 */
interface LinkVerificationGraphData {
    isValidationSucessful: boolean;
}
/**
 * Union type of all verification graph data types
 */
type RevisionGraphInfo = FileVerificationGraphData | WitnessVerificationGraphData | SignatureVerificationGraphData | FormVerificationGraphData | LinkVerificationGraphData;
type RevisionGraphInfoMap = {
    file: FileVerificationGraphData;
    witness: WitnessVerificationGraphData;
    signature: SignatureVerificationGraphData;
    form: FormVerificationGraphData;
    link: LinkVerificationGraphData;
};
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
interface VerificationGraphData<T extends RevisionType = RevisionType> {
    hash: string;
    previous_verification_hash: string;
    timestamp: string;
    isValidationSucessful: boolean;
    revisionType: T;
    info: RevisionGraphInfoMap[T];
    verificationGraphData: VerificationGraphData[];
    linkVerificationGraphData: VerificationGraphData[];
}
/** Type of revision in Aqua Tree */
type RevisionType = "file" | "witness" | "signature" | "form" | "link";
/** Type of witness service */
type WitnessType = "tsa" | "eth" | "nostr";
/** Platform used for witnessing */
type WitnessPlatformType = "cli" | "metamask";
/** Network used for witnessing */
type WitnessNetwork = "sepolia" | "mainnet" | "holesky";
/** Type of signing method */
type SignType = "cli" | "metamask" | "did";
/** Environment where witnessing occurs */
type WitnessEnvironment = "node" | "browser";
/**
 * Response data from form verification
 *
 * @property isOk - Whether verification succeeded
 * @property logs - Verification logs
 * @property formKeysGraphData - Verified form keys data
 */
interface FormVerificationResponseData {
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
 *
 * Record<string, string> /object - for forms
 * string - for text file ie html, txt,
 * aquaTree - linked aqua tree
 * Uint8Array - for all others ie images, video, music etc
 */
interface FileObject {
    fileName: string;
    fileContent: string | AquaTree | Uint8Array | Record<string, string> | object;
    path: string;
    fileSize?: number;
}
/**
 * Types of log messages
 * Used for categorizing and formatting logs
 */
declare enum LogType {
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
    TREE = "tree"
}
declare const LogTypeEmojis: Record<LogType, string>;
/**
 * Log message structure
 *
 * @property logType - Type of log message
 * @property log - Log message content
 * @property ident - Optional identifier
 */
interface LogData {
    logType: LogType;
    log: string;
    ident?: string | null | undefined;
}
/**
 * Tree structure for revisions
 *
 * @property hash - Hash of revision
 * @property children - Child revisions
 */
interface RevisionTree {
    hash: string;
    children: RevisionTree[];
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
interface Revision {
    previous_verification_hash: string;
    local_timestamp: string;
    revision_type: "file" | "witness" | "signature" | "form" | "link";
    version: string;
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
    link_type?: string;
    link_verification_hashes?: string[];
    link_file_hashes?: string[];
    leaves?: string[];
    [key: string]: any;
}
/**
 * Collection of revisions indexed by hash
 *
 * @property [hash: string] - Maps revision hash to revision
 */
interface Revisions {
    [key: string]: Revision;
}
/**
 * Index mapping file hashes to content
 *
 * @property [hash: string] - Maps file hash to content
 */
interface FileIndex {
    [key: string]: string;
}
/**
 * Form data structure
 *
 * @property [key: string] - Maps form keys to values
 */
interface FormData {
    [key: string]: string;
}
/**
 * Maps paths in Aqua Tree
 *
 * @property paths - Maps keys to array of paths
 * @property latestHash - Most recent hash in tree
 */
interface TreeMapping {
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
interface AquaTreeWrapper {
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
interface AquaTree {
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
interface SignaturePayload {
    message: string;
}
/**
 * Result of signature operation
 *
 * @property jws - JSON Web Signature data
 * @property key - Key used for signing
 */
interface SignatureResult {
    jws: SignatureData;
    key: string;
}
/**
 * JSON Web Signature data
 *
 * @property payload - Signed payload
 * @property signatures - Array of signatures
 */
interface SignatureData {
    payload: string;
    signatures: SignatureItem[];
}
/**
 * Individual signature in JWS
 *
 * @property protected - Protected header
 * @property signature - Signature value
 */
interface SignatureItem {
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
interface IWitnessConfig {
    witnessNetwork: string;
    smartContractAddress: string;
    witnessEventVerificationHash: string;
    port: number;
    host: string;
}
/**
 * Generic object type
 *
 * @property [key: string] - Maps string keys to any value
 */
interface AnObject {
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
interface WitnessMerkleProof {
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
interface WitnessResult {
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
interface GasEstimateResult {
    error: string | null;
    hasEnoughBalance: boolean;
    gasEstimate?: string;
    gasFee?: string;
    balance?: string;
}
/**
 * Witness configuration
 *
 * @property witnessEventVerificationHash - Hash to witness
 * @property witnessNetwork - Network to use
 * @property smartContractAddress - Contract address
 */
interface WitnessConfig {
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
interface TransactionResult {
    error: string | null;
    transactionHash?: string;
}
/**
 * Transaction data for witness
 *
 * @property transaction_hash - Hash of transaction
 * @property wallet_address - Address that witnessed
 */
interface WitnessTransactionData {
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
interface WitnessTSAResponse {
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
interface WitnessEthResponse {
    transactionHash: string;
    walletAddress: string;
}
/**
 * Response from Nostr witness
 *
 * @property nevent - Nostr event identifier
 * @property npub - Nostr public key
 * @property timestamp - When witnessed
 */
interface WitnessNostrResponse {
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
interface WitnessNostrVerifyResult {
    type: string;
    data: {
        id: string;
        relays?: string[];
        author?: string;
    };
}

declare function reorderRevisionsProperties(revision: Revision): Revision;
declare function reorderAquaTreeRevisionsProperties(aquaTree: AquaTree): AquaTree;
/**
 * Gets the previous verification hash in an Aqua Tree's revision chain
 *
 * @param aquaTree - The Aqua Tree to search in
 * @param currentHash - Current revision hash
 * @returns Previous verification hash or empty string if none
 *
 * This function finds the chronologically previous hash in the
 * revision chain, useful for maintaining revision history.
 */
declare function getPreviousVerificationHash(aquaTree: AquaTree, currentHash: string): string;
/**
 * Finds a form key in a revision
 *
 * @param revision - Revision to search in
 * @param key - Key to search for
 * @returns Found key or undefined
 *
 * This function searches for exact matches or partial matches
 * with 'forms-' prefix in revision keys.
 */
declare function findFormKey(revision: Revision, key: string): string;
/**
 * Updates the file index in an Aqua Tree based on revision type
 *
 * @param aquaTree - The Aqua Tree to update
 * @param verificationHash - Hash of the revision
 * @param revisionType - Type of revision (file, form, link)
 * @param aquaFileName - Name of the Aqua file
 * @param formFileName - Name of the form file
 * @param linkVerificationHash - Hash for linked revision
 * @param linkFileName - Name of the linked file
 * @returns Result containing updated Aqua Tree or error logs
 *
 * This function:
 * - Validates revision type
 * - Updates file index based on revision type
 * - Handles different file types (Aqua, form, link)
 */
declare function maybeUpdateFileIndex(aquaTree: AquaTree, verificationHash: string, revisionType: string, aquaFileName: string, formFileName: string, linkVerificationHash: string, linkFileName: string): Result<AquaTree, LogData[]>;
/**
 * Converts dictionary to sorted array of hash leaves
 *
 * @param obj - Object to convert
 * @returns Array of hash strings
 *
 * This function:
 * - Sorts keys for deterministic output
 * - Creates hash of each key-value pair
 * - Used in Merkle tree construction
 */
declare function dict2Leaves(obj: AnObject): string[];
/**
 * Calculates hash sum of file content
 *
 * @param fileContent - Content to hash
 * @returns SHA-256 hash of content
 *
 * This function provides a consistent way to
 * hash file contents across the SDK.
 */
declare function getFileHashSum(fileContent: string): string;
/**
 * Calculates hash sum of data
 *
 * @param data - String or Uint8Array to hash
 * @returns SHA-256 hash of data
 *
 * This function:
 * - Handles both string and binary input
 * - Uses SHA-256 for consistent hashing
 * - Returns hex-encoded hash
 */
declare function getHashSum(data: string | Uint8Array): string;
/**
 * Creates a new empty Aqua Tree structure
 *
 * @returns Empty initialized Aqua Tree
 *
 * This function creates a new Aqua Tree with:
 * - Empty revisions object
 * - Empty file index
 * - Empty tree structure
 * - Empty tree mapping
 */
declare function createNewAquaTree(): AquaTree;
/**
 * Checks if a file hash is already notarized in an Aqua Tree
 *
 * @param fileHash - Hash to check
 * @param aquaTree - Aqua Tree to search in
 * @returns Boolean indicating if hash is already notarized
 *
 * This function searches through all revisions to find
 * if the given file hash has already been notarized.
 */
declare function checkFileHashAlreadyNotarized(fileHash: string, aquaTree: AquaTree): boolean;
/**
 * Generates a nonce using current timestamp
 *
 * @returns Hash of current timestamp
 *
 * This function creates a unique nonce for
 * operations that require randomization.
 */
declare function prepareNonce(): string;
/**
 * Creates an Ethereum wallet from mnemonic
 *
 * @param mnemonic - BIP39 mnemonic phrase
 * @returns Tuple of [wallet, address, publicKey, privateKey]
 *
 * This function:
 * - Creates HDNodeWallet from mnemonic
 * - Returns wallet and its credentials
 * - Ensures address is lowercase
 */
declare function getWallet(mnemonic: string): Promise<[HDNodeWallet, string, string, string]>;
/**
 * Generates cryptographically secure random bytes
 *
 * @returns 16 bytes of entropy
 *
 * This function:
 * - Works in both browser and Node.js
 * - Uses appropriate crypto API for environment
 * - Used for mnemonic generation
 */
declare function getEntropy(): Uint8Array;
declare const getFileNameCheckingPaths: (fileObjects: Array<FileObject>, fileName: string) => FileObject | undefined;
/**
 * Creates default credentials for the SDK
 *
 * @returns CredentialsData object
 *
 * This function:
 * - Generates new mnemonic
 * - Sets default Alchemy key
 * - Configures witness network
 * - Sets default witness method
 */
declare function createCredentials(): CredentialsData;
/**
 * Formats timestamp into MediaWiki format
 *
 * @param ts - ISO timestamp string
 * @returns Formatted timestamp string
 *
 * This function converts ISO timestamps into
 * the format used in MediaWiki outputs.
 */
declare function formatMwTimestamp(ts: string): string;
/**
 * Estimates gas for witness transaction
 *
 * @param wallet_address - Address of witness wallet
 * @param witness_event_verification_hash - Hash to witness
 * @param ethNetwork - Ethereum network name
 * @param smart_contract_address - Address of witness contract
 * @param _providerUrl - URL of Ethereum provider
 * @returns Promise resolving to gas estimate and logs
 *
 * This function:
 * - Connects to Ethereum network
 * - Checks wallet balance
 * - Estimates gas for witness transaction
 * - Returns estimate and relevant information
 */
declare const estimateWitnessGas: (wallet_address: string, witness_event_verification_hash: string, ethNetwork: string, smart_contract_address: string, _providerUrl: string) => Promise<[GasEstimateResult, Array<LogData>]>;
declare function verifyMerkleIntegrity(merkleBranch: string[], merkleRoot: string): boolean;
declare const getMerkleRoot: (leaves: string[]) => string;
declare const getLatestVH: (aquaTree: AquaTree) => string;
declare const getTimestamp: () => string;
/**
 * Checks if the system has an internet connection
 * Works in both browser and Node.js environments
 * @returns Promise<boolean> indicating if internet is available
 */
declare function checkInternetConnection(): Promise<boolean>;
declare function printLogs(logs: LogData[], enableVerbose?: boolean): void;
declare function printlinkedGraphData(node: VerificationGraphData, prefix?: string, _isLast?: boolean): void;
declare function printGraphData(node: VerificationGraphData, prefix?: string, _isLast?: boolean): void;
declare function OrderRevisionInAquaTree(params: AquaTree): AquaTree;
declare function getGenesisHash(aquaTree: AquaTree): string | null;
declare function findNextRevisionHashByArrayofRevisions(previousVerificationHash: string, revisions: Array<Revision>): Revision | null;

/**
 * Recovers the Ethereum wallet address from a signature
 *
 * @param verificationHash - Hash of the verification data that was signed
 * @param signature - Signature to recover address from
 * @returns Recovered Ethereum wallet address
 *
 * This function:
 * - Creates the original signed message
 * - Recovers the signer's address using ethers.js
 * @throws Error if signature or message is invalid
 */
declare function recoverWalletAddress(verificationHash: string, signature: string): string;

/**
 * Formats text in red color for CLI output
 * @param content - Text to be colored red
 * @returns String with ANSI color codes for red text
 */
declare function cliRedify(content: string): string;
/**
 * Formats text in yellow color for CLI output
 * @param content - Text to be colored yellow
 * @returns String with ANSI color codes for yellow text
 */
declare function cliYellowfy(content: string): string;
/**
 * Formats text in green color for CLI output
 * @param content - Text to be colored green
 * @returns String with ANSI color codes for green text
 */
declare function cliGreenify(content: string): string;
/**
 * Logs text to console in red color
 * @param content - Content to be logged in red
 */
declare function log_red(content: any): void;
/**
 * Logs text to console in yellow color
 * @param content - Content to be logged in yellow
 */
declare function log_yellow(content: any): void;
/**
 * Logs text to console with dimmed brightness
 * @param content - Content to be logged with dim effect
 */
declare function log_dim(content: string): void;
/**
 * Logs success messages to console in green color
 * @param content - Success message to be logged in green
 */
declare function log_success(content: any): void;

/**
 * @class Aquafier
 * @description This class is the main class that contains all the methods that can be used to interact with the aqua tree data structure
 * @method removeLastRevision
 * @method createContentRevision
 * @method createGenesisRevision
 * @method verifyAquaTree
 * @method verifyAquaTreeRevision
 * @method witnessAquaTree
 * @method witnessMultipleAquaTrees
 * @method signAquaTree
 * @method signMultipleAquaTrees
 * @method linkAquaTree
 * @method linkMultipleAquaTrees
 * @method linkAquaTreesToMultipleAquaTrees
 * @method createFormRevision
 * @method hideFormElements
 * @method unHideFormElements
 * @method fetchFilesToBeRead
 * @method checkIfFileAlreadyNotarized
 * @method getRevisionByHash
 * @method getLastRevision
 * @method getFileByHash
 * @method getFileHash
 */
declare class Aquafier {
    /**
     * @method removeLastRevision
     * @description This method removes the last revision from the aqua tree
     * @param aquaTree - The aqua tree to remove the last revision from
     * @returns Result<AquaOperationData, LogData[]>
     */
    removeLastRevision: (aquaTree: AquaTree) => Result<AquaOperationData, LogData[]>;
    /**
     * @method createContentRevision
     * @description This method creates a content revision for the aqua tree
     * @param aquaTree - The aqua tree to create the content revision for
     * @param fileObject - The file object to create the content revision for
     * @param enableScalar - A boolean value to enable scalar
     * @returns Result<AquaOperationData, LogData[]>
     */
    createContentRevision: (aquaTree: AquaTreeWrapper, fileObject: FileObject, enableScalar?: boolean) => Promise<Result<AquaOperationData, LogData[]>>;
    /**
     * @method createGenesisRevision
     * @description This method creates a genesis revision for the aqua tree
     * @param fileObject - The file object to create the genesis revision for
     * @param isForm - A boolean value to check if the file object is a form
     * @param enableContent - A boolean value to enable content
     * @param enableScalar - A boolean value to enable scalar
     * @returns Result<AquaOperationData, LogData[]>
     */
    createGenesisRevision: (fileObject: FileObject, isForm?: boolean, enableContent?: boolean, enableScalar?: boolean) => Promise<Result<AquaOperationData, LogData[]>>;
    /**
     * @method verifyAquaTree
     * @description This method verifies the aqua tree
     * @param aquaTree - The aqua tree to verify
     * @param fileObject[] - The file objects of the aqua tree that will be useful for verification
     * @returns Result<AquaOperationData, LogData[]>
     */
    verifyAquaTree: (aquaTree: AquaTree, fileObject: Array<FileObject>) => Promise<Result<AquaOperationData, LogData[]>>;
    /**
     * @method verifyAquaTreeRevision
     * @description This method verifies the aqua tree revision
     * @param aquaTree - The aqua tree to verify
     * @param revision - The revision to verify
     * @param revisionItemHash - The revision item hash to verify
     * @param fileObject[] - The file objects of the aqua tree that will be useful for verification
     * @returns Result<AquaOperationData, LogData[]>
     */
    verifyAquaTreeRevision: (aquaTree: AquaTree, revision: Revision, revisionItemHash: string, fileObject: Array<FileObject>) => Promise<Result<AquaOperationData, LogData[]>>;
    verifyAndGetGraphData: (aquaTree: AquaTree, fileObject: Array<FileObject>) => Promise<Result<VerificationGraphData, LogData[]>>;
    verifyAndGetGraphDataRevision: (aquaTree: AquaTree, revision: Revision, revisionItemHash: string, fileObject: Array<FileObject>) => Promise<Result<VerificationGraphData, LogData[]>>;
    /**
     * @method witnessAquaTree
     * @description This method witnesses the aqua tree
     * @param aquaTree - The aqua tree to witness
     * @param witnessType - The witness type to use
     * @param witnessNetwork - The witness network to use
     * @param witnessPlatform - The witness platform to use
     * @param credentials - The credentials to use
     * @param enableScalar - A boolean value to enable scalar
     * @returns Result<AquaOperationData, LogData[]>
     */
    witnessAquaTree: (aquaTree: AquaTreeWrapper, witnessType: WitnessType, witnessNetwork: WitnessNetwork, witnessPlatform: WitnessPlatformType, credentials: CredentialsData, enableScalar?: boolean) => Promise<Result<AquaOperationData, LogData[]>>;
    /**
     * @method witnessMultipleAquaTrees
     * @description This method witnesses multiple aqua trees
     * @param aquaTrees - The aqua trees to witness
     * @param witnessType - The witness type to use
     * @param witnessNetwork - The witness network to use
     * @param witnessPlatform - The witness platform to use
     * @param credentials - The credentials to use
     * @param enableScalar - A boolean value to enable scalar
     * @returns Result<AquaOperationData, LogData[]>
     */
    witnessMultipleAquaTrees: (aquaTrees: AquaTreeWrapper[], witnessType: WitnessType, witnessNetwork: WitnessNetwork, witnessPlatform: WitnessPlatformType, credentials: CredentialsData, enableScalar?: boolean) => Promise<Result<AquaOperationData, LogData[]>>;
    /**
     * @method signAquaTree
     * @description This method signs the aqua tree
     * @param aquaTree - The aqua tree to sign
     * @param signType - The sign type to use
     * @param credentials - The credentials to use
     * @param enableScalar - A boolean value to enable scalar
     * @returns Result<AquaOperationData, LogData[]>
     */
    signAquaTree: (aquaTree: AquaTreeWrapper, signType: SignType, credentials: CredentialsData, enableScalar?: boolean) => Promise<Result<AquaOperationData, LogData[]>>;
    /**
     * @method signMultipleAquaTrees
     * @description This method signs multiple aqua trees
     * @param aquaTrees - The aqua trees to sign
     * @param signType - The sign type to use
     * @param credentials - The credentials to use
     * @returns Result<AquaOperationData, LogData[]>
     */
    signMultipleAquaTrees: (aquaTrees: AquaTreeWrapper[], signType: SignType, credentials: CredentialsData) => Promise<Result<AquaOperationData, LogData[]>>;
    /**
     * @method linkAquaTree
     * @description This method links an aqua tree to another aqua tree
     * @param aquaTreeWrapper - The aqua tree to link
     * @param linkAquaTreeWrapper - The aqua tree to link to
     * @param enableScalar - A boolean value to enable scalar
     * @returns Result<AquaOperationData, LogData[]>
     */
    linkAquaTree: (aquaTreeWrapper: AquaTreeWrapper, linkAquaTreeWrapper: AquaTreeWrapper, enableScalar?: boolean) => Promise<Result<AquaOperationData, LogData[]>>;
    /**
     * @method linkMultipleAquaTrees
     * @description This method links multiple aqua trees to another aqua tree
     * @param aquaTreeWrappers - The aqua trees to link
     * @param linkAquaTreeWrapper - The aqua tree to link to
     * @param enableScalar - A boolean value to enable scalar
     * @returns Result<AquaOperationData, LogData[]>
     */
    linkMultipleAquaTrees: (aquaTreeWrappers: AquaTreeWrapper[], linkAquaTreeWrapper: AquaTreeWrapper, enableScalar?: boolean) => Promise<Result<AquaOperationData, LogData[]>>;
    /**
     * @method linkAquaTreesToMultipleAquaTrees
     * @description This method links multiple aqua trees to multiple aqua trees
     * @param aquaTreeWrappers - The aqua trees to link
     * @param linkAquaTreeWrapper - The aqua trees to link to
     * @param enableScalar - A boolean value to enable scalar
     * @returns Result<AquaOperationData, LogData[]>
     */
    linkAquaTreesToMultipleAquaTrees: (aquaTreeWrappers: AquaTreeWrapper, linkAquaTreeWrapper: AquaTreeWrapper[], enableScalar?: boolean) => Promise<Result<AquaOperationData, LogData[]>>;
    /**
     * @method createFormRevision
     * @description This method creates a form revision for the aqua tree
     * @param aquaTree - The aqua tree to create the form revision for
     * @param fileObject - The file object to create the form revision for
     * @param enableScalar - A boolean value to enable scalar
     * @returns Result<AquaOperationData, Log[]>
     */
    createFormRevision: (aquaTree: AquaTreeWrapper, fileObject: FileObject, enableScalar?: boolean) => Promise<Result<AquaOperationData, LogData[]>>;
    /**
     * @method hideFormElements
     * @description This method hides form elements
     * @param aquaTree - The aqua tree to hide form elements
     * @param keyToHide - The key to hide
     * @returns Result<AquaOperationData, LogData[]>
     */
    hideFormElements: (aquaTree: AquaTreeWrapper, keyToHide: string) => Promise<Result<AquaOperationData, LogData[]>>;
    /**
     * @method unHideFormElements
     * @description This method unhides form elements
     * @param aquaTree - The aqua tree to unhide form elements
     * @param keyToUnHide - The key to unhide
     * @param content - The content to unhide
     * @returns Result<AquaOperationData, Log[]>
     */
    unHideFormElements: (aquaTree: AquaTreeWrapper, keyToUnHide: string, content: string) => Promise<Result<AquaOperationData, LogData[]>>;
    fetchFilesToBeRead: (aquaTree: AquaTree) => string[];
    checkIfFileAlreadyNotarized: (aquaTree: AquaTree, fileObject: FileObject) => boolean;
    getRevisionByHash: (aquaTree: AquaTree, hash: string) => Result<Revision, LogData[]>;
    getLastRevision: (aquaTree: AquaTree) => Result<Revision, LogData[]>;
    getFileByHash: (aquaTree: AquaTree, hash: string) => Promise<Result<string, LogData[]>>;
    getFileHash: (fileContent: string | Uint8Array) => string;
    getVersionFromPackageJson: () => string;
    renderTree: (aquaTree: AquaTree) => void;
}
/**
 * Chainable API for Aqua operations
 *
 * This class provides a fluent interface for performing operations on Aqua Trees.
 * It allows chaining multiple operations like notarization, signing, witnessing,
 * and verification while maintaining state and collecting logs.
 *
 * @example
 * ```typescript
 * const aqua = new AquafierChainable(tree)
 *   .notarize(file)
 *   .sign("metamask", credentials)
 *   .witness("eth", "sepolia")
 *   .verify();
 * ```
 */
declare class AquafierChainable {
    /** Current Aqua Tree state */
    private value;
    /** Result of last verification operation */
    private verificationResult;
    /** Collected operation logs */
    private logs;
    /**
 * Creates a new chainable Aqua operation sequence
 *
 * @param initialValue - Optional initial Aqua Tree
 */
    constructor(initialValue: AquaTree | null);
    /**
 * Extracts Aqua Tree from operation result
 *
 * @param result - Result to unwrap
 * @returns Aqua Tree from result
 * @throws If result is Err
 */
    unwrap(result: Result<AquaOperationData, LogData[]>): AquaTree;
    /**
 * Creates a genesis revision for file notarization
 *
 * @param fileObject - File to notarize
 * @param isForm - Whether file is a form
 * @param enableContent - Whether to include content
 * @param enableScalar - Whether to enable scalar values
 * @returns This instance for chaining
 */
    notarize(fileObject: FileObject, isForm?: boolean, enableContent?: boolean, enableScalar?: boolean): Promise<this>;
    /**
 * Signs the current Aqua Tree state
 *
 * @param signType - Type of signature (cli, metamask, did)
 * @param credentials - Signing credentials
 * @param enableScalar - Whether to enable scalar values
 * @returns This instance for chaining
 */
    sign(signType?: SignType, credentials?: CredentialsData, enableScalar?: boolean): Promise<this>;
    /**
 * Witnesses the current Aqua Tree state
 *
 * @param witnessType - Type of witness (eth, tsa, nostr)
 * @param witnessNetwork - Network for witnessing
 * @param witnessPlatform - Platform for witnessing
 * @param credentials - Witness credentials
 * @param enableScalar - Whether to enable scalar values
 * @returns This instance for chaining
 */
    witness(witnessType?: WitnessType, witnessNetwork?: WitnessNetwork, witnessPlatform?: WitnessPlatformType, credentials?: CredentialsData, enableScalar?: boolean): Promise<this>;
    /**
 * Verifies the current Aqua Tree state
 *
 * @param linkedFileObject - Linked files for verification
 * @returns This instance for chaining
 */
    verify(linkedFileObject?: Array<FileObject>): Promise<this>;
    /**
 * Gets the current Aqua Tree state
 *
 * @returns Current Aqua Tree
 */
    getValue(): AquaTree;
    /**
 * Gets the result of last verification
 *
 * @returns Verification result
 */
    getVerificationValue(): Result<AquaOperationData, LogData[]>;
    /**
 * Gets all collected operation logs
 *
 * @returns Array of log entries
 */
    getLogs(): LogData[];
}

export { type AnObject, type AquaOperationData, type AquaTree, type AquaTreeWrapper, AquafierChainable, type CredentialsData, Err, ErrResult, type FileIndex, type FileObject, type FileVerificationGraphData, type FormData, type FormKeyGraphData, type FormVerificationGraphData, type FormVerificationResponseData, type GasEstimateResult, type IWitnessConfig, type LinkVerificationGraphData, type LogData, LogType, LogTypeEmojis, None, NoneOption, Ok, OkResult, type Option, OrderRevisionInAquaTree, type Result, type Revision, type RevisionGraphInfo, type RevisionTree, type RevisionType, type Revisions, type SignType, type SignatureData, type SignatureItem, type SignaturePayload, type SignatureResult, type SignatureVerificationGraphData, Some, SomeOption, type TransactionResult, type TreeMapping, type VerificationGraphData, type WitnessConfig, type WitnessEnvironment, type WitnessEthResponse, type WitnessMerkleProof, type WitnessNetwork, type WitnessNostrResponse, type WitnessNostrVerifyResult, type WitnessPlatformType, type WitnessResult, type WitnessTSAResponse, type WitnessTransactionData, type WitnessType, type WitnessVerificationGraphData, checkFileHashAlreadyNotarized, checkInternetConnection, cliGreenify, cliRedify, cliYellowfy, createCredentials, createNewAquaTree, Aquafier as default, dict2Leaves, estimateWitnessGas, findFormKey, findNextRevisionHashByArrayofRevisions, formatMwTimestamp, getEntropy, getFileHashSum, getFileNameCheckingPaths, getGenesisHash, getHashSum, getLatestVH, getMerkleRoot, getPreviousVerificationHash, getTimestamp, getWallet, isErr, isNone, isOk, isSome, log_dim, log_red, log_success, log_yellow, maybeUpdateFileIndex, prepareNonce, printGraphData, printLogs, printlinkedGraphData, recoverWalletAddress, reorderAquaTreeRevisionsProperties, reorderRevisionsProperties, verifyMerkleIntegrity };
