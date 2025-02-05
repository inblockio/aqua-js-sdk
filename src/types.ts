export interface CredentialsData {
  mnemonic: string;
  nostr_sk: string;
  "did:key": string;
  witness_eth_network: string;
  witness_eth_platform: string;
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

export interface RevisionData {
  revisions: Revisions;
  file_index: FileIndex;
}

