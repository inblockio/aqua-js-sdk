import {
  Revision,
  AquaOperationData,
  LogData,
  AquaTree,
  FileObject,
  LogType,
  VerificationGraphData,
  FileVerificationGraphData,
  LinkVerificationGraphData,
  SignatureVerificationGraphData,
  WitnessVerificationGraphData,
  FormVerificationGraphData,
  FormKeyGraphData,
  FormVerificationResponseData,
  CredentialsData,
} from "../types"
import {
  dict2Leaves,
  getFileNameCheckingPaths,
  getGenesisHash,
  getHashSum,
  getMerkleRoot,
  getPreviousVerificationHash,
  OrderRevisionInAquaTree,
  reorderRevisionsProperties,
} from "../utils"
import { verifySignature } from "./signature"
import { verifyWitness } from "./witness"
import { Err, isErr, Ok, Result } from "../type_guards"

/**
 * Verifies a single revision in an Aqua Tree
 *
 * @param aquaTree - The Aqua Tree data structure
 * @param revision - The revision to verify
 * @param revisionItemHash - Hash of the revision
 * @param fileObject - Array of file objects referenced by the revision
 * @returns Promise resolving to either AquaOperationData on success or array of LogData on failure
 *
 * This function:
 * - Determines if scalar or tree verification should be used
 * - Verifies the revision's integrity and content
 * - Returns verification results and logs
 */
export async function verifyAquaTreeRevisionUtil(
  aquaTree: AquaTree,
  revision: Revision,
  revisionItemHash: string,
  fileObject: Array<FileObject>,
  credentials?: CredentialsData,
): Promise<Result<AquaOperationData, LogData[]>> {
  let logs: Array<LogData> = []

  const isScalar = !revision.hasOwnProperty("leaves")
  let result = await verifyRevision(
    aquaTree,
    revision,
    revisionItemHash,
    fileObject,
    isScalar,
    "",
    credentials
  )
  result[1].forEach((e) => logs.push(e))
  if (result[0] == false) {
    return Err(logs)
  }

  let data: AquaOperationData = {
    aquaTree: aquaTree,
    aquaTrees: [],
    logData: logs,
  }

  return Ok(data)
}

/**
 * Verifies all revisions in an Aqua Tree
 *
 * @param aquaTree - The Aqua Tree data structure to verify
 * @param fileObject - Array of file objects referenced by the tree
 * @param identCharacter - Optional identifier character for logging
 * @returns Promise resolving to either AquaOperationData on success or array of LogData on failure
 *
 * This function:
 * - Iterates through all revisions in the tree
 * - Identifies and logs revision types (form, file, signature, witness, link)
 * - Verifies each revision's integrity and content
 * - Accumulates verification results and logs
 */
export async function verifyAquaTreeUtil(
  aquaTree: AquaTree,
  fileObject: Array<FileObject>,
  identCharacter: string = "",
  credentials?: CredentialsData,
): Promise<Result<AquaOperationData, LogData[]>> {
  let logs: Array<LogData> = []

  let verificationHashes = Object.keys(aquaTree.revisions)
  let isSuccess = true
  for (let revisionItemHash of verificationHashes) {
    let revision: Revision = aquaTree.revisions[revisionItemHash]
    let revisionIndex = verificationHashes.indexOf(revisionItemHash)
    logs.push({
      logType: LogType.ARROW,
      log: ` ${revisionIndex + 1}.Verifying Revision: ${revisionItemHash}`,
      ident: identCharacter,
    })

    switch (revision.revision_type) {
      case "form":
        logs.push({
          logType: LogType.FORM,
          log: "Type: Form.",
          ident: `${identCharacter}\t`,
        })
        break
      case "file":
        logs.push({
          logType: LogType.FILE,
          log: "Type: File.",
          ident: `${identCharacter}\t`,
        })
        break
      case "signature":
        if (revision.signature_type)
          logs.push({
            logType: LogType.SIGNATURE,
            log: `Type: Signature ${revision.signature_type}`,
            ident: `${identCharacter}\t`,
          })
        break
      case "witness":
        logs.push({
          logType: LogType.WITNESS,
          log: `Type: Witness ${revision.witness_network}`,
          ident: `${identCharacter}\t`,
        })
        break
      case "link":
        logs.push({
          logType: LogType.LINK,
          log: "Type: Link.",
          ident: `${identCharacter}\t`,
        })
        break
      default:
        logs.push({
          logType: LogType.WARNING,
          log: `Type: Unknown ${revision.revision_type}.\n`,
          ident: `${identCharacter}\t`,
        })
    }
    // We use fast scalar verification if input does not have leaves property
    const isScalar = !revision.hasOwnProperty("leaves")

    let result = await verifyRevision(
      aquaTree,
      revision,
      revisionItemHash,
      fileObject,
      isScalar,
      identCharacter,
      credentials
    )

    if (result[1].length > 0) {
      logs.push(...result[1])
    }
    if (!result[0]) {
      isSuccess = false
    }
  }

  if (!isSuccess) {
    return Err(logs)
  }

  let data: AquaOperationData = {
    aquaTree: aquaTree,
    aquaTrees: [],
    logData: logs,
  }

  return Ok(data)
}

