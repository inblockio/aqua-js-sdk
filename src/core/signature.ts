import { Result, Err, Option } from "rustic";
import { Revision, AquaOperationData, LogData, AquaObject, AquaObjectWrapper, SignType, CredentialsData } from "../types";



export async function verifySignatureUtil(signature: Revision): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    return Err(logs)
}


export async function signAquaObjectUtil(aquaObject: AquaObject, hash: string, signType: SignType, credentials: Option<CredentialsData>): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    return Err(logs)
}

export async function signMultipleAquaObjectsUtil(aquaObjects: AquaObjectWrapper[], signType: SignType, credentials: Option<CredentialsData>): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    return Err(logs)
}