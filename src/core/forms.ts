import { Result, Err } from "rustic";
import { Revision, AquaOperationData, LogData, AquaObject } from "../types";

export async function verifyFormUtil(formRevision: Revision): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    return Err(logs)
}


export async function LinkAquaObjectToFormUtil(aquaObject: AquaObject): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    return Err(logs)
}
