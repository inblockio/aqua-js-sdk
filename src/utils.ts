import {
  AnObject,
  AquaTree,
  CredentialsData,
  FileObject,
  GasEstimateResult,
  LogData,
  LogType,
  LogTypeEmojis,
  Revision,
  Revisions,
  RevisionTree,
  TreeMapping,
  VerificationGraphData,
} from "./types"
import { ethers, HDNodeWallet, Wallet, Mnemonic } from "ethers"
import shajs from "sha.js"
import { MerkleTree } from "merkletreejs"
import { Err, Ok, Result } from "./type_guards"


export function reorderRevisionsProperties(revision: Revision): Revision {
  const reordered: Revision = {} as Revision

  // Sort keys alphabetically
  const sortedKeys = Object.keys(revision).sort() as (keyof Revision)[]

  // Add all properties in alphabetical order
  for (const key of sortedKeys) {
    reordered[key] = revision[key]
  }

  return reordered
}

export function reorderAquaTreeRevisionsProperties(aquaTree: AquaTree): AquaTree {
  const reorderedRevisions: Revisions = {}

  for (const [hash, revision] of Object.entries(aquaTree.revisions)) {
    // Reorder each revision's properties alphabetically
    reorderedRevisions[hash] = reorderRevisionsProperties(revision)
  }

  return {
    ...aquaTree,
    revisions: reorderedRevisions,
  }
}

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
export function getPreviousVerificationHash(
  aquaTree: AquaTree,
  currentHash: string,
): string {
  let previousHash = ""

  let hashes = Object.keys(aquaTree.revisions)

  let index = hashes.indexOf(currentHash)

  if (index > 0) {
    previousHash = hashes[index - 1]
  }

  return previousHash
}
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
export function findFormKey(revision: Revision, key: string) {
  // Look for exact match or partial match with 'forms-' prefix
  const keys = Object.keys(revision)
  return keys.find(
    (k) => k === key || k === `forms_${key}` || k.startsWith(`forms_${key}`),
  )
}

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
export function maybeUpdateFileIndex(
  aquaTree: AquaTree,
  verificationHash: string,
  revisionType: string,
  aquaFileName: string,
  formFileName: string,
  linkVerificationHash: string,
  linkFileName: string,
): Result<AquaTree, LogData[]> {
  let logs: LogData[] = []
  const validRevisionTypes = ["file", "form", "link"]
  if (!validRevisionTypes.includes(revisionType)) {
    logs.push({
      logType: LogType.ERROR,
      log: `❌ Invalid revision type for file index: ${revisionType}`,
    })

    return Err(logs)
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
    log: `✅ File index of aqua tree updated successfully.`,
  })

  return Ok(aquaTree)
}

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
export function dict2Leaves(obj: AnObject): string[] {
  return Object.keys(obj)
    .sort() // MUST be sorted for deterministic Merkle tree
    .map((key) => getHashSum(`${key}:${obj[key]}`))
}

/**
 * Calculates hash sum of file content
 *
 * @param fileContent - Content to hash
 * @returns SHA-256 hash of content
 *
 * This function provides a consistent way to
 * hash file contents across the SDK.
 */
export function getFileHashSum(fileContent: string): string {
  return getHashSum(fileContent)
}

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
export function getHashSum(data: string | Uint8Array): string {
  let hash = shajs("sha256").update(data).digest("hex")
  return hash
}

// export function getHashSum(data: string | Buffer): string {
// return  crypto.createHash('sha256').update(data).digest('hex');
//   const input = Buffer.isBuffer(data) ? data.toString() : data;
//   return sha3.sha3_256(input);
// }

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
export function createNewAquaTree(): AquaTree {
  return {
    revisions: {},
    file_index: {},
    tree: {} as RevisionTree,
    treeMapping: {} as TreeMapping,
  }
}

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
export function checkFileHashAlreadyNotarized(
  fileHash: string,
  aquaTree: AquaTree,
): boolean {
  // Check if this file hash already exists in any revision
  const existingRevision = Object.values(aquaTree.revisions).find(
    (revision) => revision.file_hash && revision.file_hash === fileHash,
  )
  if (existingRevision) {
    return true
  } else {
    return false
  }
}

/**
 * Generates a nonce using current timestamp
 *
 * @returns Hash of current timestamp
 *
 * This function creates a unique nonce for
 * operations that require randomization.
 */
export function prepareNonce(): string {
  return getHashSum(Date.now().toString())
}

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
export async function getWallet(
  mnemonic: string,
): Promise<[HDNodeWallet, string, string, string]> {
  // Always trim the last new line
  const wallet = Wallet.fromPhrase(mnemonic.trim())
  // const walletAddress = wallet.address //.toLowerCase()
  const { ethers } = await import("ethers")
  const walletAddress = ethers.getAddress(wallet.address)
  return [wallet, walletAddress, wallet.publicKey, wallet.privateKey]
}

