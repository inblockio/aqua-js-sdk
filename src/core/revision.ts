
import { AquaTree, AquaOperationData, LogData, FileObject, Revision, LogType } from "../types";
import { createNewAquaTree, dict2Leaves, formatMwTimestamp, getHashSum, getMerkleRoot, maybeUpdateFileIndex, prepareNonce } from "../utils";
import { createAquaTree } from "../aquavhtree";
import { Err, isErr, Ok, Result } from "../type_guards";



export function removeLastRevisionUtil(aquaTree: AquaTree): Result<AquaOperationData, LogData[]> {
    let logs: Array<LogData> = [];

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
        logType: LogType.INFO
    })

    let newAquaTree = createAquaTree(aquaTree)

    let result: AquaOperationData = {
        aquaTree: newAquaTree,
        aquaTrees: null,
        logData: logs
    }
    // file can be deleted
    if (Object.keys(aquaTree.revisions).length === 0) {

        logs.push({
            log: `The last  revision has been deleted  there are no revisions left.`,
            logType: LogType.HINT
        })
        result.aquaTree = null

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
export async function createGenesisRevision(fileObject: FileObject, isForm: boolean, enableContent: boolean, enableScalar: boolean): Promise<Result<AquaOperationData, LogData[]>> {
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


            let formDataJson: any = {}
            try {
                // Attempt to parse the JSON data
                formDataJson = JSON.parse(fileObject.fileContent)
            } catch (parseError) {
                logs.push({
                    log: `❌  Error: The file ${fileObject.fileName} does not contain valid JSON data.`,
                    logType: LogType.ERROR
                });
                return Err(logs);
            }

            // Sort the keys
            let formDataSortedKeys = Object.keys(formDataJson)
            let formDataSortedWithPrefix: any = {}
            for (let key of formDataSortedKeys) {
                formDataSortedWithPrefix[`forms_${key}`] = formDataJson[key]
            }

            verificationData = {
                ...verificationData,
                ...formDataSortedWithPrefix,
            }
            break

        default:
            logs.push({
                log: `❌ Genesis revision can either be form  or file.`,
                logType: LogType.ERROR
            })
            return Err(logs);


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
        verificationHash = getMerkleRoot(leaves); 
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
        log: `  ✅  Genesis revision created succesfully`,
        logType: LogType.SUCCESS
    });

    let result: AquaOperationData = {
        aquaTree: aquaTreeWithTree, //aquaTreeWithTree,
        aquaTrees: null,
        logData: logs
    }


    return Ok(result);


}


export function getRevisionByHashUtil(aquaTree: AquaTree, revisionHash: string): Result<Revision, LogData[]> {
    let logs: Array<LogData> = [];

    const verificationHashes = Object.keys(aquaTree.revisions)

    if (verificationHashes.includes(revisionHash)) {
        return Ok(aquaTree.revisions[revisionHash]);
    } else {

        logs.push({
            log: `❌ Revision with hash : ${revisionHash} not found`,
            logType: LogType.ERROR
        })
        return Err(logs);
    }

}

export function getLastRevisionUtil(aquaTree: AquaTree): Result<Revision, LogData[]> {
    let logs: Array<LogData> = [];

    const verificationHashes = Object.keys(aquaTree.revisions);

    if (verificationHashes.length == 0) {

        logs.push({
            log: `❌ aqua object has no revisions`,
            logType: LogType.ERROR
        })
        return Err(logs);
    }
    const lastRevisionHash = verificationHashes[verificationHashes.length - 1]
    return Ok(aquaTree.revisions[lastRevisionHash]);


}