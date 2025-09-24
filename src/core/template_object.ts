import {
  AquaTreeView,
  AquaOperationData,
  LogData,
  LogType,
} from "../types"
import {
  dict2Leaves,
  getHashSum,
  getMerkleRoot,
  getTimestamp,
} from "../utils"
import { reorderAquaTreeRevisionsProperties } from "../utils"
import { createAquaTree } from "../aquatreevisualization"
import { Ok, Result } from "../type_guards"

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
export async function createTemplateObjectRevisionUtil(
  aquaTreeView: AquaTreeView,
  templateObject: Record<string, unknown>,
  enableScalar: boolean,
  schemaHash?: string,
): Promise<Result<AquaOperationData, LogData[]>> {
  let logs: Array<LogData> = []

  const timestamp = getTimestamp()
  let revisionType = "template_object"

  const verificationHashes = Object.keys(aquaTreeView.aquaTree.revisions)
  let lastRevisionHash = verificationHashes[verificationHashes.length - 1]

  let verificationData: any = {
    previous_verification_hash: lastRevisionHash,
    local_timestamp: timestamp,
    revision_type: revisionType,
  }

  verificationData["template_object"] = templateObject

  // Add template hash if provided
  if (schemaHash) {
    verificationData["schema_hash"] = schemaHash
  }

  verificationData["version"] =
    `https://aqua-protocol.org/docs/v3/schema_2 | SHA256 | Method: ${enableScalar ? "scalar" : "tree"}`

  // Merklelize the dictionary
  const leaves = dict2Leaves(verificationData,  true)

  let verification_hash = ""
  if (!enableScalar) {
    verification_hash = "0x" + getHashSum(JSON.stringify(verificationData))
    verificationData.leaves = leaves
  } else {
    verification_hash = getMerkleRoot(leaves) // tree.getHexRoot()
  }

  const revisions = aquaTreeView.aquaTree.revisions
  revisions[verification_hash] = verificationData

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