/**
 * Recursively searches for a node in the verification graph by its hash
 *
 * @param tree - The verification graph data structure to search
 * @param hash - Hash to search for
 * @returns Matching VerificationGraphData node or null if not found
 */
function findNode(
  tree: VerificationGraphData,
  hash: string,
): VerificationGraphData | null {
  if (tree.hash === hash) {
    return tree
  }
  for (let i = 0; i < tree.verificationGraphData.length; i++) {
    const child = tree.verificationGraphData[i]
    const result = findNode(child, hash)
    if (result) {
      return result
    }
  }
  return null
}

/**
 * Verifies a revision and generates its verification graph data
 *
 * @param aquaTree - The Aqua Tree data structure
 * @param revision - The revision to verify and graph
 * @param revisionItemHash - Hash of the revision
 * @param fileObject - Array of file objects referenced by the revision
 * @returns Promise resolving to either VerificationGraphData on success or array of LogData on failure
 *
 * This function:
 * - Verifies the revision's integrity
 * - Creates a graph representation of the verification results
 * - Includes metadata like timestamps and previous hashes
 */
export async function verifyAndGetGraphDataRevisionUtil(
  aquaTree: AquaTree,
  revision: Revision,
  revisionItemHash: string,
  fileObject: Array<FileObject>,
  credentials?: CredentialsData,
): Promise<Result<VerificationGraphData, LogData[]>> {
  const logs: LogData[] = []

  const isScalar = !revision.hasOwnProperty("leaves")
  let [isGenesisOkay, genesisLogData] = await verifyRevision(
    aquaTree,
    revision,
    revisionItemHash,
    fileObject,
    isScalar,
    "",
    credentials
  )

  genesisLogData.forEach((e) => logs.push(e))
  if (!isGenesisOkay) {
    Err(logs)
  }
  const genesisRevisionType = revision.revision_type

  const fileGraphData: FileVerificationGraphData = {
    isValidationSucessful: isGenesisOkay,
  }

  const verificationResults: VerificationGraphData = {
    hash: revisionItemHash,
    previous_verification_hash: getPreviousVerificationHash(
      aquaTree,
      revisionItemHash,
    ),
    timestamp: revision.local_timestamp,
    isValidationSucessful: isGenesisOkay,
    revisionType: genesisRevisionType,
    verificationGraphData: [],
    linkVerificationGraphData: [],
    info: fileGraphData,
  }

  return Ok(verificationResults)
}

/**
 * Verifies an entire Aqua Tree and generates a complete verification graph
 *
 * @param aquaTree - The Aqua Tree data structure to verify and graph
 * @param fileObject - Array of file objects referenced by the tree
 * @param identCharacter - Optional identifier character for logging
 * @returns Promise resolving to either VerificationGraphData on success or array of LogData on failure
 *
 * This function:
 * - Verifies the genesis revision
 * - Handles different revision types (form, file)
 * - Creates a hierarchical graph of verification results
 * - Includes all verification metadata and relationships
 */
