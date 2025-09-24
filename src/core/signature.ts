import {
  Revision,
  AquaOperationData,
  LogData,
  SignType,
  AquaTreeView,
  CredentialsData,
  LogType,
  SignatureData,
} from "../types"
import { MetaMaskSigner } from "../signature/sign_metamask"
import { ReactNativeMetaMaskOptions } from "../types"
import { CLISigner } from "../signature/sign_cli"
import {
  dict2Leaves,
  getHashSum,
  getMerkleRoot,
  getTimestamp,
  reorderRevisionsProperties,
} from "../utils"
import { DIDSigner } from "../signature/sign_did"
import { P12Signer } from "../signature/sign_p12"
import { createAquaTree } from "../aquatreevisualization"
import { ethers } from "ethers"
import { Err, Ok, Result } from "../type_guards"
import { SignerStrategy } from "./signer-types"

const signerStrategies: Record<SignType, SignerStrategy> = {
  metamask: new MetaMaskSigner(),
  cli: new CLISigner(),
  did: new DIDSigner(),
  p12: new P12Signer(),
}

/**
 * Signs an Aqua Tree revision using specified signature method
 *
 * @param aquaTreeView - View containing the Aqua Tree to sign
 * @param signType - Type of signature to use (metamask, cli, or did)
 * @param credentials - Credentials data required for signing
 * @param enableScalar - Optional flag to use scalar mode instead of tree mode
 * @param identCharacter - Optional identifier character for logging
 * @returns Promise resolving to either AquaOperationData on success or array of LogData on failure
 *
 * This function:
 * - Determines target revision to sign
 * - Handles different signature types (MetaMask, CLI, DID)
 * - Creates signature revision with metadata
 * - Updates Aqua Tree with signature information
 */
export async function signAquaTreeUtil(
  aquaTreeView: AquaTreeView,
  signType: SignType,
  credentials: CredentialsData,
  enableScalar: boolean = false,
  identCharacter: string = "",
  reactNativeOptions?: ReactNativeMetaMaskOptions,
): Promise<Result<AquaOperationData, LogData[]>> {
  let aquaTree = aquaTreeView.aquaTree
  let logs: Array<LogData> = []
  let targetRevisionHash = ""
  if (
    aquaTreeView.revision == undefined ||
    aquaTreeView.revision == null ||
    aquaTreeView.revision.length == 0
  ) {
    const verificationHashes = Object.keys(aquaTreeView.aquaTree.revisions)
    const lastRevisionHash = verificationHashes[verificationHashes.length - 1]
    targetRevisionHash = lastRevisionHash
  } else {
    targetRevisionHash = aquaTreeView.revision
  }

  const strategy = signerStrategies[signType]
  if (!strategy) {
    logs.push({
      log: `Unsupported sign type: ${signType}`,
      logType: LogType.ERROR,
      ident: identCharacter,
    })
    return Err(logs)
  }
  
  // Validate credentials
  const validationErrors = strategy.validate(credentials, identCharacter)
  if (validationErrors.length > 0) {
    logs.push(...validationErrors)
    return Err(logs)
  }
  
  let signature: string | SignatureData,
    walletAddress: string,
    publicKey: string,
    signature_type: string

  try {
    const result = await strategy.sign(targetRevisionHash, credentials, reactNativeOptions)
    signature = result.signature
    walletAddress = result.walletAddress
    publicKey = result.publicKey
    signature_type = result.signatureType
  } catch (error) {
    logs.push({
      log: `Signing failed: ${error}`,
      logType: LogType.ERROR,
      ident: identCharacter,
    })
    return Err(logs)
  }

  const timestamp = getTimestamp()
  let verificationDataRaw: Revision = {
    previous_verification_hash: targetRevisionHash, //previousVerificationHash,
    local_timestamp: timestamp,
    version: `https://aqua-protocol.org/docs/v3/schema_2 | SHA256 | Method: ${enableScalar ? "scalar" : "tree"}`,
    revision_type: "signature",
    signature: signature,
    signature_public_key: publicKey,
    signature_wallet_address: walletAddress,
    signature_type: signature_type,
  }

  let verificationData = reorderRevisionsProperties(verificationDataRaw)
  
  // Merklelize the dictionary
  const leaves = dict2Leaves(verificationData)

  let verification_hash = ""
  if (enableScalar) {
    verification_hash = "0x" + getHashSum(JSON.stringify(verificationData))
  } else {
    verification_hash = getMerkleRoot(leaves) //tree.getHexRoot()
    verificationData.leaves = leaves
  }

  const revisions = aquaTree.revisions
  revisions[verification_hash] = verificationData
  let aquaTreeWithTree = createAquaTree(aquaTree)
  if (!aquaTreeWithTree) {
    logs.push({
      log: "Failed to create AquaTree",
      logType: LogType.ERROR,
      ident: identCharacter,
    })
    return Err(logs)
  }

  logs.push({
    log: `AquaTree signed succesfully`,
    logType: LogType.SUCCESS,
    ident: identCharacter,
  })

  let result: AquaOperationData = {
    aquaTree: aquaTreeWithTree,
    aquaTrees: [],
    logData: logs,
  }
  return Ok(result)
}

