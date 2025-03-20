import { HDNodeWallet } from 'ethers';

type Result<T, E> = OkResult<T, E> | ErrResult<T, E>;
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
declare function Ok<T, E>(value: T): Result<T, E>;
declare function Err<T, E>(error: E): Result<T, E>;
declare function isOk<T, E>(result: Result<T, E>): result is OkResult<T, E>;
declare function isErr<T, E>(result: Result<T, E>): result is ErrResult<T, E>;
type Option<T> = SomeOption<T> | NoneOption<T>;
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
declare class NoneOption<T> {
    readonly tag: 'none';
    isSome(): this is SomeOption<T>;
    isNone(): this is NoneOption<T>;
    map<U>(_fn: (value: T) => U): Option<U>;
    unwrap(): never;
    unwrapOr(defaultValue: T): T;
}
declare function Some<T>(value: T): Option<T>;
declare function None<T>(): Option<T>;
declare function isSome<T>(option: Option<T>): option is SomeOption<T>;
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
    "did_key": string;
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
interface AquaOperationData {
    aquaTrees: AquaTree[];
    aquaTree: AquaTree | null;
    logData: Array<LogData>;
}
interface FileVerificationGraphData {
    isValidationSucessful: boolean;
}
interface FormKeyGraphData {
    formKey: string;
    content: string;
    isValidationSucessful: boolean;
}
interface FormVerificationGraphData {
    formKeys: FormKeyGraphData[];
}
interface SignatureVerificationGraphData {
    walletAddress: string;
    chainHashIsValid: boolean;
    signature: string;
    signatureType: string;
    isValidationSucessful: boolean;
}
interface WitnessVerificationGraphData {
    txHash: string;
    merkleRoot: string;
    isValidationSucessful: boolean;
}
interface LinkVerificationGraphData {
    isValidationSucessful: boolean;
}
type RevisionGraphInfo = FileVerificationGraphData | WitnessVerificationGraphData | SignatureVerificationGraphData | FormVerificationGraphData | LinkVerificationGraphData;
type RevisionGraphInfoMap = {
    file: FileVerificationGraphData;
    witness: WitnessVerificationGraphData;
    signature: SignatureVerificationGraphData;
    form: FormVerificationGraphData;
    link: LinkVerificationGraphData;
};
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
type RevisionType = "file" | "witness" | "signature" | "form" | "link";
type WitnessType = "tsa" | "eth" | "nostr";
type WitnessPlatformType = 'cli' | 'metamask';
type WitnessNetwork = "sepolia" | "mainnet" | "holesky";
type SignType = "cli" | "metamask" | "did";
type WitnessEnvironment = 'node' | 'browser';
interface FormVerificationResponseData {
    isOk: boolean;
    logs: LogData[];
    formKeysGraphData: FormKeyGraphData[];
}
interface FileObject {
    fileName: string;
    fileContent: string | AquaTree;
    path: string;
    fileSize?: number;
}
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
interface LogData {
    logType: LogType;
    log: string;
    ident?: string | null | undefined;
}
interface RevisionTree {
    hash: string;
    children: RevisionTree[];
}
interface Revision {
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
    leaves?: string[];
    [key: string]: any;
}
interface Revisions {
    [key: string]: Revision;
}
interface FileIndex {
    [key: string]: string;
}
interface FormData {
    [key: string]: string;
}
interface TreeMapping {
    paths: {
        [key: string]: string[];
    };
    latestHash: string;
}
interface AquaTreeWrapper {
    aquaTree: AquaTree;
    fileObject?: FileObject;
    revision: string;
}
interface AquaTree {
    revisions: Revisions;
    file_index: FileIndex;
    tree?: RevisionTree;
    treeMapping?: TreeMapping;
}
interface SignaturePayload {
    message: string;
}
interface SignatureResult {
    jws: SignatureData;
    key: string;
}
interface SignatureData {
    payload: string;
    signatures: SignatureItem[];
}
interface SignatureItem {
    protected: string;
    signature: string;
}
interface IWitnessConfig {
    witnessNetwork: string;
    smartContractAddress: string;
    witnessEventVerificationHash: string;
    port: number;
    host: string;
}
interface AnObject {
    [key: string]: string | number | boolean | any;
}
interface WitnessMerkleProof {
    depth?: string;
    left_leaf?: string;
    right_leaf?: string | null;
    successor?: string;
}
interface WitnessResult {
    witness_merkle_root: string;
    witness_timestamp: number;
    witness_network: string;
    witness_smart_contract_address: string;
    witness_transaction_hash: string;
    witness_sender_account_address: string;
    witness_merkle_proof: string[] | WitnessMerkleProof[];
}
interface GasEstimateResult {
    error: string | null;
    hasEnoughBalance: boolean;
    gasEstimate?: string;
    gasFee?: string;
    balance?: string;
}
interface WitnessConfig {
    witnessEventVerificationHash: string;
    witnessNetwork: WitnessNetwork;
    smartContractAddress: string;
}
interface TransactionResult {
    error: string | null;
    transactionHash?: string;
}
interface WitnessTransactionData {
    transaction_hash: string;
    wallet_address: string;
}
interface WitnessTSAResponse {
    base64Response: string;
    provider: string;
    timestamp: number;
}
interface WitnessEthResponse {
    transactionHash: string;
    walletAddress: string;
}
interface WitnessNostrResponse {
    nevent: string;
    npub: string;
    timestamp: number;
}
interface WitnessNostrVerifyResult {
    type: string;
    data: {
        id: string;
        relays?: string[];
        author?: string;
    };
}