export async function verifyAndGetGraphDataUtil(
  _aquaTree: AquaTree,
  fileObject: Array<FileObject>,
  identCharacter: string = "",
  credentials?: CredentialsData,
): Promise<Result<VerificationGraphData, LogData[]>> {
  const aquaTree: AquaTree = OrderRevisionInAquaTree(_aquaTree)
  let verificationHashes = Object.keys(aquaTree.revisions)
  const logs: LogData[] = []

  if (verificationHashes.length === 0) {
    logs.push({
      logType: LogType.ERROR,
      log: "Revisions should be greater than 0",
    })
    return Err(logs)
  }
  let genesisRevisionData = aquaTree.revisions[verificationHashes[0]]

  let infoGraphData:
    | FormVerificationGraphData
    | FileVerificationGraphData
    | null = null

  const isScalar = !genesisRevisionData.hasOwnProperty("leaves")
  let [isGenesisOkay, _genesisVerificationLogs] = await verifyRevision(
    aquaTree,
    genesisRevisionData,
    verificationHashes[0],
    fileObject,
    isScalar,
    identCharacter,
    credentials
  )
  const genesisRevisionType =
    aquaTree.revisions[verificationHashes[0]].revision_type

  if (genesisRevisionData.revision_type === "form") {
    let { formKeysGraphData } = verifyFormRevision(
      genesisRevisionData,
      genesisRevisionData.leaves,
    )

    let formData: FormVerificationGraphData = {
      formKeys: formKeysGraphData,
    }

    infoGraphData = formData
  } else {
    const fileGraphData: FileVerificationGraphData = {
      isValidationSucessful: isGenesisOkay,
    }
    infoGraphData = fileGraphData
  }

  const verificationResults: VerificationGraphData = {
    hash: verificationHashes[0],
    previous_verification_hash: genesisRevisionData.previous_verification_hash,
    timestamp: genesisRevisionData.local_timestamp,
    isValidationSucessful: isGenesisOkay,
    revisionType: genesisRevisionType,
    verificationGraphData: [],
    linkVerificationGraphData: [],
    info: infoGraphData,
  }

  if (verificationHashes.length === 1) {
    return Ok(verificationResults)
  }

  let isSuccess = true
  for (let revisionItemHash of verificationHashes.slice(1)) {
    let revision: Revision = aquaTree.revisions[revisionItemHash]
    let revisionIndex = verificationHashes.indexOf(revisionItemHash)
    logs.push({
      logType: LogType.ARROW,
      log: ` ${revisionIndex + 1}.Verifying Revision: ${revisionItemHash}`,
      ident: identCharacter,
    })

    switch (revision.revision_type) {
      case "form":
        logs.push({
          logType: LogType.FORM,
          log: "Type:Form.",
          ident: `${identCharacter}\t`,
        })
        break
      case "file":
        logs.push({
          logType: LogType.FILE,
          log: "Type: File.",
          ident: `${identCharacter}\t`,
        })
        break
      case "signature":
        if (revision.signature_type)
          logs.push({
            logType: LogType.SIGNATURE,
            log: `Type:Signature ${revision.signature_type}`,
            ident: `${identCharacter}\t`,
          })
        break
      case "witness":
        logs.push({
          logType: LogType.WITNESS,
          log: "Type:Witness.",
          ident: `${identCharacter}\t`,
        })
        break
      case "link":
        logs.push({
          logType: LogType.LINK,
          log: "Type:Link.",
          ident: `${identCharacter}\t`,
        })
        break
      default:
        logs.push({
          logType: LogType.WARNING,
          log: `Type:Unknown ${revision.revision_type}.\n`,
          ident: `${identCharacter}\t`,
        })
    }
    // We use fast scalar verification if input does not have leaves property
    const isScalar = !revision.hasOwnProperty("leaves")
    let result = await verifyRevision(
      aquaTree,
      revision,
      revisionItemHash,
      fileObject,
      isScalar,
      identCharacter,
      credentials
    )

    let verificationResultsNode = findNode(
      verificationResults,
      revision.previous_verification_hash,
    )
    if (verificationResultsNode === null) {
      logs.push({
        logType: LogType.ERROR,
        log: `A detached chain detected. Cannot find previous verification hash: ${revision.previous_verification_hash}`,
      })
      isSuccess = false
      break
    }

    let linkedVerificationGraphData: VerificationGraphData[] = []

    if (revision.revision_type === "link") {
      let aqtreeFilename =
        aquaTree.file_index[revision.link_verification_hashes[0]]
      // let linkedAquaTree = fileObject.find(
      //   (el) => el.fileName === `${aqtreeFilename}.aqua.json`,
      // )
      let name = `${aqtreeFilename}.aqua.json`;
      let linkedFileObject = getFileNameCheckingPaths(fileObject, name)
      if (!linkedFileObject) {
        logs.push({
          logType: LogType.ERROR,
          log: "Linked aqua tree not found",
        })
        break
      }
      const linkedAquaTree = OrderRevisionInAquaTree(linkedFileObject.fileContent as AquaTree)
      let result = await verifyAndGetGraphDataUtil(
        linkedAquaTree,
        fileObject,
        `${identCharacter}\t`,
        credentials
      )

      if (result.isOk()) {
        linkedVerificationGraphData = [result.data]
      } else {
        isSuccess = false
        logs.push({
          logType: LogType.ERROR,
          log: "Linked aqua tree failed to create graph data",
        })
        break
      }
    }

    let data:
      | FileVerificationGraphData
      | WitnessVerificationGraphData
      | SignatureVerificationGraphData
      | FormVerificationGraphData
      | LinkVerificationGraphData
      | undefined = undefined

    if (revision.revision_type === "form") {
      let { formKeysGraphData } = verifyFormRevision(revision, revision.leaves)
      let formData: FormVerificationGraphData = {
        formKeys: formKeysGraphData,
      }

      data = formData
    } else if (revision.revision_type === "file") {
      let formData: FileVerificationGraphData = {
        isValidationSucessful: result[0],
      }
      data = formData
    } else if (revision.revision_type === "link") {
      let formData: LinkVerificationGraphData = {
        isValidationSucessful: result[0],
      }
      data = formData
    } else if (revision.revision_type === "signature") {
      let formData: SignatureVerificationGraphData = {
        isValidationSucessful: result[0],
        walletAddress: revision.signature_wallet_address,
        chainHashIsValid: result[0],
        signature: revision.signature,
        signatureType: revision.signature_type,
      }
      data = formData
    } else if (revision.revision_type === "witness") {
      let formData: WitnessVerificationGraphData = {
        isValidationSucessful: result[0],
        txHash: revision.witness_transaction_hash,
        merkleRoot: revision.witness_merkle_root,
      }
      data = formData
    }

    verificationResultsNode.verificationGraphData.push({
      hash: revisionItemHash,
      previous_verification_hash: revision.previous_verification_hash,
      timestamp: revision.local_timestamp,
      isValidationSucessful: result[0],
      revisionType: revision.revision_type,
      verificationGraphData: [],
      linkVerificationGraphData: linkedVerificationGraphData,
      info: data!!,
    })

    if (result[1].length > 0) {
      logs.push(...result[1])
    }
    if (!result[0]) {
      isSuccess = false
    }
  }

  if (!isSuccess) {
    return Err(logs)
  }

  return Ok(verificationResults)
}

