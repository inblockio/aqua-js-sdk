// import { createHash } from 'crypto';
import { AnObject, AquaTree, CredentialsData, GasEstimateResult, LogData, LogType, LogTypeEmojis, Revision, RevisionTree, TreeMapping, VerificationGraphData } from './types';
import { ethers, HDNodeWallet, Wallet, Mnemonic } from "ethers";
// import crypto from 'crypto-browserify';
import sha3 from "js-sha3"
import { MerkleTree } from 'merkletreejs';
import { Err, Ok, Result } from './type_guards';



export function findFormKey(revision: Revision, key: string) {
  // Look for exact match or partial match with 'forms-' prefix
  const keys = Object.keys(revision);
  return keys.find(k => k === key || k === `forms_${key}` || k.startsWith(`forms_${key}`));
}

export function maybeUpdateFileIndex(aquaTree: AquaTree, verificationHash: string, revisionType: string, aquaFileName: string, formFileName: string, linkVerificationHash: string, linkFileName: string): Result<AquaTree, LogData[]> {
  let logs: LogData[] = [];
  const validRevisionTypes = ["file", "form", "link"];
  if (!validRevisionTypes.includes(revisionType)) {
    logs.push({
      logType: LogType.ERROR,
      log: `❌ Invalid revision type for file index: ${revisionType}`
    });

    return Err(logs);
  }
  // let verificationHash = "";

  switch (revisionType) {
    case "form":
      // verificationHash = verificationData.verification_hash
      // fileHash = verificationData.data.file_hash
      aquaTree.file_index[verificationHash] = formFileName
      break
    case "file":
      // verificationHash = verificationData.verification_hash
      // fileHash = verificationData.data.file_hash
      aquaTree.file_index[verificationHash] = aquaFileName //filename
      break
    case "link":
      aquaTree.file_index[linkVerificationHash] = linkFileName

  }

  logs.push({
    logType: LogType.SUCCESS,
    log: `✅ File index of aqua tree updated successfully.`
  });


  return Ok(aquaTree)
}

export function dict2Leaves(obj: AnObject): string[] {
  return Object.keys(obj)
    .sort()  // MUST be sorted for deterministic Merkle tree
    .map((key) => getHashSum(`${key}:${obj[key]}`))
}

export function getFileHashSum(fileContent: string): string {
  return getHashSum(fileContent)
}

export function getHashSum(data: string | Uint8Array): string {
  // If data is Uint8Array, convert it to string
  const input = data instanceof Uint8Array ?
    new TextDecoder().decode(data) :
    data;
  return sha3.sha3_256(input);
}

// export function getHashSum(data: string | Buffer): string {
// return  crypto.createHash('sha256').update(data).digest('hex');
//   const input = Buffer.isBuffer(data) ? data.toString() : data;
//   return sha3.sha3_256(input);
// }

export function createNewAquaTree(): AquaTree {
  return {
    revisions: {},
    file_index: {},
    tree: {} as RevisionTree,
    treeMapping: {} as TreeMapping
  };
}

