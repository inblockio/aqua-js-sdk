import { createHash } from 'crypto';
import { AnObject, AquaObject, CredentialsData, GasEstimateResult, RevisionTree, TreeMapping } from './types';
import { ethers, HDNodeWallet } from "ethers";
import { Wallet, Mnemonic } from "ethers";
import crypto from 'crypto-browserify';




export function maybeUpdateFileIndex(aquaObject: AquaObject, verificationData: any, revisionType: string, aquaFileName: string, formFileName: string): AquaObject {
  const validRevisionTypes = ["file", "form", "link"];
  if (!validRevisionTypes.includes(revisionType)) {
    console.error(`Invalid revision type for file index: ${revisionType}`);
    process.exit(1)
    return aquaObject;
  }
  let verificationHash = "";

  switch (revisionType) {
    case "form":
      verificationHash = verificationData.verification_hash
      // fileHash = verificationData.data.file_hash
      aquaObject.file_index[verificationHash] = formFileName
      break
    case "file":
      verificationHash = verificationData.verification_hash
      // fileHash = verificationData.data.file_hash
      aquaObject.file_index[verificationHash] = aquaFileName //filename
      break
    case "link":
      console.log("FIX ME.....")
      process.exit(1)
    // const linkURIsArray = linkURIs.split(",")
    // const linkVHs = verificationData.data.link_verification_hashes
    // for (const [idx, vh] of linkVHs.entries()) {
    //   aquaObject.file_index[vh] = `${linkURIsArray[idx]}`
    // }
  }

  return aquaObject
}

export function dict2Leaves(obj: AnObject): string[] {
  return Object.keys(obj)
    .sort()  // MUST be sorted for deterministic Merkle tree
    .map((key) => getHashSum(`${key}:${obj[key]}`))
}

export function getFileHashSum(fileContent: string): string {
  return getHashSum(fileContent)
}

export function getHashSum(data: string | Buffer): string {
  return createHash('sha256').update(data).digest('hex');
}

export function createNewAquaObject(): AquaObject {
  return {
    revisions: {},
    file_index: {},
    tree: {} as RevisionTree,
    treeMapping: {} as TreeMapping
  };
}

export function checkFileHashAlreadyNotarized(fileHash: string, aquaObject: AquaObject): boolean {

  // Check if this file hash already exists in any revision
  const existingRevision = Object.values(aquaObject.revisions).find(
    (revision) => revision.file_hash && revision.file_hash === fileHash,
  );
  if (existingRevision) {
    return true;
  } else {
    return false;
  }

}

export function prepareNonce(): string {
  return getHashSum(Date.now().toString());
}

export function getWallet(mnemonic: string): [HDNodeWallet, string, string] {
  // Always trim the last new line
  const wallet = Wallet.fromPhrase(mnemonic.trim())
  const walletAddress = wallet.address.toLowerCase()
  console.log("Wallet address", wallet.privateKey)
  return [wallet, walletAddress, wallet.publicKey]
}

export function createCredentials() {
  console.log('Credential file  does not exist.Creating wallet');

  // Generate random entropy (128 bits for a 12-word mnemonic)
  const entropy = crypto.randomBytes(16);

  // Convert entropy to a mnemonic phrase
  const mnemonic = Mnemonic.fromEntropy(entropy);

  let credentialsObject: CredentialsData = {
    mnemonic: mnemonic.phrase, nostr_sk: "", "did:key": "",
    alchemy_key: "ZaQtnup49WhU7fxrujVpkFdRz4JaFRtZ", // project defualt key
    witness_eth_network: "sepolia",
    witness_eth_platform: "metamask"
  };
  try {

    return credentialsObject;
  } catch (error) {
    console.error("Failed to write mnemonic:", error)
    process.exit(1)

  }
}

export function formatMwTimestamp(ts: string) {
  // Format timestamp into the timestamp format found in Mediawiki outputs
  return ts
    .replace(/-/g, "")
    .replace(/:/g, "")
    .replace("T", "")
    .replace("Z", "")
}

export const estimateWitnessGas = async (wallet_address: string, witness_event_verification_hash: string, ethNetwork: string, smart_contract_address: string, providerUrl: string): Promise<GasEstimateResult> => {
  try {
    // Connect to Ethereum provider
    // const provider = new ethers.JsonRpcProvider(providerUrl);
    const provider = ethers.getDefaultProvider(ethNetwork)

    console.log("Replace :", witness_event_verification_hash)

    // Define the transaction
    const tx = {
      from: ethers.getAddress(wallet_address),
      to: ethers.getAddress(smart_contract_address), // Replace with actual contract address
      data: '0x9cef4ea1' + witness_event_verification_hash.replace("0x", ""), // Function selector + hash
    };

    // Get sender's balance
    const balance = await provider.getBalance(wallet_address);
    const balanceInEth = ethers.formatEther(balance);
    console.log(`Sender Balance: ${balanceInEth} ETH`);

    // Estimate gas
    const estimatedGas = await provider.estimateGas(tx);
    console.log(`Estimated Gas: ${estimatedGas.toString()} units`);

    // Get current gas price
    const feeData = await provider.getFeeData();
    console.log("Fee data: ", feeData)
    const gasPrice = feeData.gasPrice ?? BigInt(0); // This replaces getGasPrice()
    console.log(`Gas Price: ${ethers.formatUnits(gasPrice, "gwei")} Gwei`);

    // Calculate total gas fee
    const gasCost = estimatedGas * gasPrice;
    const gasCostInEth = ethers.formatEther(gasCost);
    console.log(`Estimated Gas Fee: ${gasCostInEth} ETH`);

    // Check if balance is sufficient
    const hasEnoughBalance = balance >= gasCost;

    return { error: null, gasEstimate: estimatedGas.toString(), gasFee: gasCostInEth, balance: balanceInEth, hasEnoughBalance };

  } catch (error: any) {
    console.error("Error estimating gas:", error);
    return { error: error.message, hasEnoughBalance: false };
  }
};




export const getLatestVH = (aquaObject: AquaObject) => {
  const verificationHashes = Object.keys(aquaObject.revisions)
  return verificationHashes[verificationHashes.length - 1]
}


export const getTimestamp = () => {
  const now = new Date().toISOString()
  const timestamp = formatMwTimestamp(now.slice(0, now.indexOf(".")))
  return timestamp
}