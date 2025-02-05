import { Result, Err } from "rustic";
import { Revision, AquaOperationData, LogData, AquaObject, AquaObjectWrapper, WitnessNetwork, WitnessType } from "../types";


export async function verifyWitnessUtil(witness: Revision): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    return Err(logs)
}

export async function witnessAquaObjectUtil(aquaObject: AquaObject, hash: string, witnessType: WitnessType, witnessNetwork: WitnessNetwork, enableScalar: boolean = false): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    return Err(logs)
}

export async function witnessMultipleAquaObjectsUtil(aquaObjects: AquaObjectWrapper[], witnessType: WitnessType, witnessNetwork: WitnessNetwork, enableScalar: boolean = false): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    return Err(logs)
}