import {
  Revision,
  AquaOperationData,
  LogData,
  SignType,
  AquaTreeWrapper,
  CredentialsData,
  LogType,
  SignatureData,
} from "../types"
import { MetaMaskSigner } from "../signature/sign_metamask"
import { ReactNativeMetaMaskOptions } from "../types"
import { CLISigner } from "../signature/sign_cli"
import {
  dict2Leaves,
  formatMwTimestamp,
  getHashSum,
  getMerkleRoot,
  getWallet,
  reorderRevisionsProperties,
} from "../utils"
import { DIDSigner } from "../signature/sign_did"
import { P12Signer } from "../signature/sign_p12"
import { createAquaTree } from "../aquavhtree"
import { ethers } from "ethers"
import { Err, Ok, Result } from "../type_guards"

/**
 * Signs an Aqua Tree revision using specified signature method
 *
 * @param aquaTreeWrapper - Wrapper containing the Aqua Tree to sign
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
  aquaTreeWrapper: AquaTreeWrapper,
  signType: SignType,
  credentials: CredentialsData,
  enableScalar: boolean = false,
  identCharacter: string = "",
  reactNativeOptions?: ReactNativeMetaMaskOptions,
): Promise<Result<AquaOperationData, LogData[]>> {
  let aquaTree = aquaTreeWrapper.aquaTree
  let logs: Array<LogData> = []
  let targetRevisionHash = ""
  if (
    aquaTreeWrapper.revision == undefined ||
    aquaTreeWrapper.revision == null ||
    aquaTreeWrapper.revision.length == 0
  ) {
    const verificationHashes = Object.keys(aquaTreeWrapper.aquaTree.revisions)
    const lastRevisionHash = verificationHashes[verificationHashes.length - 1]
    targetRevisionHash = lastRevisionHash
  } else {
    targetRevisionHash = aquaTreeWrapper.revision
  }

  let signature: string | SignatureData,
    walletAddress: string,
    publicKey: string,
    signature_type: string

  switch (signType) {
    case "metamask":
      let sign = new MetaMaskSigner({
        reactNativeOptions: reactNativeOptions
      })
      ;[signature, walletAddress, publicKey] =
        await sign.sign(targetRevisionHash, credentials.witness_eth_network)
      signature_type = "ethereum:eip-191"
      break
    case "cli":
      try {
        // const credentials = readCredentials()

        if (credentials == null || credentials == undefined) {
          logs.push({
            log: "Credentials not found ",
            logType: LogType.ERROR,
            ident: identCharacter,
          })
          return Err(logs)
        }
        let [wallet, _walletAddress, _publicKey] = await getWallet(
          credentials.mnemonic,
        )

        let sign = new CLISigner()
        signature = await sign.doSign(wallet, targetRevisionHash)
        walletAddress = _walletAddress
        publicKey = _publicKey
      } catch (error) {
        logs.push({
          log: "Failed to read mnemonic:" + error,
          logType: LogType.ERROR,
          ident: identCharacter,
        })
        return Err(logs)
      }
      signature_type = "ethereum:eip-191"
      break
    case "did":
      // const credentials = readCredentials()
      if (
        credentials == null ||
        credentials == undefined ||
        credentials["did_key"].length === 0 ||
        !credentials["did_key"]
      ) {
        logs.push({
          log: "DID key is required.  Please get a key from https://hub.ebsi.eu/tools/did-generator",
          logType: LogType.ERROR,
          ident: identCharacter,
        })
        return Err(logs)
      }

      let did = new DIDSigner()
      const { jws, key } = await did.sign(
        targetRevisionHash,
        Buffer.from(credentials["did_key"], "hex"),
      )
      signature = jws //jws.payload
      walletAddress = key
      publicKey = key
      signature_type = "did_key"
      break
    case "p12":
      // TODO implement credential validation like above
      const p12signer = new P12Signer()
      const { signature: _signature, pubKey } = await p12signer.sign(targetRevisionHash, credentials["p12_content"], credentials["p12_password"])
      signature = _signature
      walletAddress = pubKey
      publicKey = pubKey
      signature_type = "p12"
      break
  }

  const now = new Date().toISOString()
  const timestamp = formatMwTimestamp(now.slice(0, now.indexOf(".")))
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
 * @param aquaTrees - Array of Aqua Tree wrappers to sign
 * @param signType - Type of signature to use
 * @param credentials - Credentials data required for signing
 * @param reactNativeOptions - Options for React Native MetaMask integration
 * @param enableScalar - Optional flag to use scalar mode
 * @param identCharacter - Optional identifier character for logging
 * @returns Promise resolving to either AquaOperationData on success or array of LogData on failure
 */
export async function signMultipleAquaTreesUtil(
  aquaTrees: AquaTreeWrapper[],
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
