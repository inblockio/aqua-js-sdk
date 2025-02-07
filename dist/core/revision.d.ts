import { Result } from "rustic";
import { AquaObject, AquaOperationData, LogData, FileObject, Revision } from "../types";
export declare function removeLastRevisionUtil(aquaObject: AquaObject): Result<AquaOperationData, LogData[]>;
export declare function createGenesisRevision(fileObject: FileObject, isForm: boolean, enableContent: boolean, enableScalar: boolean): Promise<Result<AquaOperationData, LogData[]>>;
export declare function getRevisionByHashUtil(aquaObject: AquaObject, revisionHash: string): Result<Revision, LogData[]>;
export declare function getLastRevisionUtil(aquaObject: AquaObject): Result<Revision, LogData[]>;
