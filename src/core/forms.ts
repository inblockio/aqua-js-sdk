
import { createAquaTree } from "../aquavhtree";
import { Err, isErr, Ok, Result } from "../type_guards";
import { Revision, AquaOperationData, LogData, AquaTree, AquaTreeWrapper, LogType, FileObject } from "../types";
import { checkFileHashAlreadyNotarized, createNewAquaTree, dict2Leaves, getHashSum, getMerkleRoot, getTimestamp, maybeUpdateFileIndex, prepareNonce } from "../utils";


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
            log: `  ⏺️  Scalar enabled`,
            logType: LogType.INFO
        });
        let stringifiedData = JSON.stringify(verificationData)

        verificationHash = "0x" + getHashSum(stringifiedData);
    } else {
        verificationData.leaves = leaves
        verificationHash = getMerkleRoot(leaves); // tree.getHexRoot();
    }

    const aquaTree = createNewAquaTree();
    aquaTree.revisions[verificationHash] = verificationData;

    let aquaTreeUpdatedResult = maybeUpdateFileIndex(aquaTree, verificationHash, revisionType, fileObject.fileName, "")

    if (isErr(aquaTreeUpdatedResult)) {
        logs.push(...aquaTreeUpdatedResult.data);
        return Err(logs);
    }
    let aquaTreeUpdated = aquaTreeUpdatedResult.data
    // Tree creation
    let aquaTreeWithTree = createAquaTree(aquaTreeUpdated)

    logs.push({
        log: `  ✅  Form  revision created succesfully`,
        logType: LogType.SUCCESS
    });

    let result: AquaOperationData = {
        aquaTree: aquaTreeWithTree, //aquaTreeWithTree,
        aquaTrees: null,
        logData: logs
    }


    return Ok(result);

}
export function hideFormElementsUtil(_aquaTree: AquaTree, _elementsToHide: string[]): Result<AquaOperationData, LogData[]> {

    let logs: Array<LogData> = [];
    return Err(logs)
}


export async function LinkAquaTreeToFormUtil(_aquaTree: AquaTree): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];


    return Err(logs)
}



