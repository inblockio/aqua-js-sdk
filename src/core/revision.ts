
import { AquaObject, AquaOperationData, LogData,  FileObject, Revision, LogType } from "../types";
import {  createNewAquaObject, dict2Leaves, formatMwTimestamp, getHashSum, getMerkleRoot, maybeUpdateFileIndex, prepareNonce } from "../utils";
import { createAquaTree } from "../aquavhtree";
import { Err, Ok, Result } from "../type_guards";



export function removeLastRevisionUtil(aquaObject: AquaObject): Result<AquaOperationData, LogData[]> {
    let logs: Array<LogData> = [];

    const revisions = aquaObject.revisions
    const verificationHashes = Object.keys(revisions)
    const lastRevisionHash = verificationHashes[verificationHashes.length - 1]

    const lastRevision = aquaObject.revisions[lastRevisionHash]
    switch (lastRevision.revision_type) {
        case "file":
            delete aquaObject.file_index[lastRevision.file_hash!!]
            break
        case "link":
            for (const vh of lastRevision.link_verification_hashes) {
                delete aquaObject.file_index[vh]
            }
    }

    delete aquaObject.revisions[lastRevisionHash]
    logs.push({
        log: `Most recent revision ${lastRevisionHash} has been removed`,
        logType: LogType.INFO
    })

    let newAquaObject = createAquaTree(aquaObject)

    let result: AquaOperationData = {
        aquaObject: newAquaObject,
        aquaObjects: null,
        logData: logs
    }
    // file can be deleted
    if (Object.keys(aquaObject.revisions).length === 0) {

        logs.push({
            log: `The last  revision has been deleted  there are no revisions left.`,
            logType: LogType.HINT
        })
        result.aquaObject = null
 
        return Ok(result)
    } else {

        logs.push({
            log: `A revision  has been removed.`,
            logType: LogType.SUCCESS
        })

        return Ok(result)
    }

}

// improve this function t work with form as genesis
export async function createGenesisRevision(fileObject: FileObject, isForm: boolean , enableContent: boolean, enableScalar: boolean): Promise<Result<AquaOperationData, LogData[]>> {
    //timestamp: string, revisionType: RevisionType,
    let logs: Array<LogData> = [];


    const now = new Date().toISOString()
    const timestamp = formatMwTimestamp(now.slice(0, now.indexOf(".")))
    let revisionType = "file";

    if (isForm) {
        revisionType = "form"
    }

    let verificationData: any = {
        previous_verification_hash: "",
        local_timestamp: timestamp,
        revision_type: revisionType,
    }


    verificationData["file_hash"] = getHashSum(fileObject.fileContent)
    verificationData["file_nonce"] = prepareNonce()

    switch (revisionType) {
        case "file":
            if (enableContent) {
                verificationData["content"] = fileObject.fileContent

                logs.push({
                    log: `📄 content flag detected.`,
                    logType: LogType.INFO
                });
            }

            break
        case "form":


            let form_data_json: any = {}
            try {
                // Attempt to parse the JSON data
                form_data_json = JSON.parse(fileObject.fileContent)
            } catch (parseError) {
                // Handle invalid JSON data
                console.error("Error: The file does not contain valid JSON data.")
                process.exit(1)
            }

            // Sort the keys
            let form_data_sorted_keys = Object.keys(form_data_json)
            let form_data_sorted_with_prefix: any = {}
            for (let key of form_data_sorted_keys) {
                form_data_sorted_with_prefix[`forms_${key}`] = form_data_json[key]
            }

            verificationData = {
                ...verificationData,
                ...form_data_sorted_with_prefix,
            }
            break

        default:
            logs.push({
                log: `Genesis revision can either be form  or file.`,
                logType: LogType.ERROR
            })
            return Err(logs);


    }

    const leaves = dict2Leaves(verificationData)
    // const tree = new MerkleTree(leaves, getHashSum, {
    //     duplicateOdd: false,
    // })
    let verificationHash = "";
    if (enableScalar) {
        verificationHash = "0x" + getHashSum(JSON.stringify(verificationData));

        verificationData.leaves = leaves
    } else {
        verificationHash = getMerkleRoot(leaves); // tree.getHexRoot();
    }

    const aquaObject = createNewAquaObject();
    const revisions = aquaObject.revisions
    revisions[verificationHash] = verificationData.feeData


    maybeUpdateFileIndex(aquaObject, verificationData, revisionType, fileObject.fileName, "")

    // Tree creation
    // let aquaObjectWithTree = createAquaTree(aquaObject)

    let result: AquaOperationData = {
        aquaObject: aquaObject, //aquaObjectWithTree,
        aquaObjects: null,
        logData: logs
    }

    return Ok(result);


}


export function getRevisionByHashUtil(aquaObject: AquaObject, revisionHash: string): Result<Revision, LogData[]> {
    let logs: Array<LogData> = [];

    const verificationHashes = Object.keys(aquaObject.revisions)

    if (verificationHashes.includes(revisionHash)) {
        return Ok(aquaObject.revisions[revisionHash]);
    } else {
        logs.push({
            log: `Revision with hash : ${revisionHash} not found`,
            logType: LogType.ERROR
        })
        return Err(logs);
    }

}

export function getLastRevisionUtil(aquaObject: AquaObject): Result<Revision, LogData[]> {
    let logs: Array<LogData> = [];

    const verificationHashes = Object.keys(aquaObject.revisions);

    if (verificationHashes.length == 0) {
        logs.push({
            log: `aqua object has no revisions`,
            logType: LogType.ERROR
        })
        return Err(logs);
    }
    const lastRevisionHash = verificationHashes[verificationHashes.length - 1]
    return Ok(aquaObject.revisions[lastRevisionHash]);


}