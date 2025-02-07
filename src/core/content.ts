import { Result, Err, Ok } from "rustic";
import { AquaObjectWrapper, AquaOperationData, FileObject, LogData, LogType } from "../types";
import { checkFileHashAlreadyNotarized, dict2Leaves, formatMwTimestamp, getHashSum, maybeUpdateFileIndex, prepareNonce } from "../utils";
import MerkleTree from "merkletreejs";
import { createAquaTree } from "../aquavhtree";


export async function createContentRevisionUtil(aquaObjectWrapper: AquaObjectWrapper, fileObject: FileObject, enableScalar: boolean): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];

    const now = new Date().toISOString()
    const timestamp = formatMwTimestamp(now.slice(0, now.indexOf(".")))
    let revisionType = "file";


    const verificationHashes = Object.keys(aquaObjectWrapper.aquaObject.revisions);
    let lastRevisionHash = verificationHashes[verificationHashes.length - 1];


    let verificationData: any = {
        previous_verification_hash: lastRevisionHash,
        local_timestamp: timestamp,
        revision_type: revisionType,
    }

    let fileHash = getHashSum(fileObject.fileContent)

    let alreadyNotarized = checkFileHashAlreadyNotarized(fileHash, aquaObjectWrapper.aquaObject)

    if (alreadyNotarized) {
        logs.push({
            log: `file ${fileObject.fileName} has already been notarized.`,
            logType: LogType.ERROR
        })
        return Err(logs)
    }

    verificationData["content"] = fileObject.fileContent;
    verificationData["file_hash"] = fileHash
    verificationData["file_nonce"] = prepareNonce()

    // Merklelize the dictionary
    const leaves = dict2Leaves(verificationData)
    const tree = new MerkleTree(leaves, getHashSum, {
        duplicateOdd: false,
    })

    let verification_hash = "";
    if (!enableScalar) {
        verification_hash = "0x" + getHashSum(JSON.stringify(verificationData))
        verificationData.leaves = leaves
    } else {
        verification_hash = tree.getHexRoot()
    }

    const revisions = aquaObjectWrapper.aquaObject.revisions
    revisions[verification_hash] = verificationData


    maybeUpdateFileIndex(aquaObjectWrapper.aquaObject, verificationData, revisionType, fileObject.fileName, "");
    
    let aquaObjectWithTree = createAquaTree(aquaObjectWrapper.aquaObject)

    let result: AquaOperationData = {
        aquaObject: aquaObjectWithTree,
        aquaObjects: null,
        logData: logs
    }
    return Ok(result)
}

export async function getFileByHashUtil(hash: String): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];


    return Err(logs)
}