/**
 * Core function for verifying a single revision
 *
 * @param aquaTree - The Aqua Tree data structure
 * @param revision - The revision to verify
 * @param verificationHash - Hash of the revision
 * @param fileObjects - Array of file objects referenced by the revision
 * @param isScalar - Flag indicating if scalar verification should be used
 * @param identCharacter - Optional identifier character for logging
 * @returns Promise resolving to tuple of [verification success boolean, array of logs]
 *
 * This function:
 * - Verifies revision structure and integrity
 * - Handles different revision types (file, form, signature, witness, link)
 * - Validates hashes and signatures
 * - Verifies file content when applicable
 */
async function verifyRevision(
  aquaTree: AquaTree,
  revisionPar: Revision,
  verificationHash: string,
  fileObjects: Array<FileObject>,
  isScalar: boolean,
  identCharacter: string = "",
  credentials?: CredentialsData,
): Promise<[boolean, Array<LogData>]> {
  let logs: Array<LogData> = []
  let doVerifyMerkleProof = false // todo to be improved rather than hard coded
  let isSuccess = true
  let isScalarSuccess = true

  let verifyWitnessMerkleProof = false

  let revision = reorderRevisionsProperties(revisionPar)

  if (
    revision.revision_type === "witness" &&
    revision.witness_merkle_proof.length > 1
  ) {
    verifyWitnessMerkleProof = true
  }

  // todo this can be improved.
  // remove  verifyWitnessMerkleProof which is hard coded.
  // verify scalar should be minimal
  if (isScalar && !verifyWitnessMerkleProof) {
    let revData = JSON.stringify(revision)
    //todo remove this log
    // logs.push({
    //   logType: LogType.DEBUGDATA,
    //   log: `revison data   ${revData} `,
    //   ident: `${identCharacter}\t`,
    // })
    const actualVH = "0x" + getHashSum(revData)
    isScalarSuccess = actualVH === verificationHash

    if (!isScalarSuccess) {
      logs.push({
        logType: LogType.DEBUGDATA,
        log: `calculated  hash ${actualVH} expected hash ${verificationHash} `,
        ident: `${identCharacter}\t`,
      })
      logs.push({
        logType: LogType.DEBUGDATA,
        log: ` expected hash ${verificationHash} `,
        ident: `${identCharacter}\t`,
      })
      logs.push({
        logType: LogType.ERROR,
        log: `Scalar revision verification failed`,
        ident: `${identCharacter}\t`,
      })
    } else {
      // logs.push({
      //     logType: LogType.SUCCESS,
      //     log: "Scalar revision hash verified succeessully."
      // })
    }
  } else {
    if (doVerifyMerkleProof) {
      logs.push({
        logType: LogType.INFO,
        log: "Verifying revision merkle tree .",
        ident: `${identCharacter}\t`,
      })
      let [ok, result] = verifyRevisionMerkleTreeStructure(
        revision,
        verificationHash,
      )
      if (!ok) {
        return [ok, result]
      }
    }
  }

  let linkIdentChar = `${identCharacter}\t`
  let logsResult: Array<LogData> = []

  switch (revision.revision_type) {
    case "form":
      let res = verifyFormRevision(revision, revision.leaves,  `${identCharacter}\t\t`)
      isSuccess = res.isOk
     
      logs.push(...res.logs)

       logs.push({
            log: `Verified form fields veriifying json file`,
            logType: LogType.INFO,
            ident: `${identCharacter}\t`,
          })
       let fileContent1: Buffer
      if (!!revision.content) {
        fileContent1 = Buffer.from(revision.content, "utf8")
      } else {
        let fileName = aquaTree.file_index[verificationHash]
        let fileObjectItem = getFileNameCheckingPaths(fileObjects, fileName)

        if (fileObjectItem == undefined) {
          logs.push({
            // log: `file not found in file objects (form) fileObjectItem ${fileObjectItem} verificationHash ${verificationHash} fileObjects ${JSON.stringify(fileObjects, null, 4)}`,
            log: `file not found in file objects (form).`,
            logType: LogType.ERROR,
            ident: `${identCharacter}\t`,
          })
          return [false, logs]
        }

        if (fileObjectItem.fileContent instanceof Uint8Array) {
          fileContent1 = Buffer.from(fileObjectItem.fileContent)
        } else {
          if (typeof fileObjectItem.fileContent === "string") {
            fileContent1 = Buffer.from(fileObjectItem.fileContent as string)
          } else {
            fileContent1 = Buffer.from(
              JSON.stringify(fileObjectItem.fileContent),
            )
          }
        }
      }
      const fileHash1 = getHashSum(fileContent1)
      isSuccess = fileHash1 === revision.file_hash

      if(!isSuccess){

        logs.push({
          log: `File hash verification failed for form revision`,
          logType: LogType.ERROR,
          ident: `${identCharacter}\t`,
        })
      }
      break
    case "file":
      let fileContent: Buffer
      if (!!revision.content) {
        fileContent = Buffer.from(revision.content, "utf8")
      } else {
        let fileName = aquaTree.file_index[verificationHash]
        let fileObjectItem = getFileNameCheckingPaths(fileObjects, fileName)

        if (fileObjectItem == undefined) {
          logs.push({
            log: `file not found in file objects`,
            logType: LogType.ERROR,
            ident: `${identCharacter}\t`,
          })
          return [false, logs]
        }

        if (fileObjectItem.fileContent instanceof Uint8Array) {
          fileContent = Buffer.from(fileObjectItem.fileContent)
        } else {
          if (typeof fileObjectItem.fileContent === "string") {
            fileContent = Buffer.from(fileObjectItem.fileContent as string)
          } else {
            fileContent = Buffer.from(
              JSON.stringify(fileObjectItem.fileContent),
            )
          }
        }
      }
      const fileHash = getHashSum(fileContent)
      isSuccess = fileHash === revision.file_hash

      if(!isSuccess){

        logs.push({
          log: `File hash verification failed for form revision`,
          logType: LogType.ERROR,
          ident: `${identCharacter}\t`,
        })
      }
      break
    case "signature":
      // Verify signature
      ;[isSuccess, logsResult] = await verifySignature(
        revision,
        revision.previous_verification_hash,
        `${identCharacter}\t`,
      )

      break
    case "witness":
      // Verify witness
      // If multiple use merkle root else use previous verification hash
      let hash_ = revision.previous_verification_hash
      if (
        revision.previous_verification_hash !== revision.witness_merkle_root
      ) {
        hash_ = revision.witness_merkle_root
      }
      let [isSuccessResult, logsResultData] = await verifyWitness(
        revision,
        hash_,
        doVerifyMerkleProof,
        `${identCharacter}\t`,
        credentials
      )
      logsResult = logsResultData
      isSuccess = isSuccessResult

      break
    case "link":
      let linkOk: boolean = true
      for (const [_idx, vh] of revision.link_verification_hashes.entries()) {
        const fileUriFromAquaTree = aquaTree.file_index[vh]
        let fileObj = undefined;
        let aquaFileUri = ""
        let fileUri = ""
        if (fileUriFromAquaTree) {
          fileUri = fileUriFromAquaTree
          if (fileUriFromAquaTree.includes("/")) {
            fileUri = fileUriFromAquaTree.split('/').pop()
          }
          aquaFileUri = `${fileUri}.aqua.json`


          fileObj = getFileNameCheckingPaths(fileObjects, aquaFileUri)
        }
        if (fileObj == undefined) {

          let throwError = true

          //we are sure the file name is not in the file index
          // we can asume a complex case of revision.link_verification_hashes is a revision in  an aquq tree
          // loop through fileObjects if its an aqua tree check if a revision hash == revision.link_verification_hashes
          // find the genesis 

          for (let fileObjectItem of structuredClone(fileObjects)) {
            if (fileObjectItem.fileName.endsWith(".aqua.json")) {
              let aquaTree: AquaTree = fileObjectItem.fileContent as AquaTree
              let revisionHashes = Object.keys(aquaTree.revisions)

              if (revisionHashes.includes(vh)) {
                let genesisHash = getGenesisHash(aquaTree);
                let fileName = aquaTree.file_index[genesisHash]

                // let fileUriObj = fileObjects.find(
                //   (fileObj) => fileObj.fileName === fileName,
                // )

                let msg = `revisionHashes ${revisionHashes.join(",")}  hash vh ${vh} genesisHash ${genesisHash} -- fileName ${fileName}, fileObjects ${JSON.stringify(fileObjects.map((e)=>e.fileName), null, 4)}`

                console.log("Msg: ", msg)
                
                if(fileName==undefined){
                  break;
                }

                let fileUriObj = getFileNameCheckingPaths(structuredClone(fileObjects), fileName)

                if (fileUriObj == undefined) {
                  break;
                }

                let fileUri = fileUriObj.fileName;
                const aquaFileUri = `${fileUri}.aqua.json`

                // fix me
                logs.push({
                  log: `Deep Linking Verifying linked File ${aquaFileUri}.`,
                  logType: LogType.INFO,
                  ident: `${identCharacter}\t`,
                })

                try {

                  // let fileObj = fileObjects.find(
                  //   (fileObj) => fileObj.fileName === aquaFileUri,
                  // )
                  let fileObj = getFileNameCheckingPaths(fileObjects, aquaFileUri)


                  if (fileObj == undefined || fileObj === null) {
                    logs.push({
                      log: `Aqua tree ${aquaFileUri}  not found`,
                      logType: LogType.ERROR,
                      ident: `${identCharacter}\t`,
                    })
                    break
                  }

                  const linkAquaTree = fileObj.fileContent as AquaTree //JSON.parse(fileObj.fileContent)  as AquaTree;
                  const _linkAquaTreeReordered = OrderRevisionInAquaTree(linkAquaTree)
                  let linkVerificationResult = await verifyAquaTreeUtil(
                    _linkAquaTreeReordered,
                    fileObjects,
                    `${linkIdentChar}\t`,
                    credentials,
                  )

                  if (isErr(linkVerificationResult)) {
                    linkOk = false

                    logs.push(...linkVerificationResult.data)
                    logs.push({
                      log: `verification of ${fileUri}.aqua.json failed `,
                      logType: LogType.ERROR,
                      ident: linkIdentChar, //`${identCharacter}\t`
                    })
                  } else {
                    logs.push(...linkVerificationResult.data.logData)

                    logs.push({
                      log: `successfully verified ${fileUri}.aqua.json `,
                      logType: LogType.SUCCESS,
                      ident: linkIdentChar, //`${identCharacter}\t`
                    })
                  }
                } catch (error) {
                  linkOk = false
                  logs.push({
                    log: `Error verifying linked file ${aquaFileUri}: ${error}`,
                    logType: LogType.ERROR,
                    ident: `${identCharacter}\t`,
                  })
                }

                // end of fix me
                throwError = false
                break
              }
            }
          }

          if (throwError) {
            linkOk = false
            logs.push({
              log: `File ${fileUri} not found in file objects`,
              logType: LogType.ERROR,
              ident: `${identCharacter}\t`,
            })

          }

        } else {
          logs.push({
            log: `Verifying linked File ${aquaFileUri}.`,
            logType: LogType.INFO,
            ident: `${identCharacter}\t`,
          })

          try {
            const linkAquaTree = fileObj.fileContent as AquaTree //JSON.parse(fileObj.fileContent)  as AquaTree;

            let linkVerificationResult = await verifyAquaTreeUtil(
              linkAquaTree,
              fileObjects,
              `${linkIdentChar}\t`,
              credentials
            )

            if (isErr(linkVerificationResult)) {
              linkOk = false

              logs.push(...linkVerificationResult.data)
              logs.push({
                log: `verification of ${fileUri}.aqua.json failed `,
                logType: LogType.ERROR,
                ident: linkIdentChar, //`${identCharacter}\t`
              })
            } else {
              logs.push(...linkVerificationResult.data.logData)

              logs.push({
                log: `successfully verified ${fileUri}.aqua.json `,
                logType: LogType.SUCCESS,
                ident: linkIdentChar, //`${identCharacter}\t`
              })
            }
          } catch (error) {
            linkOk = false
            logs.push({
              log: `Error verifying linked file ${aquaFileUri}: ${error}`,
              logType: LogType.ERROR,
              ident: `${identCharacter}\t`,
            })
          }
        }
      }

      isSuccess = linkOk
      break
  }

  logs.push(...logsResult)

  if (isSuccess && isScalarSuccess) {
    if (isScalar) {
      logs.push({
        log: `⏺️  Scalar revision verified`,
        logType: LogType.SUCCESS,
        ident: identCharacter.length == 0 ? "\t" : `${linkIdentChar}`,
      })
    } else {
      logs.push({
        log: `🌿 Tree  revision verified`,
        logType: LogType.SUCCESS,
        ident: identCharacter.length == 0 ? "\t" : `${linkIdentChar}`,
      })
    }

    logs.push({
      log: `\n`,
      logType: LogType.EMPTY,
    })

    return [true, logs]
  } else {
    logs.push({
      log: `Error verifying revision type:${revision.revision_type} with hash ${verificationHash}. `,
      logType: LogType.ERROR,
      ident: `${identCharacter}\t`,
    })

    logs.push({
      log: `\n`,
      logType: LogType.EMPTY,
    })
    return [false, logs]
  }
}