declare function getPreviousVerificationHash(aquaTree: AquaTree, currentHash: string): string;
declare function findFormKey(revision: Revision, key: string): string;
declare function maybeUpdateFileIndex(aquaTree: AquaTree, verificationHash: string, revisionType: string, aquaFileName: string, formFileName: string, linkVerificationHash: string, linkFileName: string): Result<AquaTree, LogData[]>;
declare function dict2Leaves(obj: AnObject): string[];
declare function getFileHashSum(fileContent: string): string;
declare function getHashSum(data: string | Uint8Array): string;
declare function createNewAquaTree(): AquaTree;
declare function checkFileHashAlreadyNotarized(fileHash: string, aquaTree: AquaTree): boolean;
declare function prepareNonce(): string;
declare function getWallet(mnemonic: string): [HDNodeWallet, string, string, string];
declare function getEntropy(): Uint8Array;
declare function createCredentials(): CredentialsData;
declare function formatMwTimestamp(ts: string): string;
declare const estimateWitnessGas: (wallet_address: string, witness_event_verification_hash: string, ethNetwork: string, smart_contract_address: string, _providerUrl: string) => Promise<[GasEstimateResult, Array<LogData>]>;
declare function verifyMerkleIntegrity(merkleBranch: string[], merkleRoot: string): boolean;
declare const getMerkleRoot: (leaves: string[]) => string;
declare const getLatestVH: (aquaTree: AquaTree) => string;
declare const getTimestamp: () => string;
declare function printLogs(logs: LogData[], enableVerbose?: boolean): void;
declare function printlinkedGraphData(node: VerificationGraphData, prefix?: string, _isLast?: boolean): void;
declare function printGraphData(node: VerificationGraphData, prefix?: string, _isLast?: boolean): void;
declare function OrderRevisionInAquaTree(params: AquaTree): AquaTree;

declare function recoverWalletAddress(verificationHash: string, signature: string): string;

declare function cliRedify(content: string): string;
declare function cliYellowfy(content: string): string;
declare function cliGreenify(content: string): string;
declare function log_red(content: any): void;
declare function log_yellow(content: any): void;
declare function log_dim(content: string): void;
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
    getVersionFromPackageJson: () => string;
    renderTree: (aquaTree: AquaTree) => void;
}
declare class AquafierChainable {
    private value;
    private verificationResult;
    private logs;
    constructor(initialValue: AquaTree | null);
    unwrap(result: Result<AquaOperationData, LogData[]>): AquaTree;
    notarize(fileObject: FileObject, isForm?: boolean, enableContent?: boolean, enableScalar?: boolean): Promise<this>;
    sign(signType?: SignType, credentials?: CredentialsData, enableScalar?: boolean): Promise<this>;
    witness(witnessType?: WitnessType, witnessNetwork?: WitnessNetwork, witnessPlatform?: WitnessPlatformType, credentials?: CredentialsData, enableScalar?: boolean): Promise<this>;
    verify(linkedFileObject?: Array<FileObject>): Promise<this>;
    getValue(): AquaTree;
    getVerificationValue(): Result<AquaOperationData, LogData[]>;
    getLogs(): LogData[];
}

export { type AnObject, type AquaOperationData, type AquaTree, type AquaTreeWrapper, AquafierChainable, type CredentialsData, Err, ErrResult, type FileIndex, type FileObject, type FileVerificationGraphData, type FormData, type FormKeyGraphData, type FormVerificationGraphData, type FormVerificationResponseData, type GasEstimateResult, type IWitnessConfig, type LinkVerificationGraphData, type LogData, LogType, LogTypeEmojis, None, NoneOption, Ok, OkResult, type Option, OrderRevisionInAquaTree, type Result, type Revision, type RevisionGraphInfo, type RevisionTree, type RevisionType, type Revisions, type SignType, type SignatureData, type SignatureItem, type SignaturePayload, type SignatureResult, type SignatureVerificationGraphData, Some, SomeOption, type TransactionResult, type TreeMapping, type VerificationGraphData, type WitnessConfig, type WitnessEnvironment, type WitnessEthResponse, type WitnessMerkleProof, type WitnessNetwork, type WitnessNostrResponse, type WitnessNostrVerifyResult, type WitnessPlatformType, type WitnessResult, type WitnessTSAResponse, type WitnessTransactionData, type WitnessType, type WitnessVerificationGraphData, checkFileHashAlreadyNotarized, cliGreenify, cliRedify, cliYellowfy, createCredentials, createNewAquaTree, Aquafier as default, dict2Leaves, estimateWitnessGas, findFormKey, formatMwTimestamp, getEntropy, getFileHashSum, getHashSum, getLatestVH, getMerkleRoot, getPreviousVerificationHash, getTimestamp, getWallet, isErr, isNone, isOk, isSome, log_dim, log_red, log_success, log_yellow, maybeUpdateFileIndex, prepareNonce, printGraphData, printLogs, printlinkedGraphData, recoverWalletAddress, verifyMerkleIntegrity };
