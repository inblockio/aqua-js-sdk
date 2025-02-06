import { Result, Err, Option, Ok } from "rustic";
import { AquaObject, AquaOperationData, LogData, RevisionType, FileObject, Revision, LogType } from "../types";


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

    let result: AquaOperationData = {
        aquaObject: aquaObject,
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

export async function createGenesisRevision(timestamp: string, revisionType: RevisionType, fileObject: Option<FileObject>, enableScalar: boolean): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];

    return Err(logs);
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