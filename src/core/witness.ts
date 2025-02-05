import { Result, Err } from "rustic";
import { Revision, AquaOperationData, LogData, AquaObject, AquaObjectWrapper } from "../types";


export async function verifyWitnessUtil(witness: Revision): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    return Err(logs)
}

export async function witnessAquaObjectUtil(aquaObject: AquaObject): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    return Err(logs)
}

export async function witnessMultipleAquaObjectsUtil(aquaObjects: AquaObjectWrapper[]): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    return Err(logs)
}