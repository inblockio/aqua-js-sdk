import { Result, Err } from "rustic";
import { Revision, AquaOperationData, LogData, AquaObject, AquaObjectWrapper } from "../types";



export async function verifySignatureUtil(signature: Revision): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    return Err(logs)
}


export async function signAquaObjectUtil(aquaObject: AquaObject): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    return Err(logs)
}

export async function signMultipleAquaObjectsUtil(aquaObjects: AquaObjectWrapper[]): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    return Err(logs)
}