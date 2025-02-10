
import { Err, Result } from "../type_guards";
import { Revision, AquaOperationData, LogData, AquaObject } from "../types";


export  function hideFormElementsUtil(_aquaObject: AquaObject, _elementsToHide: string[]): Result<AquaOperationData, LogData[]> {
   
    let logs: Array<LogData> = [];
    return Err(logs)
}


export async function verifyFormUtil(_formRevision: Revision): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    return Err(logs)
}


export async function LinkAquaObjectToFormUtil(_aquaObject: AquaObject): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];

    
    return Err(logs)
}