/**
 * Signs multiple Aqua Trees (Currently unimplemented)
 *
 * @param aquaTrees - Array of Aqua Tree views to sign
 * @param signType - Type of signature to use
 * @param credentials - Credentials data required for signing
 * @param reactNativeOptions - Options for React Native MetaMask integration
 * @param enableScalar - Optional flag to use scalar mode
 * @param identCharacter - Optional identifier character for logging
 * @returns Promise resolving to either AquaOperationData on success or array of LogData on failure
 */
export async function signMultipleAquaTreesUtil(
  aquaTrees: AquaTreeView[],
  signType: SignType,
  credentials: CredentialsData,
  reactNativeOptions?: ReactNativeMetaMaskOptions,
  enableScalar: boolean = false,
  identCharacter: string = "",
): Promise<Result<AquaOperationData, LogData[]>> {

  // console log all unused parameters
  console.log("signMultipleAquaTreesUtil unused parameters:", aquaTrees, signType, credentials, reactNativeOptions, enableScalar, identCharacter)
  let logs: Array<LogData> = []
  logs.push({
    log: "unimplmented need to be fixes",
    logType: LogType.ERROR,
    ident: identCharacter,
  })

  return Err(logs)
}

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
export function recoverWalletAddress(
  verificationHash: string,
  signature: string,
): string {
  try {
    const message = `I sign this revision: [${verificationHash}]`
    const messageHash = ethers.hashMessage(message)
    const recoveredAddress = ethers.recoverAddress(messageHash, signature)
    return recoveredAddress
  } catch (error) {
    console.error("Error recovering wallet address:", error)
    throw new Error("Invalid signature or message")
  }
}

/**
 * Verifies a signature on an Aqua Tree revision
 *
 * @param data - Revision data containing signature information
 * @param verificationHash - Hash to verify signature against
 * @param identCharacter - Optional identifier character for logging
 * @returns Promise resolving to tuple of [verification success boolean, array of logs]
 *
 * This function:
 * - Validates verification hash
 * - Handles different signature types (DID, Ethereum)
 * - Verifies signature using appropriate method
 * - Logs verification results
 */
export async function verifySignature(
  data: Revision,
  verificationHash: string,
  identCharacter: string = "",
): Promise<[boolean, LogData[]]> {
  let logs: Array<LogData> = []

  // TODO enforce that the verificationHash is a correct SHA3 sum string
  // Specify signature correctness
  let signatureOk = false
  if (verificationHash === "") {
    // The verificationHash MUST NOT be empty. This also implies that a genesis revision cannot
    // contain a signature.

    logs.push({
      log: `The verificationHash MUST NOT be empty`,
      logType: LogType.ERROR,
    })

    return [signatureOk, logs]
  }

  logs.push({
    log: `Wallet address:  ${data.signature_wallet_address}`,
    logType: LogType.SIGNATURE,
    ident: identCharacter,
  })

  let signerDID = new DIDSigner()
  // Signature verification
  switch (data.signature_type) {
    case "did_key":
      signatureOk = await signerDID.verify(
        data.signature,
        data.signature_public_key!!,
        verificationHash,
      )
      break
    case "ethereum:eip-191":
      // throw new Error("Need to be verified")
      // The padded message is required
      const paddedMessage = `I sign this revision: [${verificationHash}]`
      try {
        const recoveredAddress = ethers.recoverAddress(
          ethers.hashMessage(paddedMessage),
          data.signature,
        )

        signatureOk =
          recoveredAddress.toLowerCase() ===
          data.signature_wallet_address!!.toLowerCase()
      } catch (e) {
        // continue regardless of error
        logs.push({
          log: `A critical error : ${e}`,
          logType: LogType.ERROR,
        })
      }
      break
    case "p12":
      const signerP12 = new P12Signer()
      signatureOk = await signerP12.verify(
        data.signature,
        data.signature_public_key!!,
        verificationHash,
      )
      break

  }

  return [signatureOk, logs]
}
