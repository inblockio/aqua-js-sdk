import { Result, Err } from "rustic";
import { AquaObjectWrapper, AquaOperationData, LogData } from "../types";


export async function createContentRevisionUtil(aquaObject: AquaObjectWrapper, enableScalar: boolean): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    return Err(logs)
}

export async function getFileByHashUtil(hash: String): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    return Err(logs)
}