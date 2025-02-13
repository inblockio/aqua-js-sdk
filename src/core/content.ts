
import { AquaTree, AquaTreeWrapper, AquaOperationData, FileObject, LogData, LogType } from "../types";
import { checkFileHashAlreadyNotarized, dict2Leaves, formatMwTimestamp, getHashSum, getMerkleRoot, maybeUpdateFileIndex, prepareNonce } from "../utils";

import { createAquaTree } from "../aquavhtree";
import { Err, Ok, Result } from "../type_guards";


export async function createContentRevisionUtil(aquaTreeWrapper: AquaTreeWrapper, fileObject: FileObject, enableScalar: boolean): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];

    const now = new Date().toISOString()
    const timestamp = formatMwTimestamp(now.slice(0, now.indexOf(".")))
    let revisionType = "file";


    const verificationHashes = Object.keys(aquaTreeWrapper.aquaTree.revisions);
    let lastRevisionHash = verificationHashes[verificationHashes.length - 1];


    let verificationData: any = {
        previous_verification_hash: lastRevisionHash,
        local_timestamp: timestamp,
        revision_type: revisionType,
    }

    let fileHash = getHashSum(fileObject.fileContent)

    let alreadyNotarized = checkFileHashAlreadyNotarized(fileHash, aquaTreeWrapper.aquaTree)

    if (alreadyNotarized) {

        logs.push({
            log: `File ${fileObject.fileName} has already been notarized.`,
            logType: LogType.ERROR
        })
        return Err(logs)
    }

    verificationData["content"] = fileObject.fileContent;
    verificationData["file_hash"] = fileHash
    verificationData["file_nonce"] = prepareNonce()

    // Merklelize the dictionary
    const leaves = dict2Leaves(verificationData)


    let verification_hash = "";
    if (!enableScalar) {
        verification_hash = "0x" + getHashSum(JSON.stringify(verificationData))
        verificationData.leaves = leaves
    } else {
        verification_hash = getMerkleRoot(leaves); // tree.getHexRoot()
    }

    const revisions = aquaTreeWrapper.aquaTree.revisions
    revisions[verification_hash] = verificationData

    maybeUpdateFileIndex(aquaTreeWrapper.aquaTree, verificationData, revisionType, fileObject.fileName, "");

    let aquaTreeWithTree = createAquaTree(aquaTreeWrapper.aquaTree)

    logs.push({
        log: `content revision created succesfully`,
        logType: LogType.SUCCESS
    });

    let result: AquaOperationData = {
        aquaTree: aquaTreeWithTree,
        aquaTrees: null,
        logData: logs
    }



    return Ok(result)
}

export async function getFileByHashUtil(aquaTree: AquaTree, hash: string): Promise<Result<string, LogData[]>> {
    let logs: Array<LogData> = [];

    let res = aquaTree.file_index[hash]

    if (res) {
        logs.push({
            log: `File with hash  found`,
            logType: LogType.SUCCESS
        });
        return Ok(res)
    } else {

        logs.push({
            log: `File with hash ot found`,
            logType: LogType.ERROR
        });
        return Err(logs)
    }

}

