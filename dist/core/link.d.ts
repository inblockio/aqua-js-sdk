import { Result } from "rustic";
import { Revision, AquaOperationData, LogData, AquaObject, AquaObjectWrapper } from "../types";
export declare function verifyLinkUtil(revision: Revision): Promise<Result<AquaOperationData, LogData[]>>;
export declare function linkAquaObjectUtil(aquaObject: AquaObject, linkAquaObjectWrapper: AquaObjectWrapper, enableScalar: boolean): Promise<Result<AquaOperationData, LogData[]>>;
export declare function linkMultipleAquaObjectsUtil(aquaObjects: AquaObjectWrapper[]): Promise<Result<AquaOperationData, LogData[]>>;