// Cross-platform version
/**
 * Generates cryptographically secure random bytes
 *
 * @returns 16 bytes of entropy
 *
 * This function:
 * - Works in both browser and Node.js
 * - Uses appropriate crypto API for environment
 * - Used for mnemonic generation
 * 
 */
export function getEntropy(): Uint8Array {
  if (typeof window !== "undefined" && window.crypto) {
    // Browser environment
    return crypto.getRandomValues(new Uint8Array(16))
  } else {
    // Node.js environment
    const nodeCrypto = require("crypto")
    return new Uint8Array(nodeCrypto.randomBytes(16))
  }
}

export const getFileNameCheckingPaths = (fileObjects: Array<FileObject>, fileName: string): FileObject | undefined => {
  let fileObjectItem = fileObjects.find((e) => {

    if (e.fileName.includes("/") || fileName.includes("/")) {

      let eFileName = e.fileName
      let parentFileName = fileName
      if (e.fileName.includes("/")) {
        eFileName = e.fileName.split('/').pop();
      }
      if (fileName.includes("/")) {
        parentFileName = fileName.split('/').pop()
      }

      return eFileName == parentFileName
    } else {

      return e.fileName == fileName
    }
  })
  return fileObjectItem

}
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
export function createCredentials() {
  console.log("Credential file  does not exist.Creating wallet")

  // Generate random entropy (128 bits for a 12-word mnemonic)
  // const entropy = crypto.randomBytes(16);
  const entropy = getEntropy()

  // Convert entropy to a mnemonic phrase
  const mnemonic = Mnemonic.fromEntropy(entropy)

  let credentialsObject: CredentialsData = {
    mnemonic: mnemonic.phrase,
    nostr_sk: "",
    did_key: "",
    alchemy_key: "ZaQtnup49WhU7fxrujVpkFdRz4JaFRtZ", // project defualt key
    witness_eth_network: "sepolia",
    witness_method: "metamask",
  }
  try {
    return credentialsObject
  } catch (error) {
    console.error("❌ Failed to write mnemonic:", error)
    throw Err(error)
  }
}

/**
 * Formats timestamp into MediaWiki format
 *
 * @param ts - ISO timestamp string
 * @returns Formatted timestamp string
 *
 * This function converts ISO timestamps into
 * the format used in MediaWiki outputs.
 */
export function formatMwTimestamp(ts: string) {
  // Format timestamp into the timestamp format found in Mediawiki outputs
  return ts
    .replace(/-/g, "")
    .replace(/:/g, "")
    .replace("T", "")
    .replace("Z", "")
}

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
export const estimateWitnessGas = async (
  wallet_address: string,
  witness_event_verification_hash: string,
  ethNetwork: string,
  smart_contract_address: string,
  _providerUrl: string,
): Promise<[GasEstimateResult, Array<LogData>]> => {
  let logData: LogData[] = []

  try {
    // Connect to Ethereum provider
    // const provider = new ethers.JsonRpcProvider(providerUrl);
    const provider = ethers.getDefaultProvider(ethNetwork)

    // Define the transaction
    const tx = {
      from: ethers.getAddress(wallet_address),
      to: ethers.getAddress(smart_contract_address), // Replace with actual contract address
      data: "0x9cef4ea1" + witness_event_verification_hash.replace("0x", ""), // Function selector + hash
    }

    // Get sender's balance
    const balance = await provider.getBalance(wallet_address)
    const balanceInEth = ethers.formatEther(balance)

    logData.push({
      log: `Sender Balance: ${balanceInEth} ETH`,
      logType: LogType.DEBUGDATA,
    })

    // Estimate gas
    const estimatedGas = await provider.estimateGas(tx)

    logData.push({
      log: `Estimated Gas: ${estimatedGas.toString()} units`,
      logType: LogType.DEBUGDATA,
    })

    // Get current gas price
    const feeData = await provider.getFeeData()

    logData.push({
      log: `Fee data: ", ${feeData}`,
      logType: LogType.DEBUGDATA,
    })

    const gasPrice = feeData.gasPrice ? feeData.gasPrice : BigInt(0)

    logData.push({
      log: `Gas Price: ${ethers.formatUnits(gasPrice, "gwei")} Gwei`,
      logType: LogType.DEBUGDATA,
    })

    // Calculate total gas fee
    const gasCost = estimatedGas * gasPrice
    const gasCostInEth = ethers.formatEther(gasCost)

    logData.push({
      log: `Estimated Gas Fee: ${gasCostInEth} ETH`,
      logType: LogType.DEBUGDATA,
    })

    // Check if balance is sufficient
    const hasEnoughBalance = balance >= gasCost

    return [
      {
        error: null,
        gasEstimate: estimatedGas.toString(),
        gasFee: gasCostInEth,
        balance: balanceInEth,
        hasEnoughBalance,
      },
      logData,
    ]
  } catch (error: any) {
    logData.push({
      log: `Error estimating gas: ", ${error}`,
      logType: LogType.DEBUGDATA,
    })
    return [{ error: error.message, hasEnoughBalance: false }, logData]
  }
}

