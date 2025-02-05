import { Result, Err } from "rustic";
import { Revision, AquaOperationData, LogData, AquaObject, AquaObjectWrapper } from "../types";



export async function verifyLinkUtil(signature: Revision): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    return Err(logs)
}


export async function linkAquaObjectUtil(aquaObject: AquaObject): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    return Err(logs)
}

export async function linkMultipleAquaObjectsUtil(aquaObjects: AquaObjectWrapper[]): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    return Err(logs)
}