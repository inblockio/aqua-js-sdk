import {
  AquaTree,
  AquaOperationData,
  LogData,
  FileObject,
  Revision,
  LogType,
} from "../types"
import {
  createNewAquaTree,
  dict2Leaves,
  getHashSum,
  getMerkleRoot,
  getTimestamp,
  maybeUpdateFileIndex,
  prepareNonce,
  reorderRevisionsProperties,
} from "../utils"
import { createAquaTree } from "../aquatreevisualization"
import { Err, isErr, Ok, Result } from "../type_guards"

/**
 * Checks if a file has already been notarized in the Aqua Tree
 *
 * @param aquaTree - The Aqua Tree data structure
 * @param fileObject - File object containing content to check
 * @returns boolean indicating if file is already notarized
 */
export function checkIfFileAlreadyNotarizedUtil(
  aquaTree: AquaTree,
  fileObject: FileObject,
): boolean {
  let keys = Object.keys(aquaTree.revisions)
  let firstRevision: Revision = aquaTree.revisions[keys[0]]

  const contentForHashing = typeof fileObject.fileContent === 'string'
    ? fileObject.fileContent
    : JSON.stringify(fileObject.fileContent)
  let fileHash = getHashSum(contentForHashing)
  return firstRevision.file_hash == fileHash
}

/**
 * Retrieves a list of files that need to be read into the Aqua Tree
 *
 * @param aquaTree - The Aqua Tree data structure
 * @returns Array of filenames that need content to be loaded
 *
 * This function:
 * - Maps file hashes to filenames from the file index
 * - Checks which files don't have content in their revisions
 * - Returns list of files needing content to be loaded
 */
export function fetchFilesToBeReadUtil(aquaTree: AquaTree): string[] {
  let hashAndfiles: Map<string, string> = new Map()

  let keys = Object.keys(aquaTree.file_index)

  keys.forEach((item) => {
    hashAndfiles.set(item, aquaTree.file_index[item])
  })

  let filesWithoutContentInRevisions: Array<string> = []

  //const allRevisionHashes = Object.keys(aquaTree.revisions);

  hashAndfiles.forEach((value, key) => {
    const revision = aquaTree.revisions[key]
    let fileName = value //hashAndfiles.get(revisionHash)
    if (revision != undefined && revision.content != undefined) {
      console.warn(
        `✓ File ${fileName} skipped: content already exists in revision ${key}`,
      )
    } else {
      filesWithoutContentInRevisions.push(fileName)
    }
  })

  return filesWithoutContentInRevisions
}

/**
 * Removes the most recent revision from the Aqua Tree
 *
 * @param aquaTree - The Aqua Tree data structure
 * @returns Result containing either updated AquaOperationData or error logs
 *
 * This function:
 * - Identifies the last revision
 * - Removes appropriate entries from file index based on revision type
 * - Updates the Aqua Tree structure
 * - Handles cleanup if all revisions are removed
 */
export function removeLastRevisionUtil(
  aquaTree: AquaTree,
): Result<AquaOperationData, LogData[]> {
  let logs: Array<LogData> = []

  const revisions = aquaTree.revisions
  const verificationHashes = Object.keys(revisions)
  const lastRevisionHash = verificationHashes[verificationHashes.length - 1]

  const lastRevision = aquaTree.revisions[lastRevisionHash]
  switch (lastRevision.revision_type) {
    case "file":
      delete aquaTree.file_index[lastRevision.file_hash]
      break
    case "link":
      for (const vh of lastRevision.link_verification_hashes) {
        delete aquaTree.file_index[vh]
      }
  }

  delete aquaTree.revisions[lastRevisionHash]
  logs.push({
    log: `Most recent revision ${lastRevisionHash} has been removed`,
    logType: LogType.INFO,
  })

  let newAquaTree = createAquaTree(aquaTree)

  let result: AquaOperationData = {
    aquaTree: newAquaTree,
    aquaTrees: null,
    logData: logs,
  }
  // file can be deleted
  if (Object.keys(aquaTree.revisions).length === 0) {
    logs.push({
      log: `The last  revision has been deleted  there are no revisions left.`,
      logType: LogType.HINT,
    })
    result.aquaTree = null

    return Ok(result)
  } else {
    logs.push({
      log: `A revision  has been removed.`,
      logType: LogType.SUCCESS,
    })

    return Ok(result)
  }
}

// improve this function t work with form as genesis
/**
 * Creates the initial (genesis) revision for a new Aqua Tree
 *
 * @param fileObject - File object containing content for the genesis revision
 * @param isForm - Flag indicating if the genesis revision is a form
 * @param embedContent - Flag to include file content in the revision
 * @param enableScalar - Flag to use scalar mode instead of tree mode
 * @returns Promise resolving to either AquaOperationData on success or array of LogData on failure
 *
 * This function:
 * - Creates initial revision with metadata
 * - Handles both file and form type genesis revisions
 * - Processes form data if applicable
 * - Creates verification data with Merkle tree or scalar hash
 * - Initializes new Aqua Tree with genesis revision
 */