export function checkFileHashAlreadyNotarized(fileHash: string, aquaTree: AquaTree): boolean {

  // Check if this file hash already exists in any revision
  const existingRevision = Object.values(aquaTree.revisions).find(
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

// Cross-platform version
export function getEntropy(): Uint8Array {
  if (typeof window !== 'undefined' && window.crypto) {
    // Browser environment
    return crypto.getRandomValues(new Uint8Array(16));
  } else {
    // Node.js environment
    const nodeCrypto = require('crypto');
    return new Uint8Array(nodeCrypto.randomBytes(16));
  }
}
export function createCredentials() {
  console.log('Credential file  does not exist.Creating wallet');

  // Generate random entropy (128 bits for a 12-word mnemonic)
  // const entropy = crypto.randomBytes(16);
  const entropy = getEntropy();

  // Convert entropy to a mnemonic phrase
  const mnemonic = Mnemonic.fromEntropy(entropy);

  let credentialsObject: CredentialsData = {
    mnemonic: mnemonic.phrase, nostr_sk: "", "did_key": "",
    alchemy_key: "ZaQtnup49WhU7fxrujVpkFdRz4JaFRtZ", // project defualt key
    witness_eth_network: "sepolia",
    witness_method: "metamask"
  };
  try {

    return credentialsObject;
  } catch (error) {
    console.error("❌ Failed to write mnemonic:", error)
    throw Err(error)

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

export const estimateWitnessGas = async (wallet_address: string, witness_event_verification_hash: string, ethNetwork: string, smart_contract_address: string, _providerUrl: string): Promise<[GasEstimateResult, Array<LogData>]> => {
  let logData: LogData[] = []

  try {
    // Connect to Ethereum provider
    // const provider = new ethers.JsonRpcProvider(providerUrl);
    const provider = ethers.getDefaultProvider(ethNetwork)

    // Define the transaction
    const tx = {
      from: ethers.getAddress(wallet_address),
      to: ethers.getAddress(smart_contract_address), // Replace with actual contract address
      data: '0x9cef4ea1' + witness_event_verification_hash.replace("0x", ""), // Function selector + hash
    };

    // Get sender's balance
    const balance = await provider.getBalance(wallet_address);
    const balanceInEth = ethers.formatEther(balance);

    logData.push({
      log: `Sender Balance: ${balanceInEth} ETH`,
      logType: LogType.DEBUGDATA
    })

    // Estimate gas
    const estimatedGas = await provider.estimateGas(tx);

    logData.push({
      log: `Estimated Gas: ${estimatedGas.toString()} units`,
      logType: LogType.DEBUGDATA
    })

    // Get current gas price
    const feeData = await provider.getFeeData();

    logData.push({
      log: `Fee data: ", ${feeData}`,
      logType: LogType.DEBUGDATA
    })

    const gasPrice = feeData.gasPrice ? feeData.gasPrice : BigInt(0);

    logData.push({
      log: `Gas Price: ${ethers.formatUnits(gasPrice, "gwei")} Gwei`,
      logType: LogType.DEBUGDATA
    })

    // Calculate total gas fee
    const gasCost = estimatedGas * gasPrice;
    const gasCostInEth = ethers.formatEther(gasCost);

    logData.push({
      log: `Estimated Gas Fee: ${gasCostInEth} ETH`,
      logType: LogType.DEBUGDATA
    })

    // Check if balance is sufficient
    const hasEnoughBalance = balance >= gasCost;

    return [{ error: null, gasEstimate: estimatedGas.toString(), gasFee: gasCostInEth, balance: balanceInEth, hasEnoughBalance }, logData];

  } catch (error: any) {
    logData.push({
      log: `Error estimating gas: ", ${error}`,
      logType: LogType.DEBUGDATA
    })
    return [{ error: error.message, hasEnoughBalance: false }, logData];
  }
};

export function verifyMerkleIntegrity(merkleBranch: string[], merkleRoot: string): boolean {
  if (merkleBranch.length === 0) {
    return false
  }

  //
  // let prevSuccessor = null
  // for (const idx in merkleBranch) {
  //   const node = merkleBranch[idx]
  //   const leaves = [node.left_leaf, node.right_leaf]
  //   if (prevSuccessor) {
  //     if (!leaves.includes(prevSuccessor)) {
  //       return false
  //     }
  //   } else {
  //     // This means we are at the beginning of the loop.
  //     if (!leaves.includes(verificationHash)) {
  //       // In the beginning, either the left or right leaf must match the
  //       // verification hash.
  //       return false
  //     }
  //   }

  //   let calculatedSuccessor: string
  //   if (!node.left_leaf) {
  //     calculatedSuccessor = node.right_leaf
  //   } else if (!node.right_leaf) {
  //     calculatedSuccessor = node.left_leaf
  //   } else {
  //     calculatedSuccessor = getHashSum(node.left_leaf + node.right_leaf)
  //   }
  //   if (calculatedSuccessor !== node.successor) {
  //     return false
  //   }
  //   prevSuccessor = node.successor
  // }

  let witnessMerkleProofLeaves = merkleBranch

  let hexRoot = getMerkleRoot(witnessMerkleProofLeaves)
  let merkleRootOk = hexRoot === merkleRoot

  return merkleRootOk
}

export const getMerkleRoot = (leaves: string[]) => {
  const tree = new MerkleTree(leaves, getHashSum, {
    duplicateOdd: false,
  })
  const hexRoot = tree.getHexRoot()

  return hexRoot
}

export const getLatestVH = (aquaTree: AquaTree) => {
  const verificationHashes = Object.keys(aquaTree.revisions)
  return verificationHashes[verificationHashes.length - 1]
}


export const getTimestamp = () => {
  const now = new Date().toISOString()
  const timestamp = formatMwTimestamp(now.slice(0, now.indexOf(".")))
  return timestamp
}




export function printLogs(logs: LogData[], enableVerbose: boolean = true) {
  if (enableVerbose) {
    logs.forEach(element => {
      console.log(`${element.ident ? element.ident : '' } ${LogTypeEmojis[element.logType]} ${element.log}`)
    });
  } else {
    let containsError = logs.filter((element) => element.logType == "error");
    if (containsError.length > 0) {
      logs.forEach(element => {
        if (element.logType == "error") {
          console.log(`${element.ident ? element.ident : '' } ${LogTypeEmojis[element.logType]} ${element.log}`)
        }
      });
    } else {
      if (logs.length > 0) {
        let lastLog = logs[logs.length - 1];
        console.log(`${LogTypeEmojis[lastLog.logType]} ${lastLog.log}`)
      }
    }

  }
}

export function printlinkedGraphData(node: VerificationGraphData, prefix: string = "", isLast: boolean = true): void {
    // Log the current node's hash
    let revisionTypeEmoji = LogTypeEmojis[node.revisionType]
    let isSuccessorFailureEmoji = node.isValidationSucessful ? LogTypeEmojis['success'] : LogTypeEmojis['error']
    // console.log(`${prefix} ${isLast ? "└ " : "├ "}${isSuccessorFailureEmoji.trim()} ${revisionTypeEmoji.trim()} ${node.hash}`);
    console.log(`${prefix}└${isSuccessorFailureEmoji.trim()} ${revisionTypeEmoji.trim()} ${node.hash}`);


    if(node.revisionType === "link"){
      console.log(`${prefix}\t\tTree ${node.hash.slice(-4)}`)
      for (let i = 0; i < node.linkVerificationGraphData.length; i++) {
        const el = node.linkVerificationGraphData[i];
        printlinkedGraphData(el, `${prefix}\t\t`, false)
      }
    }

    // Update the prefix for children
    const newPrefix = prefix  + (isLast ? "\t" : "\t");

    // Recursively log each child
    node.verificationGraphData.forEach((child, index) => {
        const isChildLast = index === node.verificationGraphData.length - 1;
        printlinkedGraphData(child, newPrefix, !isChildLast);
    });
}

export function printGraphData(node: VerificationGraphData, prefix: string = "", isLast: boolean = true): void {
    // Log the current node's hash
    let revisionTypeEmoji = LogTypeEmojis[node.revisionType]
    let isSuccessorFailureEmoji = node.isValidationSucessful ? LogTypeEmojis['success'] : LogTypeEmojis['error']
    // console.log(`${prefix}${isLast ? "└ " : "├ "}${isSuccessorFailureEmoji.trim()} ${revisionTypeEmoji.trim()} ${node.hash}`);
    console.log(`└${isSuccessorFailureEmoji.trim()} ${revisionTypeEmoji.trim()} ${node.hash}`);

    if(node.revisionType === "link"){
      console.log(`${prefix}\tTree ${node.hash.slice(-4)}`)
      for (let i = 0; i < node.linkVerificationGraphData.length; i++) {
        const el = node.linkVerificationGraphData[i];
        printlinkedGraphData(el, `${prefix}\t`, false)
      }
    }

    

    // Update the prefix for children
    const newPrefix = prefix + (isLast ? "\t" : "\t|");

    // Recursively log each child
    node.verificationGraphData.forEach((child, index) => {
        // const isChildLast = index === node.verificationGraphData.length - 1;
        printGraphData(child, newPrefix, false);
    });
}