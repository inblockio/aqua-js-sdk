import { Result } from "rustic";
import { Revision, AquaOperationData, LogData, AquaObject } from "../types";
export declare function hideFormElementsUtil(aquaObject: AquaObject, elementsToHide: string[]): Result<AquaOperationData, LogData[]>;
export declare function verifyFormUtil(formRevision: Revision): Promise<Result<AquaOperationData, LogData[]>>;
export declare function LinkAquaObjectToFormUtil(aquaObject: AquaObject): Promise<Result<AquaOperationData, LogData[]>>;
