
import { Err, Result } from "../type_guards";
import { Revision, AquaOperationData, LogData, AquaTree } from "../types";


export  function hideFormElementsUtil(_aquaTree: AquaTree, _elementsToHide: string[]): Result<AquaOperationData, LogData[]> {
   
    let logs: Array<LogData> = [];
    return Err(logs)
}


export async function verifyFormUtil(_formRevision: Revision): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    return Err(logs)
}


export async function LinkAquaTreeToFormUtil(_aquaTree: AquaTree): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];

    
    return Err(logs)
}