/**
 * Verifies a form revision's structure and content
 *
 * @param input - The form revision data to verify
 * @param leaves - Merkle tree leaves of the form data
 * @param identCharacter - Optional identifier character for logging
 * @returns FormVerificationResponseData containing verification results
 *
 * This function:
 * - Validates form structure
 * - Verifies form field values
 * - Tracks form key states (active/deleted)
 */
function verifyFormRevision(
  input: any,
  leaves: any,
  identCharacter: string = "",
): FormVerificationResponseData {
  let logs: Array<LogData> = []
  let contains_deleted_fields = false
  let fieldsWithVerification: any = []
  let fieldsWithPartialVerification: any = []
  let ok = true

  let formKeysGraphData: FormKeyGraphData[] = []

  Object.keys(input)
    .sort()
    .forEach((field, i: number) => {
      let hashString =`${field}:${input[field]}`
      let new_hash = getHashSum(hashString)

      if (!field.endsWith(".deleted")) {
        if (field.startsWith("forms_")) {
          if (new_hash !== leaves[i]) {
            ok = false
           
            fieldsWithVerification.push(`🚫 ${field}: ${input[field]} -- hashString ${hashString} -- new hash ${new_hash} -- index ${i} -- leaves at ${leaves[i]}`)
            formKeysGraphData.push({
              formKey: field,
              content: input[field],
              isValidationSucessful: false,
            })
          } else {
            fieldsWithVerification.push(`✅ ${field}: ${input[field]}`)
            formKeysGraphData.push({
              formKey: field,
              content: input[field],
              isValidationSucessful: true,
            })
          }
        }
      } else {
        contains_deleted_fields = true
        fieldsWithPartialVerification.push(field)
      }
    })

  if (contains_deleted_fields) {
    logs.push({
      log: `Warning: The following fields cannot be verified:`,
      logType: LogType.WARNING,
      ident: identCharacter,
    })
    fieldsWithPartialVerification.forEach((field: any, i: number) => {
      logs.push({
        log: `${i + 1}. ${field.replace(".deleted", "")}\n`,
        logType: LogType.WARNING,
      })
    })
  }

  logs.push({
    log: `The following fields were verified:`,
    logType: LogType.SUCCESS,
    ident: identCharacter,
  })
  fieldsWithVerification.forEach((field: any) => {
    logs.push({
      log: `${field}\n`,
      logType: LogType.SUCCESS,
      ident: identCharacter,
    })
  })

  // return [ok, logs]

  return {
    isOk: ok,
    logs: logs,
    formKeysGraphData,
  }
}