export function verifyMerkleIntegrity(
  merkleBranch: string[],
  merkleRoot: string,
): boolean {
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

/**
 * Checks if the system has an internet connection
 * Works in both browser and Node.js environments
 * @returns Promise<boolean> indicating if internet is available
 */
export async function checkInternetConnection(): Promise<boolean> {
  // Check if we're in a browser environment
  if (typeof window !== "undefined" && window.navigator) {
    // Browser environment check
    return new Promise<boolean>((resolve) => {
      // Navigator.onLine is a quick check but not always reliable
      const isOnline = window.navigator.onLine

      if (!isOnline) {
        // If navigator.onLine reports offline, we can be confident there's no connection
        resolve(false)
        return
      }

      // If navigator.onLine reports online, perform a fetch to confirm
      // Use a small endpoint that's likely to be available
      fetch("https://www.google.com/favicon.ico", {
        mode: "no-cors",
        cache: "no-store",
      })
        .then(() => resolve(true))
        .catch(() => resolve(false))

      // Set a timeout in case the fetch hangs
      setTimeout(() => resolve(false), 5000)
    })
  } else {
    // Node.js environment check
    try {
      // Dynamic import for Node.js modules to maintain browser compatibility
      const { request } = await import("https")

      return new Promise<boolean>((resolve) => {
        const req = request(
          "https://www.google.com",
          { method: "HEAD", timeout: 5000 },
          (res) => {
            resolve(res.statusCode >= 200 && res.statusCode < 300)
            res.resume()
          },
        )

        req.on("error", () => resolve(false))
        req.on("timeout", () => {
          req.destroy()
          resolve(false)
        })

        req.end()
      })
    } catch (error) {
      return false
    }
  }
}

export function printLogs(logs: LogData[], enableVerbose: boolean = true) {
  if (enableVerbose) {
    logs.forEach((element) => {
      console.log(
        `${element.ident ? element.ident : ""} ${LogTypeEmojis[element.logType]} ${element.log}`,
      )
    })
  } else {
    let containsError = logs.filter((element) => element.logType == "error")
    if (containsError.length > 0) {
      logs.forEach((element) => {
        if (element.logType == "error") {
          console.log(
            `${element.ident ? element.ident : ""} ${LogTypeEmojis[element.logType]} ${element.log}`,
          )
        }
      })
    } else {
      if (logs.length > 0) {
        let lastLog = logs[logs.length - 1]
        console.log(`${LogTypeEmojis[lastLog.logType]} ${lastLog.log}`)
      }
    }
  }
}

export function printlinkedGraphData(
  node: VerificationGraphData,
  prefix: string = "",
  _isLast: boolean = true,
): void {
  // Log the current node's hash
  let revisionTypeEmoji = LogTypeEmojis[node.revisionType]
  let isSuccessorFailureEmoji = node.isValidationSucessful
    ? LogTypeEmojis["success"]
    : LogTypeEmojis["error"]
  // console.log(`${prefix} ${isLast ? "└ " : "├ "}${isSuccessorFailureEmoji.trim()} ${revisionTypeEmoji.trim()} ${node.hash}`);
  console.log(
    `${prefix}└${isSuccessorFailureEmoji.trim()} ${revisionTypeEmoji.trim()} ${node.hash}`,
  )

  if (node.revisionType === "link") {
    console.log(`${prefix}\tTree ${node.hash.slice(-4)}`)
    for (let i = 0; i < node.linkVerificationGraphData.length; i++) {
      const el = node.linkVerificationGraphData[i]
      printlinkedGraphData(el, `${prefix}\t`, false)
    }
  }

  // Update the prefix for children
  const newPrefix = prefix //+ (isLast ? "\t" : "\t");

  // Recursively log each child
  node.verificationGraphData.forEach((child, index) => {
    const isChildLast = index === node.verificationGraphData.length - 1
    printlinkedGraphData(child, newPrefix, !isChildLast)
  })
}

export function printGraphData(
  node: VerificationGraphData,
  prefix: string = "",
  _isLast: boolean = true,
): void {
  // Log the current node's hash
  let revisionTypeEmoji = LogTypeEmojis[node.revisionType]
  let isSuccessorFailureEmoji = node.isValidationSucessful
    ? LogTypeEmojis["success"]
    : LogTypeEmojis["error"]
  // console.log(`${prefix}${isLast ? "└ " : "├ "}${isSuccessorFailureEmoji.trim()} ${revisionTypeEmoji.trim()} ${node.hash}`);
  console.log(
    `└${isSuccessorFailureEmoji.trim()} ${revisionTypeEmoji.trim()} ${node.hash}`,
  )

  if (node.revisionType === "link") {
    console.log(`${prefix}\tTree ${node.hash.slice(-4)}`)
    for (let i = 0; i < node.linkVerificationGraphData.length; i++) {
      const el = node.linkVerificationGraphData[i]
      printlinkedGraphData(el, `${prefix}\t`, false)
    }
  }

  // Update the prefix for children
  const newPrefix = prefix //+ (isLast ? "\t" : "\t");

  // Recursively log each child
  node.verificationGraphData.forEach((child, _index) => {
    // const isChildLast = index === node.verificationGraphData.length - 1;
    printGraphData(child, newPrefix, false)
  })
}

export function OrderRevisionInAquaTree(params: AquaTree): AquaTree {
  let allHashes = Object.keys(params.revisions)
  let orderdHashes: Array<string> = []
  if (allHashes.length == 1) {
    return params
  }

  //more than one  revision
  for (let hash of allHashes) {
    let revision = params.revisions[hash]
    if (revision.previous_verification_hash == "") {
      orderdHashes.push(hash)
      break
    }
  }

  while (true) {
    // find next revision
    let nextRevisionHash = findNextRevisionHash(
      orderdHashes[orderdHashes.length - 1],
      params,
    )
    if (nextRevisionHash == "") {
      break
    } else {
      orderdHashes.push(nextRevisionHash)
    }
  }

  // construct the new aqua tree with orderd revision
  let newAquaTree: AquaTree = {
    ...params,
    revisions: {},
  }

  for (let hash of orderdHashes) {
    let revision = params.revisions[hash]
    newAquaTree.revisions[hash] = revision
  }

  return newAquaTree
}


export function getGenesisHash(aquaTree: AquaTree): string | null {
  let aquaTreeGenesisHash: string | null = null;
  let allAquuaTreeHashes = Object.keys(aquaTree!.revisions);

  for (let hash of allAquuaTreeHashes) {
    let revisionItem = aquaTree!.revisions[hash];
    if (revisionItem.previous_verification_hash == "" || revisionItem.previous_verification_hash == null || revisionItem.previous_verification_hash == undefined) {

      aquaTreeGenesisHash = hash //revisionItem.previous_verification_hash
      break;

    }
  }

  return aquaTreeGenesisHash
}

// export function OrderRevisionsArray(revisions: Array<Revision>): Array<Revision> {
//   // let allHashes = Object.keys(revisions)
//   let orderdHashes: Array<Revision> = []
//   if (revisions.length == 1) {
//     return revisions
//   }

//   //more than one  revision
//   for (let revision of revisions) {
//     if (revision.previous_verification_hash == "") {
//       orderdHashes.push(revision)
//       break
//     }
//   }

//   while (true) {
//     // find next revision
//     let nextRevisionHash = findNextRevisionHashByArrayofRevisions(
//       orderdHashes[orderdHashes.length - 1],
//       params,
//     )
//     if (nextRevisionHash == "") {
//       break
//     } else {
//       orderdHashes.push(nextRevisionHash)
//     }
//   }

//   // construct the new aqua tree with orderd revision
//   let newAquaTree: AquaTree = {
//     ...params,
//     revisions: {},
//   }

//   for (let hash of orderdHashes) {
//     let revision = params.revisions[hash]
//     newAquaTree.revisions[hash] = revision
//   }

//   return newAquaTree
// }

function findNextRevisionHash(
  previousVerificationHash: string,
  aquaTree: AquaTree,
): string {
  let hashOfRevision = ""

  let allHashes = Object.keys(aquaTree.revisions)
  for (let hash of allHashes) {
    let revision = aquaTree.revisions[hash]
    if (revision.previous_verification_hash == previousVerificationHash) {
      hashOfRevision = hash
      break
    }
  }
  return hashOfRevision
}


export function findNextRevisionHashByArrayofRevisions(
  previousVerificationHash: string,
  revisions: Array<Revision>,
): Revision | null {
  let revisionItem: Revision | null = null;

  // let allHashes = Object.keys(revisions)

  for (let revision of revisions) {
    if (revision.previous_verification_hash == previousVerificationHash) {
      revisionItem = revision
      break
    }
  }
  return revisionItem
}