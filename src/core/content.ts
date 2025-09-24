import {
  AquaTree,
  AquaTreeView,
  AquaOperationData,
  FileObject,
  LogData,
  LogType,
} from "../types"
import {
  checkFileHashAlreadyNotarized,
  dict2Leaves,
  getHashSum,
  getMerkleRoot,
  getTimestamp,
  maybeUpdateFileIndex,
  prepareNonce,
} from "../utils"
import { reorderAquaTreeRevisionsProperties } from "../utils"
import { createAquaTree } from "../aquatreevisualization"
import { Err, Ok, Result } from "../type_guards"

/**
 * Creates a new content revision in the Aqua Tree
 *
 * @param aquaTreeView - View containing the Aqua Tree data structure
 * @param fileObject - Object containing file information (fileName and fileContent)
 * @param enableScalar - Boolean flag to determine if scalar mode should be used instead of tree mode
 * @returns Promise resolving to either AquaOperationData on success or array of LogData on failure
 *
 * This function:
 * - Generates timestamp and revision metadata
 * - Checks if file is already notarized
 * - Creates verification data including file hash and nonce
 * - Updates the Aqua Tree with new revision
 * - Updates file index if needed
 */
export async function createContentRevisionUtil(
  aquaTreeView: AquaTreeView,
  fileObject: FileObject,
  enableScalar: boolean,
): Promise<Result<AquaOperationData, LogData[]>> {
  let logs: Array<LogData> = []

  const timestamp = getTimestamp()
  let revisionType = "file"

  const verificationHashes = Object.keys(aquaTreeView.aquaTree.revisions)
  let lastRevisionHash = verificationHashes[verificationHashes.length - 1]

  let verificationData: any = {
    previous_verification_hash: lastRevisionHash,
    local_timestamp: timestamp,
    revision_type: revisionType,
  }

  let fileHash = getHashSum(fileObject.fileContent as string)

  let alreadyNotarized = checkFileHashAlreadyNotarized(
    fileHash,
    aquaTreeView.aquaTree,
  )

  if (alreadyNotarized) {
    logs.push({
      log: `File ${fileObject.fileName} has already been notarized.`,
      logType: LogType.ERROR,
    })
    return Err(logs)
  }

  verificationData["content"] = fileObject.fileContent
  verificationData["file_hash"] = fileHash
  verificationData["file_nonce"] = prepareNonce()
  verificationData["version"] =
    `https://aqua-protocol.org/docs/v3/schema_2 | SHA256 | Method: ${enableScalar ? "scalar" : "tree"}`

  // Merklelize the dictionary
  const leaves = dict2Leaves(verificationData)

  let verification_hash = ""
  if (!enableScalar) {
    verification_hash = "0x" + getHashSum(JSON.stringify(verificationData))
    verificationData.leaves = leaves
  } else {
    verification_hash = getMerkleRoot(leaves) // tree.getHexRoot()
  }

  const revisions = aquaTreeView.aquaTree.revisions
  revisions[verification_hash] = verificationData

  maybeUpdateFileIndex(
    aquaTreeView.aquaTree,
    verificationData,
    revisionType,
    fileObject.fileName,
    "",
    "",
    "",
  )

  let aquaTreeWithOrderdRevision = reorderAquaTreeRevisionsProperties(
    aquaTreeView.aquaTree,
  )
  let aquaTreeWithTree = createAquaTree(aquaTreeWithOrderdRevision)

  logs.push({
    log: `content revision created succesfully`,
    logType: LogType.SUCCESS,
  })

  let result: AquaOperationData = {
    aquaTree: aquaTreeWithTree,
    aquaTrees: null,
    logData: logs,
  }

  return Ok(result)
}

/**
 * Retrieves a file from the Aqua Tree using its hash
 *
 * @param aquaTree - The Aqua Tree data structure
 * @param hash - Revisio hash of the file to retrieve
 * @returns Promise resolving to either the file content as string on success or array of LogData on failure
 */
export function getFileByHashUtil(
  aquaTree: AquaTree,
  hash: string,
): Result<string, LogData[]> {
  let logs: Array<LogData> = []

  let res = aquaTree.file_index[hash]

  if (res) {
    logs.push({
      log: `File with hash  found`,
      logType: LogType.SUCCESS,
    })
    return Ok(res)
  } else {
    logs.push({
      log: `File with hash ot found`,
      logType: LogType.ERROR,
    })
    return Err(logs)
  }
}