export async function createGenesisRevision(
  fileObject: FileObject,
  isTOR: boolean,
  embedContent: boolean,
  enableScalar: boolean,
  schemaHash: string,
): Promise<Result<AquaOperationData, LogData[]>> {
  //timestamp: string, revisionType: RevisionType,
  let logs: Array<LogData> = []

  const timestamp = getTimestamp()
  let revisionType = "file"

  if (isTOR) {
    revisionType = "template_object"
  }

  let verificationData: any = {
    previous_verification_hash: "",
    local_timestamp: timestamp,
    revision_type: revisionType
  }

  if(isTOR && schemaHash){
    verificationData["schema_hash"] = schemaHash
  }

  verificationData["version"] =
    `https://aqua-protocol.org/docs/v3/schema_2 | SHA256 | Method: ${enableScalar ? "scalar" : "tree"}`

  switch (revisionType) {
    case "file":
      verificationData["file_hash"] = getHashSum(fileObject.fileContent as string)
      verificationData["file_nonce"] = prepareNonce()

      if (embedContent) {
        verificationData["content"] = fileObject.fileContent

        logs.push({
          log: `Content flag detected.`,
          logType: LogType.FILE,
        })
      }

      break
    case "template_object":
      let templateObjectJson: any = {}
      try {
        // Attempt to parse the JSON data
        templateObjectJson = JSON.stringify(fileObject.fileContent)// JSON.parse(fileObject.fileContent as string)
      } catch (parseError) {
        logs.push({
          log: `Error: The file ${fileObject.fileName} does not contain valid JSON data.`,
          logType: LogType.ERROR,
        })
        return Err(logs)
      }

      verificationData["nonce"] = prepareNonce()
      verificationData = {
        ...verificationData,
        template_object: fileObject.fileContent,
      }
      break

    default:
      logs.push({
        log: `Genesis revision can either be form  or file.`,
        logType: LogType.ERROR,
      })
      return Err(logs)
  }

  let sortedVerificationData = reorderRevisionsProperties(verificationData)

  let verificationHash = ""
  if (enableScalar) {
    logs.push({
      log: `Scalar enabled`,
      logType: LogType.SCALAR,
    })
    let stringifiedData = JSON.stringify(sortedVerificationData)

    let hashSumData = getHashSum(stringifiedData)

    //todo remove this log
    // logs.push({
    //   logType: LogType.DEBUGDATA,
    //   log: `Genesi scalar  hashSumData ${hashSumData} \n input ${stringifiedData} `,
    //   ident: `\t`,
    // })
    verificationHash = "0x" + hashSumData
  } else {
    try {
      const leaves = dict2Leaves(sortedVerificationData, revisionType === "template_object")
      sortedVerificationData.leaves = leaves
      verificationHash = getMerkleRoot(leaves)
    } catch (error) {
      logs.push({
        log: `Error in Merkle tree generation: ${error}`,
        logType: LogType.ERROR,
      })
      return Err(logs)
    }
  }

  const aquaTree = createNewAquaTree()
  aquaTree.revisions[verificationHash] = sortedVerificationData

  let aquaTreeUpdatedResult: Result<AquaTree, LogData[]>

  aquaTreeUpdatedResult = maybeUpdateFileIndex(
    aquaTree,
    verificationHash,
    revisionType,
    fileObject.fileName,
    "",
    "",
    "",
  )
  if (isErr(aquaTreeUpdatedResult)) {
    logs.push(...aquaTreeUpdatedResult.data)
    return Err(logs)
  }
  let aquaTreeUpdated = aquaTreeUpdatedResult.data
  // Tree creation
  let aquaTreeWithTree = createAquaTree(aquaTreeUpdated)

  logs.push({
    log: `Genesis revision created succesfully`,
    logType: LogType.SUCCESS,
  })

  let result: AquaOperationData = {
    aquaTree: aquaTreeWithTree, //aquaTreeWithTree,
    aquaTrees: null,
    logData: logs,
  }

  console.log("Logs: ", logs)

  return Ok(result)
}

/**
 * Retrieves a specific revision from the Aqua Tree by its hash
 *
 * @param aquaTree - The Aqua Tree data structure
 * @param revisionHash - Hash of the revision to retrieve
 * @returns Result containing either the requested Revision or error logs
 */
export function getRevisionByHashUtil(
  aquaTree: AquaTree,
  revisionHash: string,
): Result<Revision, LogData[]> {
  let logs: Array<LogData> = []

  const verificationHashes = Object.keys(aquaTree.revisions)

  if (verificationHashes.includes(revisionHash)) {
    return Ok(aquaTree.revisions[revisionHash])
  } else {
    logs.push({
      log: `❌ Revision with hash : ${revisionHash} not found`,
      logType: LogType.ERROR,
    })
    return Err(logs)
  }
}

/**
 * Retrieves the most recent revision from the Aqua Tree
 *
 * @param aquaTree - The Aqua Tree data structure
 * @returns Result containing either the latest Revision or error logs
 */
export function getLastRevisionUtil(
  aquaTree: AquaTree,
): Result<Revision, LogData[]> {
  let logs: Array<LogData> = []

  const verificationHashes = Object.keys(aquaTree.revisions)

  if (verificationHashes.length == 0) {
    logs.push({
      log: `❌ aqua object has no revisions`,
      logType: LogType.ERROR,
    })
    return Err(logs)
  }
  const lastRevisionHash = verificationHashes[verificationHashes.length - 1]
  return Ok(aquaTree.revisions[lastRevisionHash])
}
