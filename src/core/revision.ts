import { Result, Err, Option } from "rustic";
import { AquaObject, AquaOperationData, LogData, RevisionType, FileObject, Revision } from "../types";


export function removeLastRevisionUtil(aquaObject: AquaObject): Result<AquaOperationData, LogData[]> {
    let logs: Array<LogData> = [];
    return Err(logs)
}

export async function createNewRevisionUtil(timestamp: string, revisionType: RevisionType, enableScalar: boolean, fileObject: Option<FileObject>): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    return Err(logs);
}


export async function getRevisionByHashUtil(aquaObject: AquaObject): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    return Err(logs);
}