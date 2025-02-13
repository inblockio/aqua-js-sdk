
import { createAquaTree } from "../aquavhtree";
import { Err, isErr, Ok, Result } from "../type_guards";
import {  AquaOperationData, LogData,  AquaTreeWrapper, LogType, FileObject } from "../types";
import { checkFileHashAlreadyNotarized, createNewAquaTree, dict2Leaves, findFormKey, getHashSum, getLatestVH, getMerkleRoot, getTimestamp, maybeUpdateFileIndex, prepareNonce } from "../utils";


export async function createFormRevisionUtil(aquaTreeWrapper: AquaTreeWrapper, fileObject: FileObject, enableScalar: boolean = false): Promise<Result<AquaOperationData, LogData[]>> {

    let logs: Array<LogData> = [];
    let targetHash = "";
    let revisionType = "form";
    if (aquaTreeWrapper.revision == null || aquaTreeWrapper.revision == undefined || aquaTreeWrapper.revision.length == 0) {

        logs.push({
            log: `using the last revision `,
            logType: LogType.INFO
        });

        const verificationHashes = Object.keys(aquaTreeWrapper.aquaTree.revisions)
        targetHash = verificationHashes[verificationHashes.length - 1]

    }

    let verificationData: any = {
        previous_verification_hash: targetHash, //previousVerificationHash,
        local_timestamp: getTimestamp(),
        revision_type: revisionType,
    }

    // Calculate the hash of the file
    let fileHash = getHashSum(fileObject.fileContent)
    checkFileHashAlreadyNotarized(fileHash, aquaTreeWrapper.aquaTree)
    verificationData["file_hash"] = fileHash
    verificationData["file_nonce"] = prepareNonce()


    let formDataJson = {}
    try {
        // Attempt to parse the JSON data
        formDataJson = JSON.parse(fileObject.fileContent)
    } catch (parseError) {
        // Handle invalid JSON data
        logs.push({
            log: "Error: The file does not contain valid JSON data.",
            logType: LogType.ERROR
        })
        return Err(logs)
    }

    // Sort the keys
    let form_data_sorted_keys = Object.keys(formDataJson)
    let form_data_sorted_with_prefix = {}
    for (let key of form_data_sorted_keys) {
        form_data_sorted_with_prefix[`forms_${key}`] = formDataJson[key]
    }

    verificationData = {
        ...verificationData,
        ...form_data_sorted_with_prefix,
    }



    const leaves = dict2Leaves(verificationData)

    let verificationHash = "";
    if (enableScalar) {

        logs.push({
            log: `Scalar enabled`,
            logType: LogType.SCALAR
        });
        let stringifiedData = JSON.stringify(verificationData)

        verificationHash = "0x" + getHashSum(stringifiedData);
    } else {
        verificationData.leaves = leaves
        verificationHash = getMerkleRoot(leaves); 
    }

    const aquaTree = createNewAquaTree();
    aquaTree.revisions[verificationHash] = verificationData;

    let aquaTreeUpdatedResult = maybeUpdateFileIndex(aquaTree, verificationHash, revisionType, fileObject.fileName, "","","")

    if (isErr(aquaTreeUpdatedResult)) {
        logs.push(...aquaTreeUpdatedResult.data);
        return Err(logs);
    }
    let aquaTreeUpdated = aquaTreeUpdatedResult.data
    // Tree creation
    let aquaTreeWithTree = createAquaTree(aquaTreeUpdated)

    logs.push({
        log: `Form  revision created succesfully`,
        logType: LogType.SUCCESS
    });

    let result: AquaOperationData = {
        aquaTree: aquaTreeWithTree, //aquaTreeWithTree,
        aquaTrees: null,
        logData: logs
    }


    return Ok(result);

}
export function hideFormElementsUtil(aquaTreeWrapper: AquaTreeWrapper, keyToHide: string): Result<AquaOperationData, LogData[]> {
    
    let logs: Array<LogData> = [];
    
    let targetRevisionHash = "";
    
    
    if (aquaTreeWrapper.revision.length > 1) {
        targetRevisionHash = aquaTreeWrapper.revision
    } else {
        targetRevisionHash = getLatestVH(aquaTreeWrapper.aquaTree)
    }

    const targetRevision = aquaTreeWrapper.aquaTree.revisions[targetRevisionHash];
    
    if (targetRevisionHash == "" || targetRevision == undefined) {

        logs.push({
            log: `Error: Revision hash not found in file`,
            logType: LogType.ERROR
        });

        return Err(logs)
    }
    
    const formKey = findFormKey(targetRevision, keyToHide);
    
    if (!formKey) {
        logs.push({
            log: `Error: Form key '${formKey}' not found`,
            logType: LogType.ERROR
        });

        return Err(logs)
    }
    
    
    const revisions: any = aquaTreeWrapper.aquaTree.revisions;
    
    // Update in place by renaming the key and setting value to empty string
    const deletedKey = `${formKey}.deleted`;
    
    let newRevision = {};
    for (let key in targetRevision) {
        if (formKey == key) {
            newRevision[deletedKey] = null;
        } else {
            newRevision[key] = targetRevision[key];
        }
    }
    revisions[targetRevisionHash] = newRevision;
    
    
    let data: AquaOperationData = {
        aquaTree: aquaTreeWrapper.aquaTree,
        aquaTrees: [],
        logData: logs
    }
    return Ok(data)
}



export function unHideFormElementsUtil(aquaTreeWrapper: AquaTreeWrapper, keyToUnHide: string, content : string): Result<AquaOperationData, LogData[]> {

    let logs: Array<LogData> = [];
    
    let targetRevisionHash = "";
    
    
    if (aquaTreeWrapper.revision.length > 1) {
        targetRevisionHash = aquaTreeWrapper.revision
    } else {
        targetRevisionHash = getLatestVH(aquaTreeWrapper.aquaTree)
    }

    const targetRevision = aquaTreeWrapper.aquaTree.revisions[targetRevisionHash];
    
    if (targetRevisionHash == "" || targetRevision == undefined) {

        logs.push({
            log: `Error: Revision hash not found in file`,
            logType: LogType.ERROR
        });

        return Err(logs)
    }
    
    const formKey = findFormKey(targetRevision, keyToUnHide);
    
    if (!formKey) {
        logs.push({
            log: `Error: Form key '${formKey}' not found`,
            logType: LogType.ERROR
        });

        return Err(logs)
    }
    
    
    const revisions: any = aquaTreeWrapper.aquaTree.revisions;
    

    // Update operation
    if (formKey.endsWith('.deleted')) {
        // Restore deleted field
        const originalKey = formKey.replace('.deleted', '');
  
        let newRevision = {};
        for (let key in targetRevision) {
          if (formKey == key) {
            newRevision[originalKey] = content;
          } else {
            newRevision[key] = targetRevision[key];
          }
        }
        revisions[targetRevisionHash] = newRevision;
      } else {
        // Regular update
        targetRevision[formKey] = content;
      }

    
    
      let data: AquaOperationData = {
          aquaTree: aquaTreeWrapper.aquaTree,
          aquaTrees: [],
          logData: logs
      }
      return Ok(data)
}