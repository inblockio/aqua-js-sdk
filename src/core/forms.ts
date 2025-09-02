
import { createAquaTree } from "../aquatreevisualization";
import { Err, isErr, Ok, Result } from "../type_guards";
import { AquaOperationData, LogData, AquaTreeView, LogType, FileObject } from "../types";
import { checkFileHashAlreadyNotarized, dict2Leaves, findFormKey, getHashSum, getLatestVH, getMerkleRoot, getTimestamp, maybeUpdateFileIndex, prepareNonce } from "../utils";


/**
 * Creates a new form revision in the Aqua Tree
 * 
 * @param aquaTreeView - View containing the Aqua Tree data structure
 * @param fileObject - Object containing form data as JSON content
 * @param enableScalar - Optional flag to use scalar mode instead of tree mode (default: false)
 * @returns Promise resolving to either AquaOperationData on success or array of LogData on failure
 * 
 * This function:
 * - Validates and processes JSON form data
 * - Generates form revision with metadata
 * - Checks if form is already notarized
 * - Creates verification data with Merkle tree or scalar hash
 * - Updates the Aqua Tree with new form revision
 */
export async function createFormRevisionUtil(aquaTreeView: AquaTreeView, fileObject: FileObject, enableScalar: boolean = false): Promise<Result<AquaOperationData, LogData[]>> {

    let logs: Array<LogData> = [];
    let targetHash = "";
    let revisionType = "form";
    if (aquaTreeView.revision == null || aquaTreeView.revision == undefined || aquaTreeView.revision.length == 0) {

        logs.push({
            log: `using the last revision `,
            logType: LogType.INFO
        });

        const verificationHashes = Object.keys(aquaTreeView.aquaTree.revisions)
        targetHash = verificationHashes[verificationHashes.length - 1]

    }

    let verificationData: any = {
        previous_verification_hash: targetHash, //previousVerificationHash,
        local_timestamp: getTimestamp(),
        revision_type: revisionType,
    }

    // Calculate the hash of the file
    let fileHash = getHashSum(fileObject.fileContent as string)
    let alreadyFormified = checkFileHashAlreadyNotarized(fileHash, aquaTreeView.aquaTree)

    if (alreadyFormified) {
        logs.push({
            log: "Error: The form is already part of the aqua tree.",
            logType: LogType.ERROR
        })
        return Err(logs)
    }

    verificationData["file_hash"] = fileHash
    verificationData["file_nonce"] = prepareNonce()
    verificationData["version"] =`https://aqua-protocol.org/docs/v3/schema_2 | SHA256 | Method: ${enableScalar ? 'scalar' : 'tree'}`



    let formDataJson:  { [key: string]: any } = {}
    try {
        // Attempt to parse the JSON data
        formDataJson = JSON.parse(fileObject.fileContent as string)
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
    let form_data_sorted_with_prefix:  { [key: string]: any } = {}
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


    const aquaTree = aquaTreeView.aquaTree;
    aquaTree.revisions[verificationHash] = verificationData;



    let aquaTreeUpdatedResult = maybeUpdateFileIndex(aquaTree, verificationHash, revisionType, fileObject.fileName, fileObject.fileName, "", "")
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
        aquaTrees: [],
        logData: logs
    }


    return Ok(result);

}
/**
 * Hides (soft deletes) a form element by marking it as deleted
 * 
 * @param aquaTreeView - View containing the Aqua Tree data structure
 * @param keyToHide - Key of the form element to hide
 * @returns Result containing either updated AquaOperationData or error logs
 * 
 * This function:
 * - Finds the target revision
 * - Locates the form key to hide
 * - Creates a new revision with the element marked as deleted
 */
export function hideFormElementsUtil(aquaTreeView: AquaTreeView, keyToHide: string): Result<AquaOperationData, LogData[]> {

    let logs: Array<LogData> = [];

    let targetRevisionHash = "";


    if (aquaTreeView.revision.length > 1) {
        targetRevisionHash = aquaTreeView.revision
    } else {
        targetRevisionHash = getLatestVH(aquaTreeView.aquaTree)
    }

    const targetRevision = aquaTreeView.aquaTree.revisions[targetRevisionHash];

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


    const revisions: any = aquaTreeView.aquaTree.revisions;

    // Update in place by renaming the key and setting value to empty string
    const deletedKey = `${formKey}.deleted`;

    let newRevision: { [key: string]: any } = {};
    for (let key in targetRevision) {
        if (formKey == key) {
            newRevision[deletedKey] = null;
        } else {
            newRevision[key] = targetRevision[key];
        }
    }
    revisions[targetRevisionHash] = newRevision;


    let data: AquaOperationData = {
        aquaTree: aquaTreeView.aquaTree,
        aquaTrees: [],
        logData: logs
    }
    return Ok(data)
}



/**
 * Restores a previously hidden form element
 * 
 * @param aquaTreeView - View containing the Aqua Tree data structure
 * @param keyToUnHide - Key of the form element to restore
 * @param content - New content to set for the restored element
 * @returns Result containing either updated AquaOperationData or error logs
 * 
 * This function:
 * - Finds the target revision
 * - Locates the deleted form key
 * - Creates a new revision with the element restored and updated content
 */
export function unHideFormElementsUtil(aquaTreeView: AquaTreeView, keyToUnHide: string, content: string): Result<AquaOperationData, LogData[]> {

    let logs: Array<LogData> = [];

    let targetRevisionHash = "";


    if (aquaTreeView.revision.length > 1) {
        targetRevisionHash = aquaTreeView.revision
    } else {
        targetRevisionHash = getLatestVH(aquaTreeView.aquaTree)
    }

    const targetRevision = aquaTreeView.aquaTree.revisions[targetRevisionHash];

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


    const revisions: any = aquaTreeView.aquaTree.revisions;


    // Update operation
    if (formKey.endsWith('.deleted')) {
        // Restore deleted field
        const originalKey = formKey.replace('.deleted', '');

        let newRevision:  { [key: string]: any } = {};
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
        aquaTree: aquaTreeView.aquaTree,
        aquaTrees: [],
        logData: logs
    }
    return Ok(data)
}