/**
 * Verifies the Merkle tree structure of a revision
 *
 * @param input - The revision to verify
 * @param verificationHash - Hash to verify against
 * @returns Tuple of [verification success boolean, array of logs]
 *
 * This function:
 * - Validates Merkle tree structure
 * - Verifies leaf node hashes
 * - Ensures hash consistency
 */
function verifyRevisionMerkleTreeStructure(
  input: Revision,
  verificationHash: string,
): [boolean, Array<LogData>] {
  let logs: Array<LogData> = []

  let ok: boolean = true
  let vhOk: boolean = true

  // Ensure mandatory claims are present
  const mandatory: any = {
    file: ["file_hash", "file_nonce"],
    link: ["link_verification_hashes"],
    signature: ["signature"],
    witness: ["witness_merkle_root"],
    form: [],
  }[input.revision_type]

  const mandatoryClaims = [
    "previous_verification_hash",
    "local_timestamp",
    ...mandatory,
  ]

  for (const claim of mandatoryClaims) {
    if (!(claim in input)) {
      logs.push({
        log: `mandatory field ${claim} is not present`,
        logType: LogType.ERROR,
      })
      return [false, logs]
    }
  }

  const leaves = input.leaves
  delete input.leaves
  // const actualLeaves = []
  // let fieldsWithPartialVerification: string[] = []
  // let fieldsWithVerification: string[] = []

  if (input.revision_type === "form") {
    let formVerificationResult = verifyFormRevision(input, leaves)

    logs.push(...formVerificationResult.logs)

    vhOk = formVerificationResult.isOk
  }
  // For witness, we verify the merkle root
  else if (
    input.revision_type === "witness" &&
    input.witness_merkle_proof &&
    input.witness_merkle_proof.length > 1
  ) {
    let witnessMerkleProofLeaves = input.witness_merkle_proof

    const hexRoot = getMerkleRoot(witnessMerkleProofLeaves) // tree.getHexRoot()
    vhOk = hexRoot === input.witness_merkle_root
  } else {
    // Verify leaves
    for (const [i, claim] of Object.keys(input).sort().entries()) {
      const actual = getHashSum(`${claim}:${input[claim]}`)
      const claimOk = leaves[i] === actual
      // result.status[claim] = claimOk
      //todo this can be impoved
      ok = ok && claimOk
      // actualLeaves.push(actual)
    }

    const leaves2 = dict2Leaves(input)

    const hexRoot = getMerkleRoot(leaves2) // tree.getHexRoot()
    vhOk = hexRoot === verificationHash
  }

  ok = ok && vhOk
  return [ok, logs]
}
