import { Option } from "rustic";

export interface CredentialsData {
  mnemonic: string;
  nostr_sk: string;
  "did:key": string;
  alchemy_key : string,
  witness_eth_network: string;
  witness_eth_platform: string;
}

export interface AquaOperationData {
  aquaObject :Option<AquaObject> 
  logData : Array<LogData>
}

export type RevisionType =   "file" | "witness" | "sign" | "form" | "link"

export interface FileObject {
  fileName : string,
  fileContent : string
}

export enum LogType {
  INFO,
  ERROR,
  WARNING,
  HINT,
  file,
  link,
  signature,
  witness,
  form,
  scalar
}
export interface LogData {
  logType : LogType,
  log : string
}



export interface RevisionTree {
  hash: string
  children: RevisionTree[]
}


export interface Revision {
  previous_verification_hash: string;
  local_timestamp: string;
  revision_type: "file" | "witness";
  file_hash?: string;
  file_nonce?: string;
  witness_merkle_root?: string;
  witness_timestamp?: number;
  witness_network?: string;
  witness_smart_contract_address?: string;
  witness_transaction_hash?: string;
  witness_sender_account_address?: string;
  witness_merkle_proof?: string[];
  signature: string;
  signature_public_key: string;
  signature_wallet_address: string;
  signature_type: string;
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

export interface AquaObject {
  revisions: Revisions;
  file_index: FileIndex;
  tree : RevisionTree;
  treeMapping :  TreeMapping;
}

export const WitnessEnvironment = {
  NODE: 'node',
  BROWSER: 'browser'
};

export interface SignaturePayload {
  message: string;
}

export interface SignatureResult {
  jws: SignatureData; // Using 'any' here as the JWS type isn't exported from dids
  key: string;
}


export interface SignatureData {
  payload:    string;
  signatures: SignatureItem[];
}

export interface SignatureItem {
  protected: string;
  signature: string;
}
