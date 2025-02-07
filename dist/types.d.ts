import { Option } from "rustic";
export interface CredentialsData {
    mnemonic: string;
    nostr_sk: string;
    "did:key": string;
    alchemy_key: string;
    witness_eth_network: string;
    witness_eth_platform: string;
}
export interface AquaOperationData {
    aquaObjects: Option<AquaObject[]>;
    aquaObject: Option<AquaObject>;
    logData: Array<LogData>;
}
export type RevisionType = "file" | "witness" | "signature" | "form" | "link";
export type WitnessType = "tsa" | "eth" | "nostr";
export type WitnessPlatformType = 'cli' | 'metamask';
export type WitnessNetwork = "sepolia" | "mainnet" | "holesky";
export type SignType = "cli" | "metamask" | "did";
export type WitnessEnvironment = 'node' | 'browser';
export interface FileObject {
    fileName: string;
    fileContent: string;
    path: string;
}
export declare enum LogType {
    SUCCESS = 0,
    INFO = 1,
    ERROR = 2,
    WARNING = 3,
    HINT = 4,
    file = 5,
    link = 6,
    signature = 7,
    witness = 8,
    form = 9,
    scalar = 10
}
export interface LogData {
    logType: LogType;
    log: string;
}
export interface RevisionTree {
    hash: string;
    children: RevisionTree[];
}
export interface Revision {
    previous_verification_hash: string;
    local_timestamp: string;
    revision_type: "file" | "witness" | "signature" | "form" | "link";
    file_hash?: string;
    file_nonce?: string;
    witness_merkle_root?: string;
    witness_timestamp?: number;
    witness_network?: string;
    witness_smart_contract_address?: string;
    witness_transaction_hash?: string;
    witness_sender_account_address?: string;
    witness_merkle_proof?: string[];
    signature?: string | SignatureData;
    signature_public_key?: string;
    signature_wallet_address?: string;
    signature_type?: string;
    [key: string]: any;
}
export interface Revisions {
    [key: string]: Revision;
}
export interface FileIndex {
    [key: string]: string;
}
export interface TreeMapping {
    paths: {
        [key: string]: string[];
    };
    latestHash: string;
}
export interface AquaObjectWrapper {
    aquaObject: AquaObject;
    fileObject: FileObject;
    revision: string;
}
export interface AquaObject {
    revisions: Revisions;
    file_index: FileIndex;
    tree?: RevisionTree;
    treeMapping?: TreeMapping;
}
export interface SignaturePayload {
    message: string;
}
export interface SignatureResult {
    jws: SignatureData;
    key: string;
}
export interface SignatureData {
    payload: string;
    signatures: SignatureItem[];
}
export interface SignatureItem {
    protected: string;
    signature: string;
}
export interface IWitnessConfig {
    witnessNetwork: string;
    smartContractAddress: string;
    witnessEventVerificationHash: string;
    port: number;
    host: string;
}
export interface AnObject {
    [key: string]: string | number | boolean | any;
}
export interface WitnessMerkleProof {
    depth?: string;
    left_leaf?: string;
    right_leaf?: string | null;
    successor?: string;
}
export interface WitnessResult {
    witness_merkle_root: string;
    witness_timestamp: number;
    witness_network: string;
    witness_smart_contract_address: string;
    witness_transaction_hash: string;
    witness_sender_account_address: string;
    witness_merkle_proof: string[] | WitnessMerkleProof[];
}
export interface GasEstimateResult {
    error: string | null;
    hasEnoughBalance: boolean;
    gasEstimate?: string;
    gasFee?: string;
    balance?: string;
}
export interface WitnessConfig {
    witnessEventVerificationHash: string;
    witnessNetwork: WitnessNetwork;
    smartContractAddress: string;
}
export interface TransactionResult {
    error: string | null;
    transactionHash?: string;
}
export interface WitnessTransactionData {
    transaction_hash: string;
    wallet_address: string;
}
export interface WitnessTSAResponse {
    base64Response: string;
    provider: string;
    timestamp: number;
}
export interface WitnessEthResponse {
    transactionHash: string;
    walletAddress: string;
}
export interface WitnessNostrResponse {
    nevent: string;
    npub: string;
    timestamp: number;
}
export interface WitnessNostrVerifyResult {
    type: string;
    data: {
        id: string;
        relays?: string[];
        author?: string;
    };
